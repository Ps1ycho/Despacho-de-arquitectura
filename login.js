/* ============================================
   LOGIN.JS  — Arq Studio
   Sistema de acceso con registro por código
   ============================================ */

// ── Base de datos en localStorage ────────────────────────────
// (En producción esto sería una API/BD real)

function getDB() {
  var raw = localStorage.getItem('arqDB');
  var db;

  if (!raw) {
    // Primera vez: crear BD completa
    db = {
      users: {
        admin:      { password: '1234', role: 'admin',      name: 'Admin General',     active: true, creado: '2025' },
        arquitecto: { password: '1234', role: 'arquitecto', name: 'Arq. Carlos Reyes', active: true, creado: '2025' },
        cliente:    { password: '1234', role: 'cliente',    name: 'Maria Gonzalez',    active: true, creado: '2025' }
      },
      codes: {},
      solicitudes: []
    };
  } else {
    db = JSON.parse(raw);

    // Migración: si ya existía pero le faltan usuarios demo, los agrega
    if (!db.users) db.users = {};
    if (!db.codes) db.codes = {};
    if (!db.solicitudes) db.solicitudes = [];

    var demos = {
      admin:      { password: '1234', role: 'admin',      name: 'Admin General',     active: true, creado: '2025' },
      arquitecto: { password: '1234', role: 'arquitecto', name: 'Arq. Carlos Reyes', active: true, creado: '2025' },
      cliente:    { password: '1234', role: 'cliente',    name: 'Maria Gonzalez',    active: true, creado: '2025' }
    };
    Object.keys(demos).forEach(function (u) {
      if (!db.users[u]) db.users[u] = demos[u];
    });
  }

  localStorage.setItem('arqDB', JSON.stringify(db));
  return db;
}

function saveDB(db) {
  localStorage.setItem('arqDB', JSON.stringify(db));
}

// ── Redireccion por rol ───────────────────────────────────────
var REDIRECTS = {
  admin:      'page/admin-dashboard.html',
  arquitecto: 'page/arquitecto-dashboard.html',
  cliente:    'page/cliente-dashboard.html'
};

// ── Selector de rol ───────────────────────────────────────────
document.querySelectorAll('.role-option').forEach(function (opt) {
  opt.addEventListener('click', function () {
    document.querySelectorAll('.role-option').forEach(function (o) { o.classList.remove('active'); });
    opt.classList.add('active');
    // rol seleccionado visualmente, sin rellenar el campo usuario
  });
});

// ── Login ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  var form     = document.getElementById('loginForm');
  var errorBox = document.getElementById('loginError');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var username = document.getElementById('username').value.trim().toLowerCase();
    var password = document.getElementById('password').value;
    var btn      = document.getElementById('loginBtn');

    errorBox.style.display = 'none';
    btn.textContent = 'Verificando...';
    btn.disabled    = true;

    setTimeout(function () {
      var db   = getDB();
      var user = db.users[username];

      if (user && user.password === password && user.active) {
        sessionStorage.setItem('arqUser', JSON.stringify({
          username: username,
          name:     user.name,
          role:     user.role
        }));
        btn.textContent = 'Accediendo...';
        window.location.href = REDIRECTS[user.role] || 'index.html';
      } else {
        errorBox.textContent = 'Usuario o contraseña incorrectos, o cuenta inactiva.';
        errorBox.style.display = 'block';
        btn.textContent  = 'Ingresar al Sistema';
        btn.disabled     = false;
        document.getElementById('password').value = '';
      }
    }, 600);
  });
});

// ════════════════════════════════════════════════════════════
// MODAL DE REGISTRO
// ════════════════════════════════════════════════════════════
function openRegisterModal() {
  var modal = document.getElementById('registerModal');
  modal.style.display = 'flex';
  renderSolicitudes();
  renderUsuarios();
}

function closeRegisterModal() {
  document.getElementById('registerModal').style.display = 'none';
  resetAllForms();
}

// Cerrar con clic fuera
document.addEventListener('DOMContentLoaded', function () {
  var modal = document.getElementById('registerModal');
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeRegisterModal();
    });
  }
});

function resetAllForms() {
  // Solicitud
  var sf = document.getElementById('solicitudForm');
  if (sf) { sf.reset(); }
  var ss = document.getElementById('solicitudSuccess');
  var sf2 = document.getElementById('solicitudForm');
  if (ss) ss.style.display = 'none';
  if (sf2) sf2.style.display = 'block';
  hideError('solicitudError');

  // Código
  document.getElementById('codigoPaso1').style.display = 'block';
  document.getElementById('codigoPaso2').style.display = 'none';
  document.getElementById('codigoSuccess').style.display = 'none';
  var cf = document.getElementById('codigoForm');
  if (cf) cf.reset();
  hideError('codigoError1');
  hideError('codigoError2');

  // Admin
  document.getElementById('adminAuthPanel').style.display    = 'block';
  document.getElementById('adminGestionPanel').style.display = 'none';
  document.getElementById('codigoGeneradoPanel').style.display = 'none';
  hideError('admAuthError');

  switchRegTab('solicitud');
}

