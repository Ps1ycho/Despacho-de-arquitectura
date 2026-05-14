/* ============================================
   MAIN.JS — Landing page scripts
   ============================================ */

// Navbar scroll effect
(function () {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }, { passive: true });
})();

// Smooth scroll with fixed navbar offset
document.addEventListener('DOMContentLoaded', function () {
  var OFFSET = 78;
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (!href || href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - OFFSET;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
});

// Active nav highlight on scroll
window.addEventListener('scroll', function () {
  var sections = document.querySelectorAll('section[id]');
  var links = document.querySelectorAll('.nav-links a[href^="#"]');
  var scrollY = window.pageYOffset + 100;
  sections.forEach(function (sec) {
    if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
      links.forEach(function (l) { l.classList.remove('active'); });
      var a = document.querySelector('.nav-links a[href="#' + sec.id + '"]');
      if (a) a.classList.add('active');
    }
  });
}, { passive: true });

// Scroll-reveal
(function () {
  var items = document.querySelectorAll('.stat-item, .process-step');
  if (!items.length || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('visible'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  items.forEach(function (el) { io.observe(el); });
})();

// Counter animation
(function () {
  var counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;
  function run(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var count = 0;
    var inc = target / 60;
    var t = setInterval(function () {
      count += inc;
      if (count >= target) { count = target; clearInterval(t); }
      el.textContent = Math.floor(count) + suffix;
    }, 25);
  }
  if (!('IntersectionObserver' in window)) { counters.forEach(run); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.5 });
  counters.forEach(function (el) { io.observe(el); });
})();
