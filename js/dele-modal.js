document.addEventListener('DOMContentLoaded', () => {

const DeleModal = document.getElementById('dele-modal');
const DeleCloseBtn = document.getElementById('DeleClose-modal');
const DeleConfirmBtn = document.getElementById('DeleConfirm');
const DeleCancelBtn = document.getElementById('DeleCancel');

// Función para cerrar el modal
function closeDeleModal() {
    DeleModal.style.display = 'none';
}

// Función para manejar la confirmación
function handleDeleConfirm() {
    // Aquí puedes agregar el código para enviar la información de la lista
    closeDeleModal(); // Cierra el modal después de enviar la información
}

// Añade los listeners de eventos
DeleCloseBtn.addEventListener('click', closeDeleModal);
DeleCancelBtn.addEventListener('click', closeDeleModal);
DeleConfirmBtn.addEventListener('click', handleDeleConfirm);

});