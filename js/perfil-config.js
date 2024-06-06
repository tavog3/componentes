document.addEventListener('DOMContentLoaded', () => {
    const editPasswordIcon = document.getElementById('edit-password-icon');
    const passwordModal = document.getElementById('password-modal');
    const cancelBtn = document.getElementById('cancel-btn');
    const confirmBtn = document.getElementById('confirm-btn');
    
    const currentPassword = document.getElementById('current-password');
    const newPassword = document.getElementById('new-password');
    const confirmNewPassword = document.getElementById('confirm-new-password');
    
    editPasswordIcon.addEventListener('click', () => {
        passwordModal.style.display = 'flex';
    });

    cancelBtn.addEventListener('click', () => {
        passwordModal.style.display = 'none';
    });

    confirmBtn.addEventListener('click', () => {
        let isValid = true;
    
        // Restablecer el color del borde
        currentPassword.style.borderColor = '';
        newPassword.style.borderColor = '';
        confirmNewPassword.style.borderColor = '';
    
        if (currentPassword.value === '') {
            currentPassword.style.borderColor = 'red';
            isValid = false;
        }
        if (newPassword.value === '') {
            newPassword.style.borderColor = 'red';
            isValid = false;
        }
        if (confirmNewPassword.value === '') {
            confirmNewPassword.style.borderColor = 'red';
            isValid = false;
        }
        if (newPassword.value !== confirmNewPassword.value) {
            newPassword.style.borderColor = 'red';
            confirmNewPassword.style.borderColor = 'red';
            isValid = false;
        }
    
        if (isValid) {
            // Simular el envío del formulario
            console.log('Contraseña actual:', currentPassword.value);
            console.log('Nueva contraseña:', newPassword.value);
            console.log('Confirmar nueva contraseña:', confirmNewPassword.value);
    
            // Cerrar modal
            passwordModal.style.display = 'none';
        }
    });
    
// Función para limpiar los campos del modal
function limpiarCamposModal() {
    currentPassword.value = '';
    newPassword.value = '';
    confirmNewPassword.value = '';
    currentPassword.style.borderColor = '';
    newPassword.style.borderColor = '';
    confirmNewPassword.style.borderColor = '';
}

// Evento clic del botón de editar contraseña
editPasswordIcon.addEventListener('click', () => {
    passwordModal.style.display = 'flex';
    
    // Limpiar los campos del modal cada vez que se abre
    limpiarCamposModal();
});

cancelBtn.addEventListener('click', () => {
    passwordModal.style.display = 'none';
    
    // Limpiar los campos del modal cuando se cancela
    limpiarCamposModal();
});

    window.addEventListener('click', (event) => {
        if (event.target == passwordModal) {
            passwordModal.style.display = 'none';
        }
    });
});




const showPasswordIcon = document.getElementById('show-password');
const newPasswordInput = document.getElementById('new-password');

const currentPasswordInput = document.getElementById('current-password');
const showCurrentPasswordIcon = document.getElementById('show-current-password');

const confirmNewPasswordInput = document.getElementById('confirm-new-password');
const showConfirmNewPasswordIcon = document.getElementById('show-new-password');

// Eventos para el campo "Current Password"
currentPasswordInput.addEventListener('focus', () => {
    showCurrentPasswordIcon.style.display = 'block';
});

showCurrentPasswordIcon.addEventListener('click', () => {
    if (currentPasswordInput.type === 'password') {
        currentPasswordInput.type = 'text';
        showCurrentPasswordIcon.classList.remove('bx-show');
        showCurrentPasswordIcon.classList.add('bx-hide');
    } else {
        currentPasswordInput.type = 'password';
        showCurrentPasswordIcon.classList.remove('bx-hide');
        showCurrentPasswordIcon.classList.add('bx-show');
    }
});

// Eventos para el campo "Current Password"
newPasswordInput.addEventListener('focus', () => {
    showPasswordIcon.style.display = 'block';
});


// Evento clic del icono de mostrar contraseña
showPasswordIcon.addEventListener('click', () => {
    if (newPasswordInput.type === 'password') {
        newPasswordInput.type = 'text';
        showPasswordIcon.classList.add('bx-hide');
        showPasswordIcon.classList.remove('bx-show');
    } else {
        newPasswordInput.type = 'password';
        showPasswordIcon.classList.add('bx-show');
        showPasswordIcon.classList.remove('bx-hide');
       
    }
});

// Eventos para el campo "Confirm New Password"
confirmNewPasswordInput.addEventListener('focus', () => {
    showConfirmNewPasswordIcon.style.display = 'block';
});

showConfirmNewPasswordIcon.addEventListener('click', () => {
    if (confirmNewPasswordInput.type === 'password') {
        confirmNewPasswordInput.type = 'text';
        showConfirmNewPasswordIcon.classList.remove('bx-show');
        showConfirmNewPasswordIcon.classList.add('bx-hide');
    } else {
        confirmNewPasswordInput.type = 'password';
        showConfirmNewPasswordIcon.classList.remove('bx-hide');
        showConfirmNewPasswordIcon.classList.add('bx-show');
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const updateBtn = document.querySelector('.update-btn');
    const fullNameInput = document.getElementById('full-name');
    const usernameInput = document.getElementById('username');
    const fullNameElement = document.querySelector('.full-nameh2');
    const usernameElement = document.querySelector('.userp');

    // Manejar el evento clic del botón "Update info"
    updateBtn.addEventListener('click', (event) => {
        event.preventDefault(); // Evitar la recarga de la página
        
        // Obtener los valores de los inputs
        const fullName = fullNameInput.value;
        const username = usernameInput.value;

        // Actualizar la información del perfil en la página
        fullNameElement.textContent = fullName;
        usernameElement.textContent = '@' + username;
    });
});

document.getElementById('phone').addEventListener('input', function(event) {
    // Obtener el valor actual del campo
    let currentValue = this.value;

    // Eliminar cualquier carácter que no sea un número
    let newValue = currentValue.replace(/\D/g, '');

    // Actualizar el valor del campo
    this.value = newValue;
});

document.getElementById('id').addEventListener('input', function(event) {
    // Obtener el valor actual del campo
    let currentValue = this.value;

    // Eliminar cualquier carácter que no sea un número
    let newValue = currentValue.replace(/\D/g, '');

    // Actualizar el valor del campo
    this.value = newValue;
});

document.querySelector('.upload-btn').addEventListener('click', function(event) {
    event.preventDefault();  // Previene el comportamiento predeterminado
    document.getElementById('photo-upload').click();
});

document.getElementById('photo-upload').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const image = document.getElementById('profile-pic');
            image.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});
