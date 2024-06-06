document.addEventListener('DOMContentLoaded', () => {
    // Obtener referencias a los elementos
    const AdmNwUsModal = document.getElementById('NewUser-modal');
    const AdmNwUsUpdateBtn = document.querySelector('.AdmNwUsUpdate-btn');
    const AdmNwUsCancelBtn = document.querySelector('.AdmNwUsCancel-btn');
    const AdmNwUsForm = document.getElementById('AdmNwUs-info');
    const AdmNwUsProfilePic = document.getElementById('AdmNwUsProfile-pic');
    const AdmNwUsUploadInput = document.getElementById('photo-AdmNwUsUpload');
    const AdmNwUsPhoneInput = document.getElementById('phone');
    const AdmNwUsIdInput = document.getElementById('id');

    // Función para cerrar el modal
    const AdmNwUsCloseModal = () => {
        AdmNwUsModal.style.display = 'none';
    };

    // Manejador de clic para el botón ACTUALIZAR
    AdmNwUsUpdateBtn.addEventListener('click', (event) => {
        event.preventDefault(); // Prevenir el comportamiento por defecto del botón
        // Obtener datos del formulario
        const AdmNwUsFormData = new FormData(AdmNwUsForm);

 // Añadir el archivo de la imagen si existe
        if (AdmNwUsUploadInput.files.length > 0) {
            AdmNwUsFormData.append('photo', AdmNwUsUploadInput.files[0]);
        }
        
        const AdmNwUsData = {};
        AdmNwUsFormData.forEach((value, key) => {
            AdmNwUsData[key] = value;
        });

        // Simular envío de datos
        console.log('Datos enviados:', AdmNwUsData);

        // Cerrar el modal
        AdmNwUsCloseModal();
    });

    // Manejador de clic para el botón CANCELAR
    AdmNwUsCancelBtn.addEventListener('click', (event) => {
        event.preventDefault(); // Prevenir el comportamiento por defecto del botón
        // Cerrar el modal
        AdmNwUsCloseModal();
    });

    // Manejador de clic para cerrar el modal al hacer clic fuera del contenido
    window.addEventListener('click', (event) => {
        if (event.target == AdmNwUsModal) {
            AdmNwUsCloseModal();
        }
    });

    // Nueva función para manejar la subida de archivos
    AdmNwUsUploadInput.addEventListener('change', (event) => {
        const AdmNwUsFile = event.target.files[0];
        if (AdmNwUsFile) {
            const AdmNwUsReader = new FileReader();
            AdmNwUsReader.onload = (e) => {
                AdmNwUsProfilePic.src = e.target.result;
            };
            AdmNwUsReader.readAsDataURL(AdmNwUsFile);
        }
    });

    // Validar que solo se ingresen números en el campo de teléfono
    AdmNwUsPhoneInput.addEventListener('input', (event) => {
        event.target.value = event.target.value.replace(/[^0-9]/g, '');
    });

    // Validar que solo se ingresen números en el campo de identificación
    AdmNwUsIdInput.addEventListener('input', (event) => {
        event.target.value = event.target.value.replace(/[^0-9]/g, '');
    });
});