function switchRegTab(tab) {
  document.querySelectorAll('.reg-tab').forEach(function (t, i) {
    var tabs = ['solicitud','codigo','admin'];
    t.classList.toggle('active', tabs[i] === tab);
  });
  document.querySelectorAll('.reg-panel').forEach(function (p) { p.classList.remove('active'); });
  document.getElementById('tab-' + tab).classList.add('active');
}

// ── Helpers ───────────────────────────────────────────────────
function showError(id, msg) {
  var el = document.getElementById(id);
  el.textContent = msg;
  el.style.display = 'block';
}
function hideError(id) {
  var el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

// ════════════════════════════════════════════════════════════
// TAB 1 — ENVIAR SOLICITUD
// ════════════════════════════════════════════════════════════
function enviarSolicitud() {
  hideError('solicitudError');

  var nombre = document.getElementById('sol-nombre').value.trim();
  var email  = document.getElementById('sol-email').value.trim();
  var rol    = document.getElementById('sol-rol').value;
  var motivo = document.getElementById('sol-motivo').value.trim();

  if (!nombre) { showError('solicitudError', 'El nombre es obligatorio.'); return; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('solicitudError', 'Ingresa un email válido.'); return;
  }
  if (!rol)    { showError('solicitudError', 'Selecciona un rol.'); return; }
  if (!motivo) { showError('solicitudError', 'Describe el motivo de tu solicitud.'); return; }

  var db = getDB();
  db.solicitudes.push({
    nombre:  nombre,
    email:   email,
    tel:     document.getElementById('sol-tel').value.trim(),
    empresa: document.getElementById('sol-empresa').value.trim(),
    rol:     rol,
    motivo:  motivo,
    fecha:   new Date().toLocaleDateString('es-MX'),
    estado:  'pendiente'
  });
  saveDB(db);

  document.getElementById('solicitudForm').style.display = 'none';
  document.getElementById('solicitudSuccess').style.display = 'block';
}

// ════════════════════════════════════════════════════════════
// TAB 2 — USAR CÓDIGO
// ════════════════════════════════════════════════════════════
var codigoValidado = null;

function validarCodigo() {
  hideError('codigoError1');
  var codigo = document.getElementById('cod-codigo').value.trim().toUpperCase();

  if (!codigo) { showError('codigoError1', 'Ingresa tu código de activación.'); return; }

  var db   = getDB();
  var info = db.codes[codigo];

  if (!info) {
    showError('codigoError1', 'Código inválido. Verifica que lo hayas escrito correctamente.');
    return;
  }
  if (info.usado) {
    showError('codigoError1', 'Este código ya fue utilizado. Solicita uno nuevo al administrador.');
    return;
  }

  // Verificar expiración (7 días)
  var ahora    = Date.now();
  var creacion = info.timestamp || ahora;
  var dias     = (ahora - creacion) / (1000 * 60 * 60 * 24);
  if (dias > 7) {
    showError('codigoError1', 'Este código ha expirado (7 días). Solicita uno nuevo al administrador.');
    return;
  }

  codigoValidado = { codigo: codigo, rol: info.rol, para: info.para };
  document.getElementById('codigoPaso1').style.display = 'none';
  document.getElementById('codigoPaso2').style.display = 'block';
  document.getElementById('cod-rol-info').textContent = ' Rol: ' + info.rol;
}

function crearCuenta() {
  hideError('codigoError2');

  var usuario = document.getElementById('cod-usuario').value.trim().toLowerCase();
  var nombre  = document.getElementById('cod-nombre').value.trim();
  var pass    = document.getElementById('cod-pass').value;
  var pass2   = document.getElementById('cod-pass2').value;

  if (!usuario || usuario.length < 3) {
    showError('codigoError2', 'El nombre de usuario debe tener al menos 3 caracteres, sin espacios.'); return;
  }
  if (/\s/.test(usuario)) {
    showError('codigoError2', 'El nombre de usuario no puede tener espacios.'); return;
  }
  if (!nombre) {
    showError('codigoError2', 'El nombre completo es obligatorio.'); return;
  }
  if (!pass || pass.length < 6) {
    showError('codigoError2', 'La contraseña debe tener al menos 6 caracteres.'); return;
  }
  if (pass !== pass2) {
    showError('codigoError2', 'Las contraseñas no coinciden.'); return;
  }

  var db = getDB();

  if (db.users[usuario]) {
    showError('codigoError2', 'Ese nombre de usuario ya existe. Elige otro.'); return;
  }

  // Crear usuario
  db.users[usuario] = {
    password: pass,
    role:     codigoValidado.rol,
    name:     nombre,
    active:   true,
    creado:   new Date().toLocaleDateString('es-MX')
  };

  // Marcar código como usado
  db.codes[codigoValidado.codigo].usado = true;
  db.codes[codigoValidado.codigo].usadoPor = usuario;

  saveDB(db);

  document.getElementById('codigoForm').style.display = 'none';
  document.getElementById('codigoSuccess').style.display = 'block';
}

// ════════════════════════════════════════════════════════════
// TAB 3 — PANEL ADMIN
// ════════════════════════════════════════════════════════════
var adminAutenticado = false;

function autenticarAdmin() {
  hideError('admAuthError');
  var user = document.getElementById('adm-user').value.trim().toLowerCase();
  var pass = document.getElementById('adm-pass').value;

  var db   = getDB();
  var info = db.users[user];

  if (!info || info.role !== 'admin' || info.password !== pass) {
    showError('admAuthError', 'Credenciales de administrador incorrectas.');
    return;
  }

  adminAutenticado = true;
  document.getElementById('adminAuthPanel').style.display    = 'none';
  document.getElementById('adminGestionPanel').style.display = 'block';
  renderSolicitudes();
  renderUsuarios();
}

function cerrarSesionAdmin() {
  adminAutenticado = false;
  document.getElementById('adminAuthPanel').style.display    = 'block';
  document.getElementById('adminGestionPanel').style.display = 'none';
  document.getElementById('adm-pass').value = '';
  document.getElementById('codigoGeneradoPanel').style.display = 'none';
}

// ── Generar código ────────────────────────────────────────────
function generarCodigo() {
  var rol  = document.getElementById('gen-rol').value;
  var para = document.getElementById('gen-para').value.trim() || 'Usuario';

  var prefijo  = rol === 'arquitecto' ? 'ARQ' : 'CLI';
  var anio     = new Date().getFullYear();
  var aleatorio = Math.random().toString(36).substring(2, 6).toUpperCase();
  var codigo   = prefijo + '-' + anio + '-' + aleatorio;

  var db = getDB();
  db.codes[codigo] = {
    rol:       rol,
    para:      para,
    usado:     false,
    timestamp: Date.now(),
    fecha:     new Date().toLocaleDateString('es-MX')
  };
  saveDB(db);

  document.getElementById('codigoGeneradoTexto').textContent = codigo;
  document.getElementById('gen-para-display').textContent    = para;
  document.getElementById('gen-rol-display').textContent     = rol;
  document.getElementById('codigoGeneradoPanel').style.display = 'block';
}

function copiarCodigo() {
  var texto = document.getElementById('codigoGeneradoTexto').textContent;
  navigator.clipboard.writeText(texto).then(function () {
    var btn = event.target;
    btn.textContent = '✓ Copiado';
    setTimeout(function () { btn.textContent = 'Copiar Código'; }, 2000);
  });
}

// ── Render solicitudes ────────────────────────────────────────
function renderSolicitudes() {
  var el = document.getElementById('solicitudesList');
  if (!el) return;
  var db = getDB();
  var pendientes = db.solicitudes.filter(function (s) { return s.estado === 'pendiente'; });

  if (!pendientes.length) {
    el.innerHTML = '<p style="font-size:.82rem;color:var(--stone);padding:.8rem;background:var(--border-light);text-align:center;">No hay solicitudes pendientes.</p>';
    return;
  }

  el.innerHTML = pendientes.map(function (s, i) {
    var realIdx = db.solicitudes.indexOf(s);
    return '<div style="border:1px solid var(--border);padding:.9rem;margin-bottom:.6rem;font-size:.82rem;">' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.5rem;">' +
        '<div><strong style="color:var(--charcoal)">' + s.nombre + '</strong> <span style="color:var(--stone);">(' + s.rol + ')</span><br>' +
        '<span style="color:var(--stone);font-size:.75rem;">' + s.email + (s.tel ? ' · ' + s.tel : '') + '</span></div>' +
        '<span style="font-size:.7rem;color:var(--stone);">' + s.fecha + '</span>' +
      '</div>' +
      '<div style="color:var(--stone);margin-bottom:.6rem;font-size:.78rem;">' + s.motivo + '</div>' +
      '<div style="display:flex;gap:.5rem;">' +
        '<button onclick="aprobarSolicitud(' + realIdx + ')" style="flex:1;padding:.45rem;background:#2D5016;color:white;border:none;font-size:.7rem;cursor:pointer;font-family:Jost,sans-serif;letter-spacing:.08em;">✓ Aprobar y Generar Código</button>' +
        '<button onclick="rechazarSolicitud(' + realIdx + ')" style="flex:1;padding:.45rem;background:#B85C38;color:white;border:none;font-size:.7rem;cursor:pointer;font-family:Jost,sans-serif;letter-spacing:.08em;">✕ Rechazar</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

function aprobarSolicitud(idx) {
  var db = getDB();
  var s  = db.solicitudes[idx];
  if (!s) return;

  var prefijo   = s.rol === 'arquitecto' ? 'ARQ' : 'CLI';
  var anio      = new Date().getFullYear();
  var aleatorio = Math.random().toString(36).substring(2, 6).toUpperCase();
  var codigo    = prefijo + '-' + anio + '-' + aleatorio;

  db.codes[codigo] = {
    rol:       s.rol,
    para:      s.nombre,
    usado:     false,
    timestamp: Date.now(),
    fecha:     new Date().toLocaleDateString('es-MX')
  };
  db.solicitudes[idx].estado = 'aprobada';
  db.solicitudes[idx].codigo = codigo;
  saveDB(db);

  alert('Solicitud aprobada.\n\nCódigo generado para ' + s.nombre + ':\n\n' + codigo + '\n\nComparte este código con el usuario para que pueda crear su cuenta.');
  renderSolicitudes();
}

function rechazarSolicitud(idx) {
  if (!confirm('¿Rechazar esta solicitud?')) return;
  var db = getDB();
  db.solicitudes[idx].estado = 'rechazada';
  saveDB(db);
  renderSolicitudes();
}

// ── Render usuarios ───────────────────────────────────────────
function renderUsuarios() {
  var el = document.getElementById('usuariosList');
  if (!el) return;
  var db    = getDB();
  var users = db.users;

  var filas = Object.keys(users).map(function (u) {
    var info = users[u];
    var rolColor = { admin: '#1E3A5F', arquitecto: '#2D5016', cliente: '#7B3F00' }[info.role] || '#555';
    return '<tr>' +
      '<td style="padding:.5rem .6rem;font-weight:600;font-size:.8rem;">' + u + '</td>' +
      '<td style="padding:.5rem .6rem;font-size:.8rem;">' + info.name + '</td>' +
      '<td style="padding:.5rem .6rem;"><span style="font-size:.68rem;font-family:Jost,sans-serif;letter-spacing:.08em;text-transform:uppercase;background:' + rolColor + '22;color:' + rolColor + ';padding:2px 8px;">' + info.role + '</span></td>' +
      '<td style="padding:.5rem .6rem;font-size:.8rem;">' + (info.creado || '—') + '</td>' +
      '<td style="padding:.5rem .6rem;">' +
        (u !== 'admin' ? '<button onclick="toggleUsuario(\'' + u + '\')" style="font-size:.68rem;padding:3px 8px;background:' + (info.active ? 'rgba(184,92,56,.12)' : 'rgba(45,80,22,.12)') + ';border:none;cursor:pointer;color:' + (info.active ? '#B85C38' : '#2D5016') + ';">' + (info.active ? 'Desactivar' : 'Activar') + '</button>' : '<span style="font-size:.72rem;color:var(--stone);">—</span>') +
      '</td>' +
    '</tr>';
  }).join('');

  el.innerHTML = '<table style="width:100%;border-collapse:collapse;font-family:Jost,sans-serif;">' +
    '<thead><tr style="background:#F0EEEB;">' +
      '<th style="padding:.5rem .6rem;font-size:.72rem;letter-spacing:.08em;text-align:left;color:var(--stone);">USUARIO</th>' +
      '<th style="padding:.5rem .6rem;font-size:.72rem;letter-spacing:.08em;text-align:left;color:var(--stone);">NOMBRE</th>' +
      '<th style="padding:.5rem .6rem;font-size:.72rem;letter-spacing:.08em;text-align:left;color:var(--stone);">ROL</th>' +
      '<th style="padding:.5rem .6rem;font-size:.72rem;letter-spacing:.08em;text-align:left;color:var(--stone);">CREADO</th>' +
      '<th style="padding:.5rem .6rem;font-size:.72rem;letter-spacing:.08em;text-align:left;color:var(--stone);">ACCIÓN</th>' +
    '</tr></thead><tbody>' + filas + '</tbody></table>';
}

function toggleUsuario(username) {
  var db   = getDB();
  var user = db.users[username];
  if (!user || username === 'admin') return;
  user.active = !user.active;
  saveDB(db);
  renderUsuarios();
}
