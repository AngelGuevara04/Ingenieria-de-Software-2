// script-alumno.js
import { auth, db, storage } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { doc, updateDoc, arrayUnion, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    const residenciaRef = doc(db, "residencias", uid);

    // Subir anteproyecto
    const formAnteproyecto = document.getElementById('form-anteproyecto');
    formAnteproyecto.addEventListener('submit', async (e) => {
      e.preventDefault();
      const archivo = document.getElementById('archivo').files[0];
      const storageRef = ref(storage, `anteproyectos/${uid}.pdf`);
      await uploadBytes(storageRef, archivo);
      const url = await getDownloadURL(storageRef);
      await updateDoc(residenciaRef, { anteproyectoURL: url });
      alert("Anteproyecto subido correctamente.");
    });

    // Subir reportes parciales
    const formReporte = document.getElementById('form-reporte');
    formReporte.addEventListener('submit', async (e) => {
      e.preventDefault();
      const archivo = document.getElementById('reporte').files[0];
      const timestamp = Date.now();
      const storageRef = ref(storage, `reportes/${uid}_${timestamp}.pdf`);
      await uploadBytes(storageRef, archivo);
      const url = await getDownloadURL(storageRef);
      await updateDoc(residenciaRef, {
        reportes: arrayUnion({ url, fecha: new Date().toISOString() })
      });
      alert("Reporte subido correctamente.");
    });

    // Subir proyecto final
    const formFinal = document.getElementById('form-final');
    formFinal.addEventListener('submit', async (e) => {
      e.preventDefault();
      const archivo = document.getElementById('final').files[0];
      const storageRef = ref(storage, `finales/${uid}.pdf`);
      await uploadBytes(storageRef, archivo);
      const url = await getDownloadURL(storageRef);
      await updateDoc(residenciaRef, {
        proyectoFinal: { url, calificacion: null }
      });
      alert("Proyecto final subido correctamente.");
    });
  } else {
    window.location.href = 'login.html';
  }
});
