document.addEventListener('DOMContentLoaded', () => {

  // Función para manejar el formulario de subir documentos
  const uploadForm = document.getElementById('upload-form');
  uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const file = document.getElementById('document').files[0];
    if (file) {
      alert('Documento subido correctamente.');
    }
  });

  // Función para crear publicaciones
  const publicationForm = document.getElementById('publication-form');
  publicationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    alert('Publicación creada: ' + title);
  });

  // Función para crear clases
  const createClassForm = document.getElementById('create-class-form');
  createClassForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const className = document.getElementById('class-name').value;
    const classDescription = document.getElementById('class-description').value;
    alert('Clase creada: ' + className);
  });

  // Función para agregar alumnos a clases
  const addStudentsForm = document.getElementById('add-students-form');
  addStudentsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const selectedClass = document.getElementById('class-select').value;
    const selectedStudent = document.getElementById('student-select').value;
    alert(`Alumno ${selectedStudent} agregado a la clase ${selectedClass}`);
  });
});
