// Simulación de MockService.js
const MockService = {
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
            return []; // Devolver un array vacío en caso de error
        }
    }
};


// Variables de estado
let currentPg = 1;
let itemsPerPg = 5;
let dataNodes = [];
let visibleNodes = [];
let activeFilter = 'all';

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    const rootElement = document.getElementById('root1');

    // Crear el contenedor principal
    const mainContainer = document.createElement('div');
    mainContainer.className = 'box';
    rootElement.appendChild(mainContainer);

    // Crear la barra de "Papelera de Reciclaje"
    const recycleBinHeader = document.createElement('div');
    recycleBinHeader.textContent = 'Papelera de Reciclaje';
    recycleBinHeader.className = 'recycle-header';
    rootElement.insertBefore(recycleBinHeader, mainContainer);

    // Crear la barra de filtros y búsqueda
    const filterSection = document.createElement('div');
    filterSection.className = 'filter-section-trash';

    ['All', 'Folder', 'Files', 'Branches'].forEach(filter => {
        const filterButton = document.createElement('button');
        filterButton.textContent = filter;
        filterButton.addEventListener('click', () => applyFilter(filter.toLowerCase()));
        filterSection.appendChild(filterButton);
    });

    // Iconos de archivo y papelera
    const archiveIcon = createActionIcon('./assets/archive-out.svg', 'archive-icon');
    const trashIcon = createActionIcon('./assets/trash.svg', 'trash-icon');
    filterSection.appendChild(archiveIcon);
    filterSection.appendChild(trashIcon);

    rootElement.insertBefore(filterSection, mainContainer);

    // Simular useEffect
    MockService.fetchData().then(data => {
        dataNodes = data;
        visibleNodes = data;
        renderDataTable(visibleNodes, mainContainer);
    });
}

function renderDataTable(nodes, container) {
    // Limpiar contenido anterior
    container.innerHTML = '';

    // Crear la tabla
    const tableElement = document.createElement('table');
    tableElement.style.minWidth = '50rem';

    // Crear el encabezado
    const theadElement = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const tableHeaders = ['Name', 'Size', 'Type'];
    tableHeaders.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    theadElement.appendChild(headerRow);
    tableElement.appendChild(theadElement);

    // Crear el cuerpo de la tabla
    const tbodyElement = document.createElement('tbody');
    const start = (currentPg - 1) * itemsPerPg;
    const end = start + itemsPerPg;
    nodes.slice(start, end).forEach((node, index) => {
        createDataRow(node, tbodyElement, `${index}`);
    });
    tableElement.appendChild(tbodyElement);

    container.appendChild(tableElement);

    setupPaginationControls(nodes.length, container);
}

function createDataRow(node, tbody, path) {
    const rowElement = document.createElement('tr');
    rowElement.classList.add('data-node');
    rowElement.dataset.path = path;

    const nameCell = document.createElement('td');
    nameCell.classList.add('name-cell');
    
    const checkboxContainer = document.createElement('div');
    checkboxContainer.classList.add('checkbox-container');
    
    const checkboxElement = document.createElement('input');
    checkboxElement.type = 'checkbox';
    checkboxElement.addEventListener('change', toggleIconsState);
    checkboxContainer.appendChild(checkboxElement);
    
    const nameSpan = document.createElement('span');
    nameSpan.textContent = node.data.name;
    checkboxContainer.appendChild(nameSpan);
    nameCell.appendChild(checkboxContainer);
    
    rowElement.appendChild(nameCell);

    const sizeCell = document.createElement('td');
    sizeCell.textContent = node.data.size;
    rowElement.appendChild(sizeCell);

    const typeCell = document.createElement('td');
    typeCell.textContent = node.data.type;
    rowElement.appendChild(typeCell);

    tbody.appendChild(rowElement);
}

function toggleIconsState() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const anyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);

    const archiveIcon = document.querySelector('.archive-icon');
    const trashIcon = document.querySelector('.trash-icon');

    if (anyChecked) {
        archiveIcon.classList.add('active');
        trashIcon.classList.add('active');
    } else {
        archiveIcon.classList.remove('active');
        trashIcon.classList.remove('active');
    }
}


function createActionIcon(src, className) {
    const iconContainer = document.createElement('div');
    iconContainer.className = `icon-container-trash ${className}`;
    const iconElement = document.createElement('img');
    iconElement.src = src;
    iconElement.classList.add('action-icon');
    iconContainer.appendChild(iconElement);
    return iconContainer;
}

function applyFilter(filter) {
    activeFilter = filter;
    filterDataNodes(activeFilter);
}

function filterDataNodes(filterType, query = '') {
    visibleNodes = dataNodes.flatMap(flattenNodes).filter(node => {
        const nodeType = node.data.type.toLowerCase();
        const matchesType = filterType === 'all' || 
                            (filterType === 'folder' && nodeType === 'folder') || 
                            (filterType === 'files' && nodeType !== 'folder' && nodeType !== 'branches') || 
                            (filterType === 'branches' && nodeType === 'branches');
        return matchesType;
    });
    currentPg = 1;
    renderDataTable(visibleNodes, document.querySelector('.box'));
}

function flattenNodes(node) {
    return [node, ...(node.children || []).flatMap(flattenNodes)];
}

