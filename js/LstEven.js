// Obtener el modal
var LstEven_modal = document.getElementById("LstEven-modal_detail_event");

// Obtener el botón que abre el modal
var LstEven_btn = document.getElementById("LstEven-modal-opener");

// Obtener el elemento span que cierra el modal
var LstEven_span = document.getElementsByClassName("LstEven-close")[0];

// Función para abrir el modal con detalles del evento y botón de "Editar"
function LstEven_openModal(event) {
    var eventTitle = event.target.textContent;
    var eventElement = event.target;

    // Establecer el título del evento en el modal
    document.getElementById("LstEven-modal-title").innerText = eventTitle;

    // Obtener la información del evento correspondiente
    var eventDate = eventElement.getAttribute('data-date');
    var eventTime = eventElement.getAttribute('data-time');
    var eventDescription = eventElement.getAttribute('data-description');

    // Mostrar la fecha, hora y descripción del evento en el modal
    document.getElementById("LstEven-modal-date").innerText = "Fecha: " + eventDate;
    document.getElementById("LstEven-modal-time").innerText = "Hora: " + eventTime;
    document.getElementById("LstEven-modal-detail").innerText = "Descripción: " + eventDescription;

    LstEven_modal.style.display = "block";
}

// Función para agregar un nuevo evento al contenedor
function LstEven_addNewEvent(eventTitle, eventDate, eventTime, eventDescription) {
    var newEventDiv = document.createElement('div');
    newEventDiv.className = "LstEven-evento";
    newEventDiv.textContent = eventTitle;
    newEventDiv.setAttribute('data-date', eventDate); // Asignar la fecha al atributo data-date
    newEventDiv.setAttribute('data-time', eventTime); // Asignar la hora al atributo data-time
    newEventDiv.setAttribute('data-description', eventDescription); // Asignar la descripción al atributo data-description
    newEventDiv.addEventListener('click', LstEven_openModal);

    var container = document.querySelector('.LstEven-container_evento');
    var events = container.querySelectorAll('.LstEven-evento');
    
    // Convertir la fecha y hora del evento en un objeto Date para comparar
    var newEventDateTime = new Date(eventDate + " " + eventTime);

    // Encontrar la posición donde insertar el nuevo evento en orden cronológico
    var insertIndex = 0;
    for (var i = 0; i < events.length; i++) {
        var eventDateTime = new Date(events[i].getAttribute('data-date') + " " + events[i].getAttribute('data-time'));
        if (newEventDateTime > eventDateTime) {
            insertIndex = i + 1;
        } else {
            break;
        }
    }
    // Insertar el nuevo evento en la posición adecuada
    if (insertIndex >= events.length) {
        container.appendChild(newEventDiv); // Si el nuevo evento es el más reciente, agregarlo al final
    } else {
        container.insertBefore(newEventDiv, events[insertIndex]); // Insertar el nuevo evento antes del evento en la posición insertIndex
    }
}

// Agregar evento de clic al botón de "Guardar" en el formulario modal
document.getElementById("LstEven-eventForm").addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el comportamiento predeterminado del formulario
    var title = document.getElementById("LstEven-title").value;
    var date = document.getElementById("LstEven-date").value; // Obtener el valor de la fecha del formulario
    var time = document.getElementById("LstEven-time").value; // Obtener el valor de la hora del formulario
    var description = document.getElementById("LstEven-description").value; // Obtener el valor de la descripción del formulario

    LstEven_addNewEvent(title, date, time, description); // Pasar los valores al crear el nuevo evento

    // Limpiar los campos del formulario modal
    document.getElementById("LstEven-title").value = "";
    document.getElementById("LstEven-date").value = "";
    document.getElementById("LstEven-time").value = "";
    document.getElementById("LstEven-description").value = "";

    document.getElementById("LstEven-myModal").style.display = "none"; // Cerrar el modal
});

// Función para cerrar el modal evento haciendo clic en la 'x'
LstEven_span.onclick = function() {
    LstEven_modal.style.display = "none";
}

// Cerrar el modal haciendo clic en cualquier parte fuera del modal
window.onclick = function(event) {
    if (event.target == LstEven_modal) {
        LstEven_modal.style.display = "none";
    }
}

// Agregar el evento de clic a cada div con la clase "LstEven-evento"
var LstEven_eventos = document.querySelectorAll('.LstEven-evento');
LstEven_eventos.forEach(function(evento) {
    evento.addEventListener('click', LstEven_openModal);
});

// Modal form
// Abrir el modal al hacer clic en el botón
document.getElementById("LstEven-openModal").onclick = function() {
    document.getElementById("LstEven-myModal").style.display = "block";
}

// Cerrar el modal formulario al hacer clic en la X
document.getElementsByClassName("LstEven-close_form")[0].onclick = function() {
    document.getElementById("LstEven-myModal").style.display = "none";
}

// Cerrar el modal al hacer clic fuera de él
window.onclick = function(event) {
    if (event.target == document.getElementById("LstEven-myModal")) {
        document.getElementById("LstEven-myModal").style.display = "none";
    }
}

// Llamada a la función openEditModal desde el evento de clic en el icono de edición
function openEditModal(element) {
    var eventTitle = element.getAttribute('data-title');
    var eventDate = element.getAttribute('data-date');
    var eventTime = element.getAttribute('data-time');
    var eventDescription = element.getAttribute('data-description');

    // Llenar los campos del formulario modal de edición con la información del evento a editar
    document.getElementById("LstEven-edit_title").value = eventTitle;
    document.getElementById("LstEven-edit_date").value = eventDate;
    document.getElementById("LstEven-edit_time").value = eventTime;
    document.getElementById("LstEven-edit_description").value = eventDescription;

    // Abrir el modal de edición
    document.getElementById("LstEven-editModal").style.display = "block";
}

// Agregar el evento de clic a cada div con la clase "LstEven-evento" para abrir el modal de edición
LstEven_eventos.forEach(function(evento) {
    evento.addEventListener('click', openEditModal);
});

document.getElementsByClassName("LstEven-close_forme")[0].onclick = function() {
    document.getElementById("LstEven-editModal").style.display = "none";
}
