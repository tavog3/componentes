document.addEventListener('DOMContentLoaded', () => {
    // Obtener referencias a los elementos
    const EditAdmUserModal = document.getElementById('AdminEditUser-modal');
    const EditAdmUserUpdateBtn = document.querySelector('.EditAdmUpdate-btn');
    const EditAdmUserCancelBtn = document.querySelector('.EditAdmCancel-btn');
    const EditAdmUserForm = document.getElementById('EditAdmUser-info'); // Ajuste para el id del formulario
    const EditAdmUserPhoneInput = document.getElementById('phone');
    const EditAdmUserIdInput = document.getElementById('id');

    // Función para cerrar el modal
    const EditAdmUserCloseModal = () => {
        EditAdmUserModal.style.display = 'none';
    };

    // Manejador de clic para el botón ACTUALIZAR
    EditAdmUserUpdateBtn.addEventListener('click', (event) => {
        event.preventDefault(); // Prevenir el comportamiento por defecto del botón

        // Obtener datos del formulario
        const EditAdmUserFormData = new FormData(EditAdmUserForm);
        const EditAdmUserData = {};
        EditAdmUserFormData.forEach((value, key) => {
            EditAdmUserData[key] = value;
        });

        // Simular envío de datos
        console.log('Datos enviados:', EditAdmUserData);

        // Cerrar el modal
        EditAdmUserCloseModal();
    });

    // Manejador de clic para el botón CANCELAR
    EditAdmUserCancelBtn.addEventListener('click', (event) => {
        event.preventDefault(); // Prevenir el comportamiento por defecto del botón
        // Cerrar el modal
        EditAdmUserCloseModal();
    });

    // Manejador de clic para cerrar el modal al hacer clic fuera del contenido
    window.addEventListener('click', (event) => {
        if (event.target == EditAdmUserModal) {
            EditAdmUserCloseModal();
        }
    });

    // Validar que solo se ingresen números en el campo de teléfono
    EditAdmUserPhoneInput.addEventListener('input', (event) => {
        event.target.value = event.target.value.replace(/[^0-9]/g, '');
    });

    // Validar que solo se ingresen números en el campo de identificación
    EditAdmUserIdInput.addEventListener('input', (event) => {
        event.target.value = event.target.value.replace(/[^0-9]/g, '');
    });
});
