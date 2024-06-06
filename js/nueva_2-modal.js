document.addEventListener('DOMContentLoaded', () => {

// Obtén los elementos del DOM
const modal = document.getElementById('New_2-modal');
const closeBtn = document.getElementById('New_2Close-modal');
const confirmBtn = document.getElementById('New_2Confirm');
const cancelBtn = document.getElementById('New_2Cancel');
const New_2Form = document.getElementById('New_2-info');
const name1Input = document.getElementById('name_1');
const name2Input = document.getElementById('name_2');

// Función para cerrar el modal y limpiar los campos de entrada
function New_2CloseModa() {
    modal.style.display = 'none';
    name1Input.value = '';
    name2Input.value = '';
}

// Función para manejar la confirmación
function handleNew_2Confirm() {
    const New_2FormData = new FormData(New_2Form);
    const New_2Data = {};
        New_2FormData.forEach((value, key) => {
            New_2Data[key] = value;
        });

    console.log('Datos enviados:', New_2Data);

    
    New_2CloseModa(); // Cierra el modal y limpia los campos de entrada después de enviar los datos
}

// Añade los listeners de eventos
closeBtn.addEventListener('click', New_2CloseModa);
cancelBtn.addEventListener('click', New_2CloseModa);
confirmBtn.addEventListener('click', handleNew_2Confirm);
});