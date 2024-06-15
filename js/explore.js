const NodeService = {
    // Función asincrónica para obtener datos simulados del servicio
    async fetchData() {
        try {
            const response = await fetch('./service/NodeService.json'); // Realiza la solicitud para obtener los datos
            if (!response.ok) {
                throw new Error('Failed to fetch data'); // Error si la solicitud no fue exitosa
            }
            const data = await response.json(); // Convierte la respuesta a formato JSON
            return data; // Devuelve los datos obtenidos
        } catch (error) {
            console.error('Error fetching data:', error); // Manejo de errores en caso de fallo en la solicitud
            return []; // Devuelve un array vacío en caso de error
        }
    }
};

document.addEventListener('DOMContentLoaded', async function () {
    // Variables globales para almacenar el estado actual de la aplicación
    let currentPath = [];
    let currentFolder = [];
    let fileStructure = [];
    let selectedFile = null; // Variable para almacenar el archivo seleccionado

  // Obtiene los datos del servicio simulado al cargar la página
  const data = await NodeService.fetchData();
  if (data && data.length > 0) {
      fileStructure = data;
      currentPath = [{ name: 'Files', data: fileStructure }]; // Inicializa la ruta actual con la estructura de archivos
      currentFolder = fileStructure; // Inicializa la carpeta actual con la estructura de archivos
      renderBreadcrumb(); // Renderiza la barra de navegación (breadcrumb)
      renderFiles(fileStructure); // Renderiza la lista de archivos y carpetas
  } else {
      console.error('No data available to render.'); // Mensaje de error si no hay datos para renderizar
  }

   // Función para renderizar la barra de navegación (breadcrumb)
   function renderBreadcrumb() {
    const breadcrumb = document.getElementById('breadcrumb');
    breadcrumb.innerHTML = '';
    currentPath.forEach((folder, index) => {
        const span = document.createElement('span');
        span.textContent = folder.name;
        span.style.cursor = 'pointer';
        span.addEventListener('click', () => navigateTo(index)); // Navega a la carpeta correspondiente al hacer clic
        selectFile(null);
        breadcrumb.appendChild(span);
        if (index < currentPath.length - 1) {
            breadcrumb.appendChild(document.createTextNode(' ► ')); // Añade separadores entre las carpetas en la navegación
            selectFile(null);
        }
    });
    }

    // Función para renderizar la lista de archivos y carpetas
    function renderFiles(folder) {
        const fileList = document.getElementById('file-list');
        const fileHeader = fileList.querySelector('.file-header');
        fileList.innerHTML = '';
        fileList.appendChild(fileHeader); // Reaplica el encabezado de la lista de archivos

        if (folder && folder.length > 0) {
            folder.forEach(file => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${file.data ? file.data.name : 'Unnamed'}</span>
                    <span>${file.data ? new Date().toLocaleDateString() : 'Unknown'}</span>
                    <span>${file.data ? file.data.size : 'Unknown'}</span>
                `;
                li.addEventListener('click', () => selectFile(li, file)); // Agrega la función para seleccionar el archivo al hacer clic
                if (file.data && file.data.type === 'Folder') {
                    li.addEventListener('dblclick', () => {
                        currentPath.push({ name: file.data.name, data: file.children }); // Navega a una subcarpeta al hacer doble clic
                        currentFolder = file.children; // Actualiza la carpeta actual a la subcarpeta seleccionada
                        renderBreadcrumb(); // Renderiza la barra de navegación actualizada
                        renderFiles(file.children); // Renderiza la lista de archivos y carpetas de la subcarpeta
                    });
                }
                fileList.appendChild(li);
            });
        } else {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = 'No files or folders here.';
            fileList.appendChild(emptyMessage); // Mensaje si no hay archivos ni carpetas para mostrar
        }
    }

    function navigateTo(index) {
        currentPath = currentPath.slice(0, index + 1); // Actualiza la ruta actual hasta el índice seleccionado
        currentFolder = currentPath[currentPath.length - 1].data; // Actualiza la carpeta actual
        renderBreadcrumb(); // Renderiza la barra de navegación actualizada
        renderFiles(currentFolder); // Renderiza la lista de archivos y carpetas de la carpeta actual
    }

    function selectFile(li, file) {
        // Deselecciona el archivo previamente seleccionado si lo hay
        if (selectedFile && selectedFile !== null) {
            selectedFile.classList.remove('selected');
        }

        // Si se hace clic en el mismo archivo nuevamente, deselecciónalo
        if (li === null || selectedFile === li) {
        selectedFile = null;
    } else {
        // Selecciona el nuevo archivo
        selectedFile = li;
        selectedFile.classList.add('selected');
    }

    // Actualiza la visibilidad del menú de contexto
    updateContextMenuVisibility();
}

    function updateContextMenuVisibility() {
        const additionalActions = document.querySelector('.additional-actions');
        if (selectedFile !== null) {
            additionalActions.style.display = 'block'; // Muestra el menú de acciones adicionales si hay un archivo seleccionado
        } else {
            additionalActions.style.display = 'none'; // Oculta el menú de acciones adicionales si no hay archivo seleccionado
        }
    }

    // Event listeners para los botones de la barra de herramientas
    document.getElementById('fe-new-directory-btn').addEventListener('click', openNewDirectoryModal); // Abre el modal para crear un nuevo directorio
    document.getElementById('fe-upload-btn').addEventListener('click', () => document.getElementById('fe-file-input').click()); // Abre el selector de archivos para subir archivos
    document.getElementById('fe-refresh-btn').addEventListener('click', () => {
        selectFile(null);
        renderFiles(currentFolder); // Renderiza de nuevo la lista de archivos y carpetas al hacer clic en el botón de refrescar
    });


    // Modal para nuevo directorio
    const newDirectoryModal = document.getElementById('fe-modal-new-directory');
    const closeModal = document.getElementById('fe-close-modal');
    const createDirectoryButton = document.getElementById('fe-create-directory');
    const cancelDirectoryButton = document.getElementById('fe-cancel-directory');
    const FeDirectoryName = document.getElementById('fe-directory-name')

    // Abre el modal para crear un nuevo directorio
    function openNewDirectoryModal() {
        newDirectoryModal.style.display = 'block';
    }

     function limpiarCamposModalNewDirectory() {
        FeDirectoryName.value='';

     }

    // Cierra el modal para crear un nuevo directorio al hacer clic en el botón de cerrar o cancelar
    closeModal.addEventListener('click', () => {
        newDirectoryModal.style.display = 'none';
        limpiarCamposModalNewDirectory()
    });

    cancelDirectoryButton.addEventListener('click', () => {
        newDirectoryModal.style.display = 'none';
        limpiarCamposModalNewDirectory()
    });

    // Crea un nuevo directorio al hacer clic en el botón de crear en el modal de nuevo directorio
    createDirectoryButton.addEventListener('click', () => {
        const directoryName = document.getElementById('fe-directory-name').value.trim();
        if (directoryName) {
            currentFolder.push({ data: { name: directoryName, type: 'Folder', size: '0 KB' }, children: [] });
            renderFiles(currentFolder); // Renderiza de nuevo la lista de archivos y carpetas al añadir un nuevo directorio
            newDirectoryModal.style.display = 'none';
            
        } else {
            alert('El nombre del directorio no puede estar vacío.'); // Alerta si el nombre del directorio está vacío
        }

        selectFile(null);
        limpiarCamposModalNewDirectory()
    });

     // Manejo de carga de archivos
     const fileInput = document.getElementById('fe-file-input');
     fileInput.addEventListener('change', (event) => {
         const files = event.target.files;
         for (let file of files) {
             currentFolder.push({ data: { name: file.name, type: 'File', size: `${(file.size / 1024).toFixed(2)} KB` } });
         }
         renderFiles(currentFolder);
         selectFile(null);
     });
     


      // Referencias al contenedor de la lista de archivos y al menú de acciones adicionales
    const fileListContainer = document.getElementById('file-list-container');
    const additionalActions = document.querySelector('.additional-actions');

    // Muestra el menú de contexto al hacer clic derecho en la lista de archivos
    fileListContainer.addEventListener('contextmenu', function(event) {
        event.preventDefault();

        if (selectedFile) { // Verifica si hay un archivo seleccionado
            const { clientX: mouseX, clientY: mouseY } = event;

            // Ajusta la posición del menú de contexto para que no se salga de la ventana visible
            const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
            const { offsetWidth: menuWidth, offsetHeight: menuHeight } = additionalActions;

            let top = mouseY;
            let left = mouseX;

            if (mouseX + menuWidth > windowWidth) {
                left = windowWidth - menuWidth - 10; // Ajuste para evitar que el menú se salga de la derecha de la ventana
            }

            if (mouseY + menuHeight > windowHeight) {
                top = windowHeight - menuHeight - 10; // Ajuste para evitar que el menú se salga de la parte inferior de la ventana
            }

            additionalActions.style.top = `${top}px`;
            additionalActions.style.left = `${left}px`;
            additionalActions.style.display = 'block'; // Muestra el menú de acciones adicionales en la posición calculada
        }
    });

    // Oculta el menú de contexto al hacer clic en cualquier otra parte de la página
    document.addEventListener('click', function(event) {
        if (!additionalActions.contains(event.target)) {
            additionalActions.style.display = 'none'; // Oculta el menú de acciones adicionales si se hace clic fuera de él
        }
    });

 // Referencias a elementos del DOM para el modal de mover archivos
const moveModal = document.getElementById('fe-modal-move');
const closeModalMove = document.getElementById('fe-close-modal-move');
const moveFileList = document.getElementById('move-file-list');
const moveFilesButton = document.getElementById('fe-move-files');
const cancelMoveButton = document.getElementById('fe-cancel-move');
const moveButton = document.getElementById('fe-move-btn');
const moveBreadcrumb = document.getElementById('move-breadcrumb');

// Variables para el seguimiento del estado del movimiento de archivos
let movePath = []; // Ruta actual de navegación
let filesToMove = []; // Archivos seleccionados para mover

// Abrir el modal de mover archivos
moveButton.addEventListener('click', openMoveModal);


// Función para abrir el modal de mover archivos
function openMoveModal() {
    if (selectedFile) {
        const fileName = selectedFile.querySelector('span').textContent;
        const fileToMove = findFileByName(currentFolder, fileName);
        if (fileToMove) {
            filesToMove = [fileToMove];
            movePath = [{ name: 'Files', data: fileStructure }];
            renderMoveFileList(fileStructure);
            renderMoveBreadcrumb();
            moveModal.style.display = 'block';
            additionalActions.style.display = 'none';
        }
    }
}


// Renderizar la lista de archivos disponibles para mover en la interfaz
function renderMoveFileList(folder) {
    moveFileList.innerHTML = '<li class="file-header"><span>Name</span></li>';
    if (folder && folder.length > 0) {
        folder.forEach(file => {
            // Verificar si es una carpeta y si no está en la ruta de movimiento actual
            if (file.data.type === 'Folder' && !isFileInMovePath(file, filesToMove)) {
                const li = document.createElement('li');
                li.textContent = file.data.name;
                li.addEventListener('click', () => {
                    // Agregar la carpeta seleccionada a la ruta de movimiento
                    movePath.push({ name: file.data.name, data: file.children });
                    // Renderizar nuevamente la lista de archivos para la nueva carpeta seleccionada
                    renderMoveFileList(file.children);
                    // Renderizar el breadcrumb actualizado
                    renderMoveBreadcrumb();
                });
                moveFileList.appendChild(li);
            }
        });
    } else {
        // Si no hay archivos en la carpeta, mostrar un mensaje indicando que no hay carpetas disponibles
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = 'No folders here.';
        moveFileList.appendChild(emptyMessage);
    }
}

// Verificar si un archivo está en la ruta de movimiento actual
function isFileInMovePath(file, filesToMove) {
    return filesToMove.some(f => f.data.name === file.data.name);
}

// Renderizar el breadcrumb de navegación de la ruta de movimiento
function renderMoveBreadcrumb() {
    moveBreadcrumb.innerHTML = '';
    movePath.forEach((folder, index) => {
        const span = document.createElement('span');
        span.textContent = folder.name;
        span.style.cursor = 'pointer';
        span.addEventListener('click', () => navigateMoveTo(index));
        moveBreadcrumb.appendChild(span);
        if (index < movePath.length - 1) {
            moveBreadcrumb.appendChild(document.createTextNode(' ► '));
        }
    });
}

// Navegar a una ubicación específica en la ruta de movimiento
function navigateMoveTo(index) {
    movePath = movePath.slice(0, index + 1);
    renderMoveFileList(movePath[movePath.length - 1].data);
    renderMoveBreadcrumb();
}

// Cerrar el modal de mover archivos
closeModalMove.addEventListener('click', () => {
    moveModal.style.display = 'none';
});

cancelMoveButton.addEventListener('click', () => {
    moveModal.style.display = 'none';
});

// Mover los archivos seleccionados a la nueva ubicación
moveFilesButton.addEventListener('click', () => {
    // Obtener la carpeta de destino para mover los archivos
    const destination = movePath[movePath.length - 1].data;
    filesToMove.forEach(file => {
        // Buscar y remover el archivo de la carpeta actual
        const index = currentFolder.indexOf(file);
        if (index !== -1) {
            currentFolder.splice(index, 1);
            // Agregar el archivo a la carpeta de destino
            destination.push(file);
        }
    });
    // Renderizar la lista de archivos actualizada en la carpeta actual
    renderFiles(currentFolder);
    // Ocultar el modal de mover archivos después de completar la operación
    moveModal.style.display = 'none';
});

// Función para buscar un archivo por nombre en una estructura de carpetas recursivamente
function findFileByName(folder, name) {
    for (let file of folder) {
        if (file.data.name === name) {
            return file;
        }
        if (file.children && file.children.length > 0) {
            const found = findFileByName(file.children, name);
            if (found) {
                return found;
            }
        }
    }
    return null;
}

// Referencias a elementos del DOM para el modal de copiar y reemplazar
const copyModal = document.getElementById('fe-modal-copy'); // Modal para copiar archivos
const closeModalCopy = document.getElementById('fe-close-modal-copy'); // Botón para cerrar el modal de copiar
const copyFileList = document.getElementById('copy-file-list'); // Lista de archivos y carpetas disponibles para copiar
const copyFilesButton = document.getElementById('fe-copy-files'); // Botón para confirmar y copiar archivos
const cancelCopyButton = document.getElementById('fe-cancel-copy'); // Botón para cancelar la operación de copiar archivos
const copyButton = document.getElementById('fe-copy-btn'); // Botón para abrir el modal de copiar
const copyBreadcrumb = document.getElementById('copy-breadcrumb'); // Breadcrumbs para mostrar la ubicación actual en la estructura de carpetas

const replaceModal = document.getElementById('fe-modal-replace'); // Modal para reemplazar archivos
const closeModalReplace = document.getElementById('fe-close-modal-replace'); // Botón para cerrar el modal de reemplazar
const confirmReplaceButton = document.getElementById('fe-confirm-replace'); // Botón para confirmar el reemplazo de archivos
const cancelReplaceButton = document.getElementById('fe-cancel-replace'); // Botón para cancelar el reemplazo de archivos

let copyPath = []; // Ruta actual de carpetas para copiar archivos
let filesToCopy = []; // Archivos seleccionados para copiar
let currentDestination; // Destino actual para copiar archivos
let filesToReplace = []; // Archivos seleccionados que deben ser reemplazados

copyButton.addEventListener('click', openCopyModal);

function openCopyModal() {
    if (selectedFile) {
        const fileName = selectedFile.querySelector('span').textContent;
        const fileToCopy = findFileByName(currentFolder, fileName);
        if (fileToCopy) {
            filesToCopy = [fileToCopy];
            copyPath = [{ name: 'Files', data: fileStructure }];
            renderCopyFileList(fileStructure);
            renderCopyBreadcrumb();
            copyModal.style.display = 'block';
            additionalActions.style.display = 'none';
        }
    }
}

    
// Renderizar la lista de archivos y carpetas disponibles para copiar
function renderCopyFileList(folder) {
    copyFileList.innerHTML = '<li class="file-header"><span>Name</span></li>';
    if (folder && folder.length > 0) {
        folder.forEach(file => {
            const li = document.createElement('li');
            li.textContent = file.data.name;
            if (file.data.type === 'Folder') {
                // Agregar un listener al hacer clic en una carpeta para navegar a su contenido
                li.addEventListener('click', () => {
                    copyPath.push({ name: file.data.name, data: file.children });
                    renderCopyFileList(file.children);
                    renderCopyBreadcrumb();
                });
            }
            copyFileList.appendChild(li);
        });
    } else {
        // Mostrar un mensaje si no hay carpetas en el directorio actual
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = 'No folders here.';
        copyFileList.appendChild(emptyMessage);
    }
}

// Función asincrónica para copiar archivos al destino seleccionado
async function copyFiles(destination) {
    for (let fileToCopy of filesToCopy) {
        // Verificar si ya existe un archivo con el mismo nombre y tipo en el destino
        const existingFile = destination.find(file => file.data.name === fileToCopy.data.name && file.data.type === fileToCopy.data.type);
        if (existingFile) {
            // Confirmar con el usuario si desea reemplazar el archivo existente
            const confirmReplace = confirm(`Ya existe un archivo llamado ${fileToCopy.data.name} en esta carpeta con el mismo tipo. ¿Desea reemplazarlo?`);
            if (confirmReplace) {
                // Si se confirma, reemplazar el archivo existente con el nuevo
                const index = destination.indexOf(existingFile);
                destination.splice(index, 1, fileToCopy);
            }
        } else {
            // Si no hay un archivo con el mismo nombre y tipo, simplemente copiarlo al destino
            destination.push(fileToCopy);
        }
    }
    // Renderizar la lista actualizada de archivos en la carpeta actual después de copiar
    renderFiles(currentFolder);
    // Ocultar el modal de copiar archivos después de completar la operación
    copyModal.style.display = 'none';
}


/// Renderizar los breadcrumbs para mostrar la ubicación actual en la estructura de carpetas durante la copia
function renderCopyBreadcrumb() {
    copyBreadcrumb.innerHTML = '';
    copyPath.forEach((folder, index) => {
        const span = document.createElement('span');
        span.textContent = folder.name;
        span.style.cursor = 'pointer';
        // Agregar un listener para permitir la navegación haciendo clic en cada breadcrumb
        span.addEventListener('click', () => navigateCopyTo(index));
        copyBreadcrumb.appendChild(span);
        if (index < copyPath.length - 1) {
            copyBreadcrumb.appendChild(document.createTextNode(' ► '));
        }
    });
}

/// Navegar hacia atrás en la ruta de copia al hacer clic en un breadcrumb específico
function navigateCopyTo(index) {
    copyPath = copyPath.slice(0, index + 1);
    renderCopyFileList(copyPath[copyPath.length - 1].data);
    renderCopyBreadcrumb();
}

// Cerrar el modal de copiar archivos cuando se hace clic en el botón de cerrar
closeModalCopy.addEventListener('click', () => {
    copyModal.style.display = 'none';
});

// Cancelar la operación de copiar archivos y cerrar el modal
cancelCopyButton.addEventListener('click', () => {
    copyModal.style.display = 'none';
});

// Manejar el evento de copiar archivos cuando se hace clic en el botón de copiar
copyFilesButton.addEventListener('click', () => {
    // Obtener la carpeta de destino actual para copiar archivos
    const currentDestination = copyPath[copyPath.length - 1].data;
    const filesToReplace = [];
    // Iterar sobre los archivos seleccionados para copiar y manejar los reemplazos si es necesario
    filesToCopy.forEach(file => {
        // Verificar si ya existe un archivo con el mismo nombre y tipo en la carpeta de destino
        const existingFile = currentDestination.find(f => f.data.name === file.data.name && f.data.type === file.data.type);
        if (existingFile) {
            // Si existe, agregarlo a la lista de archivos que deben ser reemplazados
            filesToReplace.push(file);
        } else {
            // Si no existe, copiar el archivo al destino
            const newFile = JSON.parse(JSON.stringify(file)); // Crear una copia profunda del archivo para evitar referencias
            currentDestination.push(newFile);
        }
    });
    if (filesToReplace.length > 0) {
        // Si hay archivos para reemplazar, mostrar el modal de reemplazo correspondiente
        renderReplaceFileList(filesToReplace);
        copyModal.style.display = 'none'; // Ocultar el modal de copiar archivos
        replaceModal.style.display = 'block'; // Mostrar el modal de reemplazar archivos
    } else {
        // Si no hay archivos para reemplazar, renderizar la lista de archivos en la carpeta actual
        renderFiles(currentFolder);
        copyModal.style.display = 'none'; // Ocultar el modal de copiar archivos
    }
});

// Cerrar el modal de reemplazo cuando se hace clic en el botón de cerrar
closeModalReplace.addEventListener('click', () => {
    replaceModal.style.display = 'none';
});

// Cancelar la operación de reemplazo de archivos y cerrar el modal correspondiente
cancelReplaceButton.addEventListener('click', () => {
    replaceModal.style.display = 'none';
});

// Confirmar la operación de reemplazo de archivos cuando se hace clic en el botón de confirmar
confirmReplaceButton.addEventListener('click', () => {
    // Iterar sobre los archivos que deben ser reemplazados y realizar el reemplazo en la carpeta de destino
    filesToReplace.forEach(file => {
        const existingFileIndex = currentDestination.findIndex(f => f.data.name === file.data.name && f.data.type === file.data.type);
        if (existingFileIndex !== -1) {
            // Reemplazar el archivo existente con una copia profunda del nuevo archivo
            currentDestination[existingFileIndex] = JSON.parse(JSON.stringify(file));
        }
    });
    // Renderizar la lista actualizada de archivos en la carpeta actual después de realizar los reemplazos
    renderFiles(currentFolder);
    // Ocultar el modal de reemplazo después de completar la operación
    replaceModal.style.display = 'none';
});

// Función para buscar un archivo por nombre dentro de una estructura de carpetas
function findFileByName(folder, name) {
    for (let file of folder) {
        if (file.data.name === name) {
            return file;
        }
        if (file.children && file.children.length > 0) {
            const found = findFileByName(file.children, name);
            if (found) {
                return found;
            }
        }
    }
    return null;
}

// Referencias a elementos del DOM para el menú de contexto y el modal de edición
const editButton = document.getElementById('fe-edit-btn'); // Botón de editar
const editModal = document.getElementById('edit-modal'); // Modal de edición
const closeModalEdit = document.getElementById('close-modal-edit'); // Botón para cerrar el modal de edición
const confirmEditButton = document.getElementById('confirm-edit'); // Botón para confirmar la edición
const cancelEditButton = document.getElementById('cancel-edit'); // Botón para cancelar la edición
const editElementNameInput = document.getElementById('edit-element-name'); // Campo de entrada para el nuevo nombre

// Event listener para el botón de editar en el menú de contexto
editButton.addEventListener('click', openEditModal);

function openEditModal() {
    if (selectedFile) {
        const fileNameElement = selectedFile.querySelector('span');
        if (fileNameElement) {
            const fileName = fileNameElement.textContent.trim();
            editElementNameInput.value = fileName;
            editModal.style.display = 'block';
        } else {
            console.error('No se encontró el elemento del nombre de archivo dentro del elemento seleccionado.');
        }
    } else {
        console.error('No se ha seleccionado ningún elemento para editar.');
    }

    additionalActions.style.display = 'none'; // Ocultar el menú de contexto
}


// Event listener para el botón de cerrar en el modal de edición
closeModalEdit.addEventListener('click', () => {
    editModal.style.display = 'none'; // Ocultar el modal de edición al hacer clic en cerrar
});

// Event listener para el botón de cancelar en el modal de edición
cancelEditButton.addEventListener('click', () => {
    editModal.style.display = 'none'; // Ocultar el modal de edición al hacer clic en cancelar
});

// Event listener para el botón de confirmar en el modal de edición
confirmEditButton.addEventListener('click', () => {
    const newName = editElementNameInput.value.trim(); // Obtener el nuevo nombre del archivo desde el campo de entrada
    if (newName) {
        if (selectedFile) {
            const fileNameElement = selectedFile.querySelector('span');
            if (fileNameElement) {
                fileNameElement.textContent = newName; // Actualizar el nombre del archivo en el DOM
                editModal.style.display = 'none'; // Ocultar el modal de edición después de la edición
            } else {
                console.error('No se encontró el elemento del nombre de archivo dentro del elemento seleccionado.');
            }
        } else {
            console.error('No se ha seleccionado ningún elemento para editar.');
        }
    } else {
        console.error('El nombre del archivo no puede estar vacío.');
    }
});


});