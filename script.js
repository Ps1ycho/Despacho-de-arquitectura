
//NAVBAR — cambia al hacer scroll

const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

//REVEAL ON SCROLL — animaciones al aparecer

const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 100);
    }
  });
}, { threshold: 0.1 });

reveals.forEach(el => observer.observe(el));

//LOGIN TABS — cambio de pestaña

const tabData = {
  cliente:    { title: 'Bienvenido',        sub: 'Consulta el avance de tus proyectos' },
  arquitecto: { title: 'Portal Arquitecto', sub: 'Gestiona tus proyectos asignados' },
  admin:      { title: 'Administración',    sub: 'Panel de control del despacho' }
};

function switchTab(el, role) {
  document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('loginTitle').textContent = tabData[role].title;
  document.getElementById('loginSub').textContent = tabData[role].sub;
}

// FORMULARIO DE CONTACTO 
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-submit');
  btn.textContent = '✓ Mensaje enviado';
  btn.style.background = '#4a7c59';
  setTimeout(() => {
    btn.textContent = 'Enviar Mensaje';
    btn.style.background = '';
  }, 3000);
}

// FORMULARIO DE LOGIN 

function handleLogin(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-submit');
  btn.textContent = 'Verificando...';
  setTimeout(() => {
    btn.textContent = 'Iniciar Sesión';
  }, 2000);
}

const menuToggle = document.getElementById('menuToggle');
const menuMobile = document.getElementById('menuMobile');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  menuMobile.classList.toggle('active');
});

function cerrarMenu() {
  menuToggle.classList.remove('active');
  menuMobile.classList.remove('active');
}