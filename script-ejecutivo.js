// script-ejecutivo.js
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) return window.location.href = 'login.html';

  const docsContainer = document.getElementById("lista-documentos");
  const proyectosContainer = document.getElementById("proyectos-curso");
  const finalesContainer = document.getElementById("finales-revision");
  const alumnoSelect = document.getElementById("alumno");
  const docenteSelect = document.getElementById("docente");
  const asignarForm = document.getElementById("form-asignar-asesor");

  const resSnapshot = await getDocs(collection(db, "residencias"));
  resSnapshot.forEach(docSnap => {
    const data = docSnap.data();
    const uid = docSnap.id;

    // Validación documental
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>Alumno:</strong> ${uid}<br>
      Anteproyecto: ${data.anteproyectoURL ? `<a href='${data.anteproyectoURL}' target='_blank'>Ver</a>` : "Pendiente"}<br>
      Proyecto Final: ${data.proyectoFinal?.url ? `<a href='${data.proyectoFinal.url}' target='_blank'>Ver</a>` : "Pendiente"}<br><hr>`;
    docsContainer.appendChild(div);

    // Proyectos en curso
    const proyectoDiv = document.createElement("div");
    proyectoDiv.textContent = `Alumno: ${uid} | Estado: ${data.estado || 'En revisión'}`;
    proyectosContainer.appendChild(proyectoDiv);

    // Proyectos Finales
    if (data.proyectoFinal?.url) {
      const finalDiv = document.createElement("div");
      finalDiv.innerHTML = `
        <a href="${data.proyectoFinal.url}" target="_blank">Ver Proyecto Final</a><br>
        Calificación: ${data.proyectoFinal.calificacion ?? "Sin calificar"}<hr>
      `;
      finalesContainer.appendChild(finalDiv);
    }

    // llenar selects para asignación
    const alumnoOption = document.createElement("option");
    alumnoOption.value = uid;
    alumnoOption.textContent = uid;
    alumnoSelect.appendChild(alumnoOption);
  });

  // Esto debe ser reemplazado por una consulta real a docentes:
  // Simulación básica:
  const docentes = ["docente1", "docente2", "docente3"];
  docentes.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d;
    docenteSelect.appendChild(opt);
  });

  asignarForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const alumnoId = alumnoSelect.value;
    const docenteId = docenteSelect.value;
    const ref = doc(db, "residencias", alumnoId);
    await updateDoc(ref, { asesorId: docenteId });
    alert("Asesor asignado correctamente.");
  });
});
