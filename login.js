// Estado de la aplicación
let currentUser = null;
let currentProfile = null;

// Mostrar formulario de login
function showLoginForm() {
  const loginForm = document.getElementById('loginFormContainer');
  loginForm.classList.add('active');
  document.querySelector('.login-button').style.display = 'none';
}

// Manejar login
function handleLogin() {
  const userId = document.getElementById('user-id').value;
  const password = document.getElementById('password').value;

  if (!userId || !password) {
    alert('Por favor completa todos los campos');
    return;
  }

  // Guardar usuario
  currentUser = { userId, password };
  
  // Ocultar login y mostrar selección de perfil
  document.getElementById('loginFormContainer').classList.remove('active');
  document.getElementById('profileFormContainer').classList.add('active');
}

// Seleccionar perfil
function selectProfile(profileType) {
  currentProfile = profileType;
  
  // Ocultar selección de perfil
  document.getElementById('profileFormContainer').classList.remove('active');
  
  // Mostrar formulario correspondiente
  if (profileType === 'agricultor') {
    document.getElementById('farmerPanel').classList.add('active');
  } else if (profileType === 'comprador') {
    document.getElementById('buyerPanel').classList.add('active');
  } else if (profileType === 'movilidad') {
    document.getElementById('mobilityPanel').classList.add('active');
  }
}

// Guardar agricultor
function saveFarmer() {
  const name = document.getElementById('farmer-name').value;
  const location = document.getElementById('farmer-location').value;
  const products = document.getElementById('farmer-products').value;

  if (!name || !location || !products) {
    alert('Por favor completa todos los campos');
    return;
  }

  const farmerData = {
    ...currentUser,
    profile: 'agricultor',
    name,
    location,
    products
  };

  // Guardar en localStorage
  localStorage.setItem('userData', JSON.stringify(farmerData));
  
  alert(`¡Bienvenido ${name}! Tu perfil de agricultor ha sido registrado exitosamente.`);
  
  // Redirigir a la página principal
  window.location.href = 'index.html';
}

// Guardar comprador
function saveBuyer() {
  const name = document.getElementById('buyer-name').value;
  const business = document.getElementById('buyer-business').value;
  const location = document.getElementById('buyer-location').value;

  if (!name || !business || !location) {
    alert('Por favor completa todos los campos');
    return;
  }

  const buyerData = {
    ...currentUser,
    profile: 'comprador',
    name,
    business,
    location
  };

  // Guardar en localStorage
  localStorage.setItem('userData', JSON.stringify(buyerData));
  
  alert(`¡Bienvenido ${name}! Tu perfil de comprador ha sido registrado exitosamente.`);
  
  // Redirigir a la página de productos
  window.location.href = 'conectar.html';
}

// Guardar movilidad
function saveMobility() {
  const name = document.getElementById('mobility-name').value;
  const vehicle = document.getElementById('mobility-vehicle').value;
  const plate = document.getElementById('mobility-plate').value;

  if (!name || !vehicle || !plate) {
    alert('Por favor completa todos los campos');
    return;
  }

  const mobilityData = {
    ...currentUser,
    profile: 'movilidad',
    name,
    vehicle,
    plate
  };

  // Guardar en localStorage
  localStorage.setItem('userData', JSON.stringify(mobilityData));
  
  alert(`¡Bienvenido ${name}! Tu perfil de transportista ha sido registrado exitosamente.`);
  
  // Redirigir a la página principal
  window.location.href = 'index.html';
}

// Verificar si ya hay un usuario logueado
window.addEventListener('DOMContentLoaded', () => {
  const userData = localStorage.getItem('userData');
  if (userData) {
    const user = JSON.parse(userData);
    // Si ya está logueado, redirigir según el perfil
    if (confirm(`Ya tienes una sesión activa como ${user.name}. ¿Deseas continuar?`)) {
      if (user.profile === 'comprador') {
        window.location.href = 'conectar.html';
      } else {
        window.location.href = 'index.html';
      }
    } else {
      localStorage.removeItem('userData');
    }
  }
});
