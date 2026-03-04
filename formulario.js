function showLoginForm() {
  document.getElementById('initialButton').style.display = 'none';
  document.getElementById('loginFormContainer').classList.add('active');
}

// Prevenir múltiples retrocesos en el historial
if (window.history && window.history.pushState) {
    window.history.pushState('forward', null, window.location.href);
    window.addEventListener('popstate', function() {
        window.history.pushState('forward', null, window.location.href);
    });
}

function handleLogin() {
  const userId = document.getElementById('user-id').value;
  const password = document.getElementById('password').value;
  
  if (!userId || !password) {
    alert('Por favor completa todos los campos');
    return;
  }
  
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  
  if (users[userId]) {
    if (users[userId].password === password) {
      alert('Inicio de sesión exitoso');
      window.location.href = 'index.html';
    } else {
      alert('Contraseña incorrecta');
    }
  } else {
    localStorage.setItem('currentUserId', userId);
    localStorage.setItem('currentPassword', password);
    document.getElementById('loginFormContainer').classList.remove('active');
    document.getElementById('profileFormContainer').classList.add('active');
  }
}

function selectProfile(profileType) {
  document.getElementById('profileFormContainer').classList.remove('active');
  
  if (profileType === 'campesino') {
    document.getElementById('campesinoPanel').classList.add('active');
  } else if (profileType === 'consumidor') {
    document.getElementById('consumidorPanel').classList.add('active');
  } else if (profileType === 'transportador') {
    document.getElementById('transportadorPanel').classList.add('active');
  }
}

function saveCampesino() {
  const name = document.getElementById('campesino-name').value;
  const location = document.getElementById('campesino-location').value;
  const products = document.getElementById('campesino-products').value;
  
  if (!name || !location || !products) {
    alert('Por favor completa todos los campos');
    return;
  }
  
  saveUser('campesino', { name, location, products });
}

function saveConsumidor() {
  const name = document.getElementById('consumidor-name').value;
  const business = document.getElementById('consumidor-business').value;
  const location = document.getElementById('consumidor-location').value;
  
  if (!name || !business || !location) {
    alert('Por favor completa todos los campos');
    return;
  }
  
  saveUser('consumidor', { name, business, location });
}

function saveTransportador() {
  const name = document.getElementById('transportador-name').value;
  const vehicle = document.getElementById('transportador-vehicle').value;
  const plate = document.getElementById('transportador-plate').value;
  
  if (!name || !vehicle || !plate) {
    alert('Por favor completa todos los campos');
    return;
  }
  
  saveUser('transportador', { name, vehicle, plate });
}

function saveUser(profileType, data) {
  const userId = localStorage.getItem('currentUserId');
  const password = localStorage.getItem('currentPassword');
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  
  users[userId] = {
    password,
    profileType,
    ...data
  };
  
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.removeItem('currentUserId');
  localStorage.removeItem('currentPassword');
  
  alert('Registro exitoso');
  window.location.href = 'index.html';
}
