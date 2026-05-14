/* ============================================
   DASHBOARD.JS — Shared across all dashboards
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ── Load user session ──────────────────────────────────────
  var raw  = sessionStorage.getItem('arqUser');
  var user = raw ? JSON.parse(raw) : { name: 'Usuario', role: 'demo' };

  var nameEl   = document.getElementById('sidebar-name');
  var roleEl   = document.getElementById('sidebar-role');
  var avatarEl = document.getElementById('sidebar-avatar');
  if (nameEl)   nameEl.textContent   = user.name;
  if (roleEl)   roleEl.textContent   = user.role;
  if (avatarEl) avatarEl.textContent = (user.name || 'U').charAt(0).toUpperCase();

  // ── Logout ─────────────────────────────────────────────────
  var logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      sessionStorage.removeItem('arqUser');
      window.location.href = '../login.html';
    });
  }

  // ── Sidebar navigation / panel switching ───────────────────
  var links  = document.querySelectorAll('.sidebar-link[data-section]');
  var panels = document.querySelectorAll('.dash-panel');

  function showSection(id) {
    panels.forEach(function (p) { p.style.display = 'none'; });
    links.forEach(function (l)  { l.classList.remove('active'); });
    var panel = document.getElementById('panel-' + id);
    var link  = document.querySelector('.sidebar-link[data-section="' + id + '"]');
    if (panel) panel.style.display = 'block';
    if (link)  link.classList.add('active');
  }

  links.forEach(function (link) {
    link.addEventListener('click', function () {
      showSection(link.getAttribute('data-section'));
      // Close mobile sidebar
      var sidebar = document.querySelector('.sidebar');
      var overlay = document.getElementById('sidebarOverlay');
      if (sidebar) sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
    });
  });

  // Show first section
  if (links.length) showSection(links[0].getAttribute('data-section'));

  // ── Mobile hamburger ───────────────────────────────────────
  var hamBtn  = document.getElementById('hamburgerBtn');
  var sidebar = document.querySelector('.sidebar');
  var overlay = document.getElementById('sidebarOverlay');

  if (hamBtn && sidebar) {
    hamBtn.addEventListener('click', function () {
      sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('active');
    });
  }
  if (overlay) {
    overlay.addEventListener('click', function () {
      if (sidebar) sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });
  }

  // ── KPI counter animation ──────────────────────────────────
  document.querySelectorAll('.kpi-value[data-target]').forEach(function (el) {
    var target  = parseInt(el.getAttribute('data-target'), 10);
    var prefix  = el.getAttribute('data-prefix') || '';
    var suffix  = el.getAttribute('data-suffix') || '';
    var count   = 0;
    var inc     = target / 60;
    setTimeout(function () {
      var t = setInterval(function () {
        count += inc;
        if (count >= target) { count = target; clearInterval(t); }
        el.textContent = prefix + Math.floor(count).toLocaleString('es-MX') + suffix;
      }, 20);
    }, 300);
  });

  // ── Tab switching ──────────────────────────────────────────
  document.querySelectorAll('.dash-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var parent = tab.closest('.dash-tabs');
      if (parent) parent.querySelectorAll('.dash-tab').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
    });
  });

});

// ── Toast notification ─────────────────────────────────────────
function showToast(msg, type) {
  var bg = (type === 'error') ? '#B85C38' : '#1C1C1A';
  var el = document.createElement('div');
  el.style.cssText = 'position:fixed;bottom:2rem;right:2rem;z-index:9999;background:' + bg +
    ';color:#F5F0E8;padding:14px 24px;font-family:Jost,sans-serif;font-size:.85rem;' +
    'letter-spacing:.04em;box-shadow:0 8px 30px rgba(0,0,0,.25);opacity:0;transform:translateY(16px);transition:all .3s ease;';
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(function () { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
  setTimeout(function () {
    el.style.opacity = '0'; el.style.transform = 'translateY(16px)';
    setTimeout(function () { el.remove(); }, 300);
  }, 3200);
}

// ── Open Bootstrap modal ───────────────────────────────────────
function openModal(id) {
  var el = document.getElementById(id);
  if (el && typeof bootstrap !== 'undefined') new bootstrap.Modal(el).show();
}
