function showLoginForm() {
  const loginForm = document.getElementById('loginFormContainer');
  loginForm.classList.add('active');
  document.querySelector('.login-button').style.display = 'none';
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
  if (!profileType) {
    alert('Por favor selecciona un perfil');
    return;
  }
  
  document.getElementById('loginPanel').style.display = 'none';
  
  if (profileType === 'agricultor') {
    document.getElementById('farmerPanel').classList.add('active');
  } else if (profileType === 'comprador') {
    document.getElementById('buyerPanel').classList.add('active');
  } else if (profileType === 'movilidad') {
    document.getElementById('mobilityPanel').classList.add('active');
  }
}

function saveFarmer() {
  const name = document.getElementById('farmer-name').value;
  const location = document.getElementById('farmer-location').value;
  const products = document.getElementById('farmer-products').value;
  
  if (!name || !location || !products) {
    alert('Por favor completa todos los campos');
    return;
  }
  
  saveUser('agricultor', { name, location, products });
}

function saveBuyer() {
  const name = document.getElementById('buyer-name').value;
  const business = document.getElementById('buyer-business').value;
  const location = document.getElementById('buyer-location').value;
  
  if (!name || !business || !location) {
    alert('Por favor completa todos los campos');
    return;
  }
  
  saveUser('comprador', { name, business, location });
}

function saveMobility() {
  const name = document.getElementById('mobility-name').value;
  const vehicle = document.getElementById('mobility-vehicle').value;
  const plate = document.getElementById('mobility-plate').value;
  
  if (!name || !vehicle || !plate) {
    alert('Por favor completa todos los campos');
    return;
  }
  
  saveUser('movilidad', { name, vehicle, plate });
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
