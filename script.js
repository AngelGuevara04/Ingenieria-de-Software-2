// Configuración de Firebase
import { getAuth, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs, query, where, getDoc, doc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

const auth = getAuth();
const db = getFirestore();

// Autenticación de usuario
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    alert(`Bienvenido ${user.displayName || user.email}`);
    window.location.href = "dashboard-docente.html"; // Redirigir al panel del docente
  } catch (error) {
    alert('Error al iniciar sesión: ' + error.message);
  }
});

// Crear Publicación
const publicationForm = document.getElementById('publication-form');
publicationForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  
  try {
    const docRef = await addDoc(collection(db, "publicaciones"), {
      title: title,
      content: content,
      createdAt: new Date()
    });
    alert("Publicación creada con éxito");
  } catch (error) {
    alert("Error al crear publicación: " + error.message);
  }
});

// Crear Clase
const createClassForm = document.getElementById('create-class-form');
createClassForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const className = document.getElementById('class-name').value;
  const classDescription = document.getElementById('class-description').value;
  
  try {
    const docRef = await addDoc(collection(db, "clases"), {
      name: className,
      description: classDescription,
      createdAt: new Date()
    });
    alert("Clase creada con éxito");
  } catch (error) {
    alert("Error al crear clase: " + error.message);
  }
});

// Agregar Alumno a la Clase
const addStudentsForm = document.getElementById('add-students-form');
addStudentsForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const classId = document.getElementById('class-select').value;
  const studentId = document.getElementById('student-select').value;
  
  try {
    const docRef = await addDoc(collection(db, "clases", classId, "alumnos"), {
      studentId: studentId,
      enrolledAt: new Date()
    });
    alert("Alumno agregado con éxito");
  } catch (error) {
    alert("Error al agregar alumno: " + error.message);
  }
});
