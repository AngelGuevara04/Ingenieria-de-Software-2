// script-docente.js
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) return window.location.href = 'login.html';

  const q = query(collection(db, "residencias"), where("asesorId", "==", user.uid));
  const snapshot = await getDocs(q);
  const lista = document.getElementById("lista-alumnos");
  const reportesPendientes = document.getElementById("reportes-pendientes");
  const proyectosFinales = document.getElementById("proyectos-finales");

  snapshot.forEach(async (resDoc) => {
    const data = resDoc.data();
    const uid = resDoc.id;
    const alumnoCard = document.createElement("div");
    alumnoCard.innerHTML = `<strong>Alumno:</strong> ${uid}`;
    lista.appendChild(alumnoCard);

    if (data.reportes && data.reportes.length > 0) {
      data.reportes.forEach((reporte, index) => {
        const div = document.createElement("div");
        div.innerHTML = `
          <a href="${reporte.url}" target="_blank">Reporte ${index + 1}</a>
          <form data-uid="${uid}" data-index="${index}" class="form-calificar">
            <input type="number" placeholder="Calificación" required min="0" max="100">
            <input type="text" placeholder="Observaciones">
            <button type="submit">Calificar</button>
          </form>
        `;
        reportesPendientes.appendChild(div);
      });
    }

    if (data.proyectoFinal?.url) {
      const finalDiv = document.createElement("div");
      finalDiv.innerHTML = `
        <a href="${data.proyectoFinal.url}" target="_blank">Ver Proyecto Final</a>
        <form data-uid="${uid}" class="form-final">
          <input type="number" placeholder="Calificación" required min="0" max="100">
          <button type="submit">Calificar Proyecto Final</button>
        </form>
      `;
      proyectosFinales.appendChild(finalDiv);
    }
  });

  // Calificar reportes
  document.addEventListener("submit", async (e) => {
    if (e.target.matches(".form-calificar")) {
      e.preventDefault();
      const uid = e.target.dataset.uid;
      const index = parseInt(e.target.dataset.index);
      const calificacion = parseInt(e.target[0].value);
      const observaciones = e.target[1].value;

      const ref = doc(db, "residencias", uid);
      const snap = await getDoc(ref);
      const data = snap.data();
      data.reportes[index].calificacion = calificacion;
      data.reportes[index].observaciones = observaciones;
      await updateDoc(ref, { reportes: data.reportes });
      alert("Reporte calificado.");
    }

    if (e.target.matches(".form-final")) {
      e.preventDefault();
      const uid = e.target.dataset.uid;
      const calificacion = parseInt(e.target[0].value);
      const ref = doc(db, "residencias", uid);
      await updateDoc(ref, { "proyectoFinal.calificacion": calificacion });
      alert("Proyecto final calificado.");
    }
  });
});