function setupPaginationControls(totalItems, container) {
    const totalPages = Math.ceil(totalItems / itemsPerPg);

    // Crear fila de paginación
    const paginationRow = document.createElement('tr');
    const paginationCell = document.createElement('td');
    paginationCell.colSpan = 3;
    paginationCell.style.textAlign = 'center';

    // Crear select de filas por página
    const rowsPerPageSelect = document.createElement('select');
    [5, 10, 20].forEach(num => {
        const option = document.createElement('option');
        option.value = num;
        option.textContent = num;
        rowsPerPageSelect.appendChild(option);
    });
    rowsPerPageSelect.value = itemsPerPg;
    rowsPerPageSelect.addEventListener('change', () => {
        itemsPerPg = parseInt(rowsPerPageSelect.value);
        currentPg = 1;
        renderDataTable(visibleNodes, document.querySelector('.box'));
    });
    paginationCell.appendChild(rowsPerPageSelect);

    // Crear iconos de paginación
    const createPaginationIcon = (src, onClick) => {
        const img = document.createElement('img');
        img.src = src;
        img.classList.add('pagination-icone');
        img.style.cursor = 'pointer';
        img.addEventListener('click', onClick);
        return img;
    };

    // Iconos de navegación
    const firstPageIcon = createPaginationIcon('./assets/galones-izquierda.svg', () => goToPage(1));
    const prevPageIcon = createPaginationIcon('./assets/chevron-izquierda.svg', () => goToPage(currentPg - 1));
    const nextPageIcon = createPaginationIcon('./assets/chevron.svg', () => goToPage(currentPg + 1));
    const lastPageIcon = createPaginationIcon('./assets/galones-derecha.svg', () => goToPage(totalPages));

    // Añadir iconos a la celda de paginación
    paginationCell.appendChild(firstPageIcon);
    paginationCell.appendChild(prevPageIcon);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('pagination-btn');
        if (i === currentPg) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => goToPage(i));
        paginationCell.appendChild(pageButton);
    }

    paginationCell.appendChild(nextPageIcon);
    paginationCell.appendChild(lastPageIcon);

    paginationRow.appendChild(paginationCell);
    container.querySelector('table').appendChild(paginationRow);
}

function goToPage(page) {
    const totalPages = Math.ceil(visibleNodes.length / itemsPerPg);
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    currentPg = page;
    renderDataTable(visibleNodes, document.querySelector('.box'));
}


document.addEventListener('DOMContentLoaded', () => {
    // Función para mostrar el modal de restauración
    function showRestoreModal() {
        const archiveIcon = document.querySelector('.archive-icon');
        if (archiveIcon.classList.contains('active')) {
            const restoreModal = document.getElementById('restore-modal');
            const restoreFileList = document.getElementById('restore-file-list');
            restoreFileList.innerHTML = '';

            const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
            checkboxes.forEach(checkbox => {
                const fileName = checkbox.nextElementSibling.textContent;
                const listItem = document.createElement('li');
                listItem.textContent = fileName;
                restoreFileList.appendChild(listItem);
            });

            restoreModal.style.display = 'block';
        }
    }

    // Función para mostrar el modal de eliminación
    function showDeleteModal() {
        const trashIcon = document.querySelector('.trash-icon');
        if (trashIcon.classList.contains('active')) {
            const deleteModal = document.getElementById('delete-modal');
            const deleteFileList = document.getElementById('delete-file-list');
            deleteFileList.innerHTML = '';

            const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
            checkboxes.forEach(checkbox => {
                const fileName = checkbox.nextElementSibling.textContent;
                const listItem = document.createElement('li');
                listItem.textContent = fileName;
                deleteFileList.appendChild(listItem);
            });

            deleteModal.style.display = 'block';
        }
    }

    // Función para ocultar todos los modales
    function hideModals() {
        document.getElementById('restore-modal').style.display = 'none';
        document.getElementById('delete-modal').style.display = 'none';
    }

    // Event listeners para los botones de cerrar
    const closeRestoreModal = document.getElementById('close-restore-modal');
    const closeDeleteModal = document.getElementById('close-delete-modal');
    const cancelRestore = document.getElementById('cancel-restore');
    const cancelDelete = document.getElementById('cancel-delete');

    if (closeRestoreModal) {
        closeRestoreModal.addEventListener('click', hideModals);
    }
    if (closeDeleteModal) {
        closeDeleteModal.addEventListener('click', hideModals);
    }
    if (cancelRestore) {
        cancelRestore.addEventListener('click', hideModals);
    }
    if (cancelDelete) {
        cancelDelete.addEventListener('click', hideModals);
    }

    // Event listeners para los iconos de restaurar y eliminar
    const archiveIcon = document.querySelector('.archive-icon');
    const trashIcon = document.querySelector('.trash-icon');

    if (archiveIcon) {
        archiveIcon.addEventListener('click', showRestoreModal);
    }
    if (trashIcon) {
        trashIcon.addEventListener('click', showDeleteModal);
    }

    // Event listeners para los botones de confirmar
    const confirmRestore = document.getElementById('confirm-restore');
    const confirmDelete = document.getElementById('confirm-delete');

    if (confirmRestore) {
        confirmRestore.addEventListener('click', () => {
            // Lógica para restaurar archivos
            hideModals();
        });
    }
    if (confirmDelete) {
        confirmDelete.addEventListener('click', () => {
            // Lógica para eliminar archivos
            hideModals();
        });
    }
});
