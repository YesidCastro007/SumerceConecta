// Cargar datos desde localStorage o usar datos por defecto
let data = JSON.parse(localStorage.getItem('preciosDiarios')) || [
    { name: "Tomate", type: "fruta", price: 6500, unit: "kg" },
    { name: "Cebolla", type: "verdura", price: 5800, unit: "kg" },
    { name: "Papa", type: "verdura", price: 4000, unit: "kg" },
    { name: "Plátano", type: "fruta", price: 5000, unit: "kg" },
    { name: "Banano", type: "fruta", price: 4200, unit: "kg" },
    { name: "Yuca", type: "verdura", price: 3300, unit: "kg" },
    { name: "Arroz", type: "verdura", price: 7800, unit: "kg" },
    { name: "Café", type: "fruta", price: 46000, unit: "kg" },
    { name: "Fertilizante NPK 15-15-15", type: "insumo", price: 120000, unit: "saco 50kg" },
    { name: "Semillas de Maíz", type: "insumo", price: 25000, unit: "kg" },
    { name: "Pesticida Orgánico", type: "insumo", price: 45000, unit: "litro" }
];

// Mostrar fecha actual
function displayDate() {
    const dateDisplay = document.getElementById('dateDisplay');
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplay.textContent = today.toLocaleDateString('es-CO', options);
}

// Renderizar tabla
function renderTable(filter = 'all') {
    const tbody = document.getElementById('priceTableBody');
    tbody.innerHTML = '';
    const filteredData = filter === 'all' ? data : data.filter(item => item.type === filter);
    
    filteredData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td><span class="type-badge type-${item.type}">${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span></td>
            <td class="price-cell">$${item.price.toLocaleString('es-CO')}</td>
            <td>${item.unit}</td>
        `;
        tbody.appendChild(row);
    });
}

// Toggle formulario de actualización
function toggleUpdateForm() {
    const form = document.getElementById('updateForm');
    form.classList.toggle('active');
}

// Agregar o actualizar producto
function addOrUpdateProduct() {
    const name = document.getElementById('productName').value.trim();
    const type = document.getElementById('productType').value;
    const price = parseInt(document.getElementById('productPrice').value);
    const unit = document.getElementById('productUnit').value.trim();

    if (!name || !price || !unit) {
        alert('Por favor completa todos los campos');
        return;
    }

    const existingIndex = data.findIndex(item => item.name.toLowerCase() === name.toLowerCase());
    
    if (existingIndex !== -1) {
        data[existingIndex] = { name, type, price, unit };
        alert(`Producto "${name}" actualizado exitosamente`);
    } else {
        data.push({ name, type, price, unit });
        alert(`Producto "${name}" agregado exitosamente`);
    }

    localStorage.setItem('preciosDiarios', JSON.stringify(data));
    
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productUnit').value = '';
    
    renderTable(document.getElementById('filterType').value);
    toggleUpdateForm();
}

// Escuchar precios
document.getElementById('speakButton').addEventListener('click', () => {
    const utterance = new SpeechSynthesisUtterance();
    let text = 'Precios de productos agrícolas del día: ';
    data.forEach(item => {
        text += `${item.name}, ${item.price.toLocaleString('es-CO')} pesos por ${item.unit}. `;
    });
    utterance.text = text;
    utterance.lang = 'es-ES';
    speechSynthesis.speak(utterance);
});

// Filtrar productos
document.getElementById('filterType').addEventListener('change', (e) => {
    renderTable(e.target.value);
});

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    displayDate();
    renderTable();
});
