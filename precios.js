// Estado de la síntesis de voz
let isSpeaking = false;
let currentUtterance = null;

// Prevenir múltiples retrocesos en el historial
if (window.history && window.history.pushState) {
    window.history.pushState('forward', null, window.location.href);
    window.addEventListener('popstate', function() {
        window.history.pushState('forward', null, window.location.href);
    });
}

// Cargar datos desde localStorage o usar datos por defecto
const fallbackData = [
    { name: "Tomate", type: "verdura", city: "bogota", priceMin: 2500, priceMax: 3500, unit: "kg" },
    { name: "Cebolla Cabezona", type: "verdura", city: "bogota", priceMin: 2000, priceMax: 3000, unit: "kg" },
    { name: "Papa Criolla", type: "tuberculo", city: "bogota", priceMin: 3000, priceMax: 4500, unit: "kg" },
    { name: "Plátano Hartón", type: "fruta", city: "bogota", priceMin: 2500, priceMax: 3200, unit: "kg" },
    { name: "Yuca", type: "tuberculo", city: "bogota", priceMin: 1800, priceMax: 2500, unit: "kg" },
    { name: "Arroz", type: "cereal", city: "bogota", priceMin: 3500, priceMax: 4500, unit: "kg" },
    { name: "Aguacate Hass", type: "fruta", city: "medellin", priceMin: 4000, priceMax: 6000, unit: "kg" },
    { name: "Zanahoria", type: "verdura", city: "medellin", priceMin: 1500, priceMax: 2200, unit: "kg" },
    { name: "Naranja Valencia", type: "fruta", city: "cali", priceMin: 2000, priceMax: 3000, unit: "kg" },
    { name: "Limón Tahití", type: "fruta", city: "cali", priceMin: 2500, priceMax: 3500, unit: "kg" },
    { name: "Café", type: "cereal", city: "bucaramanga", priceMin: 12000, priceMax: 15000, unit: "kg" },
    { name: "Maíz", type: "cereal", city: "bucaramanga", priceMin: 1800, priceMax: 2500, unit: "kg" }
];

let currentData = [];

// Mostrar fecha actual
function displayDate() {
    const dateDisplay = document.getElementById('dateDisplay');
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplay.textContent = today.toLocaleDateString('es-CO', options);
}

// Obtener precios de fuentes oficiales
async function fetchPrices() {
    const loading = document.getElementById('loading');
    loading.style.display = 'block';
    
    try {
        // Intentar obtener datos de API oficial del DANE/SIPSA
        // Nota: Esta es una URL de ejemplo. Debes reemplazarla con la API real del SIPSA
        const response = await fetch('https://www.datos.gov.co/resource/your-sipsa-endpoint.json');
        
        if (response.ok) {
            const data = await response.json();
            currentData = processAPIData(data);
            localStorage.setItem('preciosOficiales', JSON.stringify(currentData));
            localStorage.setItem('lastUpdate', new Date().toISOString());
        } else {
            throw new Error('API no disponible');
        }
    } catch (error) {
        console.log('Usando datos de referencia:', error.message);
        // Usar datos de referencia si la API no está disponible
        currentData = fallbackData;
        localStorage.setItem('preciosOficiales', JSON.stringify(currentData));
    } finally {
        loading.style.display = 'none';
        renderTable();
    }
}

// Procesar datos de la API oficial
function processAPIData(apiData) {
    // Adaptar estructura de datos de la API al formato interno
    return apiData.map(item => ({
        name: item.producto || item.name,
        type: item.categoria || item.type,
        city: item.ciudad || item.city,
        priceMin: parseFloat(item.precio_minimo || item.priceMin),
        priceMax: parseFloat(item.precio_maximo || item.priceMax),
        unit: item.unidad || item.unit
    }));
}

// Renderizar tabla
function renderTable(typeFilter = 'all', cityFilter = 'all') {
    const tbody = document.getElementById('priceTableBody');
    tbody.innerHTML = '';
    
    let filteredData = currentData;
    
    if (typeFilter !== 'all') {
        filteredData = filteredData.filter(item => item.type === typeFilter);
    }
    
    if (cityFilter !== 'all') {
        filteredData = filteredData.filter(item => item.city === cityFilter);
    }
    
    filteredData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td><span class="type-badge type-${item.type}">${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span></td>
            <td>${item.city.charAt(0).toUpperCase() + item.city.slice(1)}</td>
            <td class="price-min">$${item.priceMin.toLocaleString('es-CO')}</td>
            <td class="price-max">$${item.priceMax.toLocaleString('es-CO')}</td>
            <td>${item.unit}</td>
        `;
        tbody.appendChild(row);
    });
}

// Escuchar precios con control de reproducción
document.getElementById('speakButton').addEventListener('click', () => {
    const button = document.getElementById('speakButton');
    
    if (isSpeaking) {
        // Detener la reproducción
        speechSynthesis.cancel();
        isSpeaking = false;
        button.textContent = '🔊 Escuchar Precios';
        button.style.background = 'linear-gradient(135deg, #5a7c3e 0%, #4a6c2e 100%)';
    } else {
        // Iniciar la reproducción
        currentUtterance = new SpeechSynthesisUtterance();
        let text = 'Precios oficiales de productos agrícolas: ';
        currentData.slice(0, 5).forEach(item => {
            text += `${item.name}, desde ${item.priceMin.toLocaleString('es-CO')} hasta ${item.priceMax.toLocaleString('es-CO')} pesos por ${item.unit}. `;
        });
        
        currentUtterance.text = text;
        currentUtterance.lang = 'es-ES';
        currentUtterance.rate = 0.9;
        currentUtterance.pitch = 1.1;
        
        // Obtener voces disponibles y seleccionar una femenina
        const voices = speechSynthesis.getVoices();
        const spanishVoice = voices.find(voice => 
            voice.lang.startsWith('es') && voice.name.includes('Female')
        ) || voices.find(voice => voice.lang.startsWith('es'));
        
        if (spanishVoice) {
            currentUtterance.voice = spanishVoice;
        }
        
        currentUtterance.onend = () => {
            isSpeaking = false;
            button.textContent = '🔊 Escuchar Precios';
            button.style.background = 'linear-gradient(135deg, #5a7c3e 0%, #4a6c2e 100%)';
        };
        
        speechSynthesis.speak(currentUtterance);
        isSpeaking = true;
        button.textContent = '⏸️ Detener';
        button.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
    }
});

// Filtros
document.getElementById('filterType').addEventListener('change', (e) => {
    const cityFilter = document.getElementById('filterCity').value;
    renderTable(e.target.value, cityFilter);
});

document.getElementById('filterCity').addEventListener('change', (e) => {
    const typeFilter = document.getElementById('filterType').value;
    renderTable(typeFilter, e.target.value);
});

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    displayDate();
    
    // Cargar voces cuando estén disponibles
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => {
            speechSynthesis.getVoices();
        };
    }
    
    // Cargar datos guardados o obtener nuevos
    const savedData = localStorage.getItem('preciosOficiales');
    const lastUpdate = localStorage.getItem('lastUpdate');
    
    if (savedData && lastUpdate) {
        const lastUpdateDate = new Date(lastUpdate);
        const now = new Date();
        const hoursDiff = (now - lastUpdateDate) / (1000 * 60 * 60);
        
        // Si los datos tienen menos de 24 horas, usarlos
        if (hoursDiff < 24) {
            currentData = JSON.parse(savedData);
            renderTable();
        } else {
            fetchPrices();
        }
    } else {
        fetchPrices();
    }
});
