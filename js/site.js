/* BathTimeFish site — shared behaviour (navigation + FAQ accordion) */
(function () {
  'use strict';

  // Mobile navigation toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Close open dropdowns / mobile nav when clicking outside or pressing Escape
  function closeMenus(except) {
    document.querySelectorAll('details.nav-dropdown[open]').forEach(function (d) {
      if (d !== except) d.removeAttribute('open');
    });
  }
  document.addEventListener('click', function (e) {
    var inside = e.target.closest('details.nav-dropdown');
    closeMenus(inside);
    if (nav && toggle && nav.classList.contains('is-open') &&
        !nav.contains(e.target) && !toggle.contains(e.target)) {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMenus(null);
      if (nav && toggle) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // FAQ accordion (one item open at a time)
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var q = item.querySelector('.faq-q');
    if (!q) return;
    q.setAttribute('aria-expanded', 'false');
    q.addEventListener('click', function () {
      var isActive = item.classList.contains('active');
      faqItems.forEach(function (other) {
        other.classList.remove('active');
        var oq = other.querySelector('.faq-q');
        if (oq) oq.setAttribute('aria-expanded', 'false');
      });
      if (!isActive) {
        item.classList.add('active');
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();
