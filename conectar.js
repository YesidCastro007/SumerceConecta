// Productos disponibles
const products = [
    {
        name: "Tomates Frescos",
        price: 3500,
        description: "Tomates orgánicos cultivados sin pesticidas",
        image: "img/5.jpg",
        farmer: "Familia Gómez - Santander",
        unit: "kg"
    },
    {
        name: "Aguacates Hass",
        price: 5000,
        description: "Aguacates cremosos de primera calidad",
        image: "img/6.jpg",
        farmer: "Don Miguel - Antioquia",
        unit: "kg"
    },
    {
        name: "Lechugas Hidropónicas",
        price: 2500,
        description: "Lechugas frescas cultivadas en invernadero",
        image: "img/7.jpg",
        farmer: "Cooperativa VerdeVida - Cundinamarca",
        unit: "unidad"
    },
    {
        name: "Café Premium",
        price: 15000,
        description: "Café 100% colombiano de altura",
        image: "img/1.jpg",
        farmer: "Caficultores del Eje - Quindío",
        unit: "500g"
    },
    {
        name: "Plátanos Hartón",
        price: 2800,
        description: "Plátanos verdes para cocinar",
        image: "img/2.jpg",
        farmer: "Finca La Esperanza - Valle",
        unit: "kg"
    },
    {
        name: "Yuca Fresca",
        price: 2000,
        description: "Yuca recién cosechada",
        image: "img/3.jpg",
        farmer: "Agricultores Unidos - Tolima",
        unit: "kg"
    }
];

// Carrito de compras
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Prevenir múltiples retrocesos en el historial
if (window.history && window.history.pushState) {
    window.history.pushState('forward', null, window.location.href);
    window.addEventListener('popstate', function() {
        window.history.pushState('forward', null, window.location.href);
    });
}

// Mostrar productos
function displayProducts(filteredProducts) {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = '';
    
    filteredProducts.forEach((product, index) => {
        const productCard = `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="description">${product.description}</p>
                    <p class="price">$${product.price.toLocaleString('es-CO')} / ${product.unit}</p>
                    <div class="farmer-info">
                        👨‍🌾 ${product.farmer}
                    </div>
                    <div class="product-buttons">
                        <button class="btn-add" onclick='addToCart(${JSON.stringify(product)})'>
                            🛒 Agregar
                        </button>
                        <button class="btn-details" onclick='showDetails(${index})'>
                            ℹ️ Detalles
                        </button>
                    </div>
                </div>
            </div>
        `;
        productsContainer.innerHTML += productCard;
    });
}

// Filtrar productos
function filterProducts() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
}

// Agregar al carrito
function addToCart(product) {
    const existingItem = cart.find(item => item.name === product.name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    
    // Animación de feedback
    const btn = event.target;
    btn.textContent = '✅ Agregado';
    btn.style.background = 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)';
    setTimeout(() => {
        btn.textContent = '🛒 Agregar';
        btn.style.background = 'linear-gradient(135deg, #5a7c3e 0%, #4a6c2e 100%)';
    }, 1000);
}

// Actualizar carrito
function updateCart() {
    const cartContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p style="text-align: center; color: #8b6f47; padding: 2rem;">Tu carrito está vacío</p>';
        cartTotal.textContent = 'Total: $0';
        return;
    }
    
    cartContainer.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const cartItem = `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name} (x${item.quantity})</h4>
                    <p>$${(item.price * item.quantity).toLocaleString('es-CO')}</p>
                </div>
                <button onclick="removeFromCart(${index})">❌</button>
            </div>
        `;
        cartContainer.innerHTML += cartItem;
    });
    
    cartTotal.textContent = `Total: $${total.toLocaleString('es-CO')}`;
}

// Eliminar del carrito
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

// Vaciar carrito
function clearCart() {
    if (cart.length === 0) {
        alert('El carrito ya está vacío');
        return;
    }
    
    if (confirm('¿Estás seguro de vaciar el carrito?')) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }
}

// Proceder al pago
function proceedToOrder() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío. Agrega productos antes de continuar.');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemsList = cart.map(item => `${item.name} x${item.quantity}`).join(', ');
    
    alert(`🎉 ¡Pedido confirmado!\n\nProductos: ${itemsList}\n\nTotal: $${total.toLocaleString('es-CO')}\n\n📦 Tu pedido será procesado y entregado en 24-48 horas.\n\n¡Gracias por apoyar a nuestros campesinos!`);
    
    // Limpiar carrito después del pedido
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

// Mostrar detalles del producto
function showDetails(index) {
    const product = products[index];
    alert(`📦 ${product.name}\n\n${product.description}\n\n💰 Precio: $${product.price.toLocaleString('es-CO')} / ${product.unit}\n\n👨‍🌾 Productor: ${product.farmer}\n\n🌱 Producto fresco y de calidad directamente del campo`);
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    displayProducts(products);
    updateCart();
    
    // Escuchar cambios en el buscador
    document.getElementById('search').addEventListener('input', filterProducts);
});
