// js/explore.js

// Simulación de NodeService.js
const NodeService = {
    async fetchData() {
        try {
            const response = await fetch('./service/NodeService.json');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    }
};

document.addEventListener('DOMContentLoaded', async function () {
    let currentPath = [];
    let currentFolder = [];
    let fileStructure = [];

    const data = await NodeService.fetchData();
    if (data && data.length > 0) {
        fileStructure = data;
        currentPath = [{ name: 'Files', data: fileStructure }];
        currentFolder = fileStructure;
        renderBreadcrumb();
        renderFiles(fileStructure);
    } else {
        console.error('No data available to render.');
    }

    function renderBreadcrumb() {
        const breadcrumb = document.getElementById('breadcrumb');
        breadcrumb.innerHTML = '';
        currentPath.forEach((folder, index) => {
            const span = document.createElement('span');
            span.textContent = folder.name;
            span.style.cursor = 'pointer';
            span.addEventListener('click', () => navigateTo(index));
            breadcrumb.appendChild(span);
            if (index < currentPath.length - 1) {
                breadcrumb.appendChild(document.createTextNode(' ► '));
            }
        });
    }

    function renderFiles(folder) {
        const fileList = document.getElementById('file-list');
        const fileHeader = fileList.querySelector('.file-header');
        fileList.innerHTML = '';
        fileList.appendChild(fileHeader); // Re-append header

        if (folder && folder.length > 0) {
            folder.forEach(file => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <input type="checkbox" class="file-checkbox">
                    <span>${file.data ? file.data.name : 'Unnamed'}</span>
                    <span>${file.data ? new Date().toLocaleDateString() : 'Unknown'}</span>
                    <span>${file.data ? file.data.size : 'Unknown'}</span>
                `;
                if (file.data && file.data.type === 'Folder') {
                    li.addEventListener('dblclick', () => {
                        currentPath.push({ name: file.data.name, data: file.children });
                        currentFolder = file.children;
                        renderBreadcrumb();
                        renderFiles(file.children);
                    });
                }
                fileList.appendChild(li);
            });
        } else {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = 'No files or folders here.';
            fileList.appendChild(emptyMessage);
        }
    }

    function navigateTo(index) {
        currentPath = currentPath.slice(0, index + 1);
        currentFolder = currentPath[currentPath.length - 1].data;
        renderBreadcrumb();
        renderFiles(currentFolder);
    }

    // Select/Deselect all files
    const selectAllCheckbox = document.getElementById('select-all');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.file-checkbox');
            checkboxes.forEach(checkbox => checkbox.checked = selectAllCheckbox.checked);
        });
    }

    // Event listeners for toolbar buttons
    document.getElementById('fe-new-directory-btn').addEventListener('click', openNewDirectoryModal);
    document.getElementById('fe-upload-btn').addEventListener('click', () => document.getElementById('fe-file-input').click());
    document.getElementById('fe-refresh-btn').addEventListener('click', () => {
        renderFiles(currentFolder);
    });

    // Referencia al contenedor de la lista de archivos y el contenedor de acciones adicionales
    const fileListContainer = document.getElementById('file-list-container');
    const additionalActions = document.querySelector('.additional-actions');

    // Mostrar el menú de contexto al hacer clic derecho
    fileListContainer.addEventListener('contextmenu', function(event) {
        event.preventDefault();

        // Verificar si hay al menos un checkbox seleccionado
        const checkboxes = document.querySelectorAll('.file-checkbox');
        const isAnyCheckboxChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);

        if (!isAnyCheckboxChecked) {
            additionalActions.style.display = 'none';
            return;
        }

        const { clientX: mouseX, clientY: mouseY } = event;

        // Ajustar la posición del menú para que no se salga de la ventana visible
        const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
        const { offsetWidth: menuWidth, offsetHeight: menuHeight } = additionalActions;
        
        let top = mouseY;
        let left = mouseX;

        if (mouseX + menuWidth > windowWidth) {
            left = windowWidth - menuWidth - 10; // Padding de 10px del borde derecho
        }

        if (mouseY + menuHeight > windowHeight) {
            top = windowHeight - menuHeight - 10; // Padding de 10px del borde inferior
        }

        additionalActions.style.top = `${top}px`;
        additionalActions.style.left = `${left}px`;
        additionalActions.style.display = 'block';
    });

    // Ocultar el menú de contexto al hacer clic en cualquier otro lugar de la página
    document.addEventListener('click', function(event) {
        if (!additionalActions.contains(event.target)) {
            additionalActions.style.display = 'none';
        }
    });


    // Modal handling
    const newDirectoryModal = document.getElementById('fe-modal-new-directory');
    const closeModal = document.getElementById('fe-close-modal');
    const createDirectoryButton = document.getElementById('fe-create-directory');
    const cancelDirectoryButton = document.getElementById('fe-cancel-directory');

    function openNewDirectoryModal() {
        newDirectoryModal.style.display = 'block';
    }

    closeModal.addEventListener('click', () => {
        newDirectoryModal.style.display = 'none';
    });

    cancelDirectoryButton.addEventListener('click', () => {
        newDirectoryModal.style.display = 'none';
    });

    createDirectoryButton.addEventListener('click', () => {
        const directoryName = document.getElementById('fe-directory-name').value.trim();
        if (directoryName) {
            currentFolder.push({ data: { name: directoryName, type: 'Folder', size: '0 KB' }, children: [] });
            renderFiles(currentFolder);
            newDirectoryModal.style.display = 'none';
        } else {
            alert('El nombre del directorio no puede estar vacío.');
        }
    });

    // File upload handling
    const fileInput = document.getElementById('fe-file-input');
    fileInput.addEventListener('change', (event) => {
        const files = event.target.files;
        for (let file of files) {
            currentFolder.push({ data: { name: file.name, type: 'File', size: `${(file.size / 1024).toFixed(2)} KB` } });
        }
        renderFiles(currentFolder);
    });
    

    // Referencias a elementos del DOM para el modal de mover
    const moveModal = document.getElementById('fe-modal-move');
    const closeModalMove = document.getElementById('fe-close-modal-move');
    const moveFileList = document.getElementById('move-file-list');
    const moveFilesButton = document.getElementById('fe-move-files');
    const cancelMoveButton = document.getElementById('fe-cancel-move');
    const moveButton = document.getElementById('fe-move-btn');
    const moveBreadcrumb = document.getElementById('move-breadcrumb');

    let movePath = [];
    let filesToMove = [];

    // Abrir el modal de mover archivos
    moveButton.addEventListener('click', openMoveModal);

    function openMoveModal() {
        const checkboxes = document.querySelectorAll('.file-checkbox');
        filesToMove = Array.from(checkboxes).filter(checkbox => checkbox.checked)
            .map(checkbox => {
                const li = checkbox.closest('li');
                const fileName = li.querySelector('span').textContent;
                return findFileByName(currentFolder, fileName);
            });

        movePath = [{ name: 'Files', data: fileStructure }];
        renderMoveFileList(fileStructure);
        renderMoveBreadcrumb();
        moveModal.style.display = 'block';
        additionalActions.style.display = 'none'; // Ocultar el menú de contexto
    }

    function renderMoveFileList(folder) {
        moveFileList.innerHTML = '<li class="file-header"><span>Name</span></li>';
        if (folder && folder.length > 0) {
            folder.forEach(file => {
                if (file.data.type === 'Folder' && !isFileInMovePath(file, filesToMove)) {
                    const li = document.createElement('li');
                    li.textContent = file.data.name;
                    li.addEventListener('click', () => {
                        movePath.push({ name: file.data.name, data: file.children });
                        renderMoveFileList(file.children);
                        renderMoveBreadcrumb();
                    });
                    moveFileList.appendChild(li);
                }
            });
        } else {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = 'No folders here.';
            moveFileList.appendChild(emptyMessage);
        }
    }

    function isFileInMovePath(file, filesToMove) {
        return filesToMove.some(f => f.data.name === file.data.name);
    }

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
        const destination = movePath[movePath.length - 1].data;
        filesToMove.forEach(file => {
            const index = currentFolder.indexOf(file);
            if (index !== -1) {
                currentFolder.splice(index, 1);
                destination.push(file);
            }
        });
        renderFiles(currentFolder);
        moveModal.style.display = 'none';
    });

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
 const copyModal = document.getElementById('fe-modal-copy');
 const closeModalCopy = document.getElementById('fe-close-modal-copy');
 const copyFileList = document.getElementById('copy-file-list');
 const copyFilesButton = document.getElementById('fe-copy-files');
 const cancelCopyButton = document.getElementById('fe-cancel-copy');
 const copyButton = document.getElementById('fe-copy-btn');
 const copyBreadcrumb = document.getElementById('copy-breadcrumb');

 const replaceModal = document.getElementById('fe-modal-replace');
 const closeModalReplace = document.getElementById('fe-close-modal-replace');
 const confirmReplaceButton = document.getElementById('fe-confirm-replace');
 const cancelReplaceButton = document.getElementById('fe-cancel-replace');

 let copyPath = [];
 let filesToCopy = [];
 let currentDestination;
 let filesToReplace = [];

 // Abrir el modal de copiar archivos
 copyButton.addEventListener('click', openCopyModal);

 function openCopyModal() {
     const checkboxes = document.querySelectorAll('.file-checkbox');
     filesToCopy = Array.from(checkboxes).filter(checkbox => checkbox.checked)
         .map(checkbox => {
             const li = checkbox.closest('li');
             const fileName = li.querySelector('span').textContent;
             return findFileByName(currentFolder, fileName);
         });

     copyPath = [{ name: 'Files', data: fileStructure }];
     renderCopyFileList(fileStructure);
     renderCopyBreadcrumb();
     copyModal.style.display = 'block';
     additionalActions.style.display = 'none'; // Ocultar el menú de contexto
 }

 function renderCopyFileList(folder) {
    copyFileList.innerHTML = '<li class="file-header"><span>Name</span></li>';
    if (folder && folder.length > 0) {
        folder.forEach(file => {
            const li = document.createElement('li');
            li.textContent = file.data.name;
            if (file.data.type === 'Folder') {
                li.addEventListener('click', () => {
                    copyPath.push({ name: file.data.name, data: file.children });
                    renderCopyFileList(file.children);
                    renderCopyBreadcrumb();
                });
            }
            copyFileList.appendChild(li);
        });
    } else {
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = 'No folders here.';
        copyFileList.appendChild(emptyMessage);
    }
}

async function copyFiles(destination) {
    for (let fileToCopy of filesToCopy) {
        const existingFile = destination.find(file => file.data.name === fileToCopy.data.name && file.data.type === fileToCopy.data.type);
        if (existingFile) {
            const confirmReplace = confirm(`Ya existe un archivo llamado ${fileToCopy.data.name} en esta carpeta con el mismo tipo. ¿Desea reemplazarlo?`);
            if (confirmReplace) {
                // Si el usuario confirma, reemplazamos el archivo existente con el nuevo
                const index = destination.indexOf(existingFile);
                destination.splice(index, 1, fileToCopy);
            }
        } else {
            // Si no hay un archivo con el mismo nombre y tipo, simplemente lo copiamos
            destination.push(fileToCopy);
        }
    }
    renderFiles(currentFolder);
    copyModal.style.display = 'none';
}

 function renderCopyBreadcrumb() {
     copyBreadcrumb.innerHTML = '';
     copyPath.forEach((folder, index) => {
         const span = document.createElement('span');
         span.textContent = folder.name;
         span.style.cursor = 'pointer';
         span.addEventListener('click', () => navigateCopyTo(index));
         copyBreadcrumb.appendChild(span);
         if (index < copyPath.length - 1) {
             copyBreadcrumb.appendChild(document.createTextNode(' ► '));
         }
     });
 }

 function navigateCopyTo(index) {
     copyPath = copyPath.slice(0, index + 1);
     renderCopyFileList(copyPath[copyPath.length - 1].data);
     renderCopyBreadcrumb();
 }

 // Cerrar el modal de copiar archivos
 closeModalCopy.addEventListener('click', () => {
     copyModal.style.display = 'none';
 });

 cancelCopyButton.addEventListener('click', () => {
     copyModal.style.display = 'none';
 });

 // Manejo del evento de copiar archivos
 copyFilesButton.addEventListener('click', () => {
    const currentDestination = copyPath[copyPath.length - 1].data;
    const filesToReplace = [];
    filesToCopy.forEach(file => {
        const existingFile = currentDestination.find(f => f.data.name === file.data.name && f.data.type === file.data.type);
        if (existingFile) {
            filesToReplace.push(file);
        } else {
            const newFile = JSON.parse(JSON.stringify(file));
            currentDestination.push(newFile);
        }
    });
    if (filesToReplace.length > 0) {
        // Si hay archivos para reemplazar, mostrar el modal de reemplazo
        renderReplaceFileList(filesToReplace);
        copyModal.style.display = 'none';
        replaceModal.style.display = 'block';
    } else {
        // Si no hay archivos para reemplazar, renderizar la lista de archivos en la carpeta actual
        renderFiles(currentFolder);
        copyModal.style.display = 'none';
    }
});


 // Cerrar el modal de reemplazo
 closeModalReplace.addEventListener('click', () => {
     replaceModal.style.display = 'none';
 });

 cancelReplaceButton.addEventListener('click', () => {
     replaceModal.style.display = 'none';
 });

 // Confirmar reemplazo de archivos
 confirmReplaceButton.addEventListener('click', () => {
     filesToReplace.forEach(file => {
         const existingFileIndex = currentDestination.findIndex(f => f.data.name === file.data.name && f.data.type === file.data.type);
         if (existingFileIndex !== -1) {
             currentDestination[existingFileIndex] = JSON.parse(JSON.stringify(file));
         }
     });
     renderFiles(currentFolder);
     replaceModal.style.display = 'none';
 });

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
const editButton = document.getElementById('fe-edit-btn');
const editModal = document.getElementById('edit-modal');
const closeModalEdit = document.getElementById('close-modal-edit');
const confirmEditButton = document.getElementById('confirm-edit');
const cancelEditButton = document.getElementById('cancel-edit');
const editElementNameInput = document.getElementById('edit-element-name');

// Event listener para el botón de editar en el menú de contexto
editButton.addEventListener('click', openEditModal);

function openEditModal() {
    const selectedElement = getSelectedElement();
    if (selectedElement) {
        const fileNameElement = selectedElement.querySelector('span');
        const fileName = fileNameElement.textContent; // Obtener el nombre del archivo desde el elemento seleccionado
        editElementNameInput.value = fileName; // Establecer el nombre del archivo en el campo de entrada
        editModal.style.display = 'block';
    } else {
        console.error('No se pudo encontrar el elemento seleccionado.');
    }

    additionalActions.style.display = 'none'; // Ocultar el menú de contexto
}

closeModalEdit.addEventListener('click', () => {
    editModal.style.display = 'none';
});

cancelEditButton.addEventListener('click', () => {
    editModal.style.display = 'none';

});



// Event listener para el botón de confirmar en el modal de edición
confirmEditButton.addEventListener('click', () => {
    const newName = editElementNameInput.value.trim();
    if (newName) {
        const selectedElement = getSelectedElement();
        if (selectedElement) {
            const fileNameElement = selectedElement.querySelector('span');
            fileNameElement.textContent = newName;
            editModal.style.display = 'none';
        } else {
            console.error('No se ha seleccionado ningún elemento para editar.');
        }
    } else {
        console.error('El nombre del archivo no puede estar vacío.');
    }
});

// Lógica para obtener el elemento seleccionado
function getSelectedElement() {
    const checkboxes = document.querySelectorAll('.file-checkbox');
    const selectedCheckbox = Array.from(checkboxes).find(checkbox => checkbox.checked);
    if (selectedCheckbox) {
        const li = selectedCheckbox.closest('li');
        return li; // Devolver directamente el elemento <li> seleccionado
    } else {
        return null;
    }
}

function toggleEditButtonVisibility() {
    const checkboxes = document.querySelectorAll('.file-checkbox');
    const checkedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);
    if (checkedCheckboxes.length < 2) {
        editButton.style.display = 'block';
    } else {
        editButton.style.display = 'none';
    }
}

document.addEventListener('change', toggleEditButtonVisibility);


});

