// script.js

// Simulación de NodeService.js
const NodeService = {
    async getTreeTableNodes() {
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
let currentPage = 1;
let rowsPerPage = 5;
let nodes = [];
let expandedPaths = new Set();

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    const root = document.getElementById('root');

    // Crear el contenedor principal
    const container = document.createElement('div');
    container.className = 'card';
    root.appendChild(container);

    // Simular useEffect
    NodeService.getTreeTableNodes().then(data => {
        nodes = data;
        renderTable(nodes, container);
    });
}

function renderTable(nodes, container) {
    // Limpiar contenido anterior
    container.innerHTML = '';

    // Crear la tabla
    const table = document.createElement('table');
    table.style.minWidth = '100%';

    // Crear el encabezado
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['Name', 'Size', 'Type'];
    headers.forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Crear el cuerpo de la tabla
    const tbody = document.createElement('tbody');
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    nodes.slice(start, end).forEach((node, index) => {
        createRow(node, tbody, 0, `${index}`, true);
    });
    table.appendChild(tbody);

    container.appendChild(table);

    setupPagination(nodes.length, container);
}

function createRow(node, tbody, level, path, isVisible) {
    const row = document.createElement('tr');
    row.classList.add('tree-node');
    row.dataset.path = path;
    row.style.display = isVisible ? '' : 'none';

    const nameCell = document.createElement('td');
    nameCell.style.paddingLeft = `${level * 20}px`;

    if (node.children) {
        const icon = document.createElement('img');
        icon.src = './assets/chevron.svg';
        icon.classList.add('toggle-icon');
        icon.alt = 'Toggle';
        nameCell.appendChild(icon);
        nameCell.style.cursor = 'pointer';
        nameCell.addEventListener('click', (event) => toggleNode(event, path, icon));
    }

    const textSpan = document.createElement('span');
    textSpan.textContent = node.data.name;
    nameCell.appendChild(textSpan);
    row.appendChild(nameCell);

    const sizeCell = document.createElement('td');
    sizeCell.textContent = node.data.size;
    row.appendChild(sizeCell);

    const typeCell = document.createElement('td');
    typeCell.textContent = node.data.type;
    row.appendChild(typeCell);

    tbody.appendChild(row);

    if (node.children) {
        node.children.forEach((childNode, index) => {
            createRow(childNode, tbody, level + 1, `${path}-${index}`, false);
        });
    }
}

function toggleNode(event, path, icon) {
    const row = document.querySelector(`tr[data-path="${path}"]`);
    const isExpanding = icon.src.includes('chevron.svg');

    if (isExpanding) {
        // Expandir solo los nodos hijos
        const childRows = document.querySelectorAll(`tr[data-path^="${path}-"]`);
        childRows.forEach(childRow => {
            const childPath = childRow.dataset.path;
            if (childPath.split('-').length === path.split('-').length + 1) {
                childRow.style.display = '';
            }
        });
        icon.src = './assets/chevron-down.svg';
    } else {
        // Colapsar todos los nodos descendientes
        const descendantRows = document.querySelectorAll(`tr[data-path^="${path}-"]`);
        descendantRows.forEach(descendantRow => {
            descendantRow.style.display = 'none';
            const descendantIcon = descendantRow.querySelector('.toggle-icon');
            if (descendantIcon) {
                descendantIcon.src = './assets/chevron.svg';
            }
        });
        icon.src = './assets/chevron.svg';
    }

    event.stopPropagation();
}

function setupPagination(totalItems, container) {
    const pageCount = Math.ceil(totalItems / rowsPerPage);

    // Crear fila de paginación
    const paginationRow = document.createElement('tr');
    const paginationCell = document.createElement('td');
    paginationCell.colSpan = 3;
    paginationCell.style.textAlign = 'center';

    // Crear select de filas por página
    const rowsPerPageSelect = document.createElement('select');
    [2, 5, 20].forEach(num => {
        const option = document.createElement('option');
        option.value = num;
        option.textContent = num;
        rowsPerPageSelect.appendChild(option);
    });
    rowsPerPageSelect.value = rowsPerPage;
    rowsPerPageSelect.addEventListener('change', () => {
        rowsPerPage = parseInt(rowsPerPageSelect.value);
        currentPage = 1;
        renderTable(nodes, document.querySelector('.card'));
    });
    paginationCell.appendChild(rowsPerPageSelect);

    // Crear iconos de paginación
    const createPaginationIcon = (src, onClick) => {
        const img = document.createElement('img');
        img.src = src; // Cambia el icono cuando lo tengas
        img.classList.add('pagination-icon');
        img.style.cursor = 'pointer';
        img.addEventListener('click', onClick);
        return img;
    };

    // Iconos de navegación
    const firstPageIcon = createPaginationIcon('./assets/galones-izquierda.svg', () => goToPage(1)); // Cambia el icono cuando lo tengas
    const prevPageIcon = createPaginationIcon('./assets/chevron-izquierda.svg', () => goToPage(currentPage - 1)); // Cambia el icono cuando lo tengas
    const nextPageIcon = createPaginationIcon('./assets/chevron.svg', () => goToPage(currentPage + 1)); // Cambia el icono cuando lo tengas
    const lastPageIcon = createPaginationIcon('./assets/galones-derecha.svg', () => goToPage(pageCount)); // Cambia el icono cuando lo tengas

    // Añadir iconos a la celda de paginación
    paginationCell.appendChild(firstPageIcon);
    paginationCell.appendChild(prevPageIcon);

    for (let i = 1; i <= pageCount; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('pagination-button');
        if (i === currentPage) {
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
    const pageCount = Math.ceil(nodes.length / rowsPerPage);
    if (page < 1) page = 1;
    if (page > pageCount) page = pageCount;
    currentPage = page;
    renderTable(nodes, document.querySelector('.card'));
}
