document.documentElement.classList.add('js');

const button = document.querySelector('.menu-button');
const nav = document.querySelector('.nav-links');
if (button && nav) {
  button.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
    button.textContent = open ? '×' : '☰';
  });
}

const form = document.querySelector('#enquiry-form');
if (form) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const status = document.querySelector('#form-status');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    status.textContent = 'Your enquiry details have been prepared. OOME will connect a verified controlled contact route before public submission is enabled.';
    status.classList.add('show');
  });
}

const revealTargets = document.querySelectorAll('.statement, .capabilities, .principles, .band, .content, .cta, .site-footer, .page-hero .wrap');
revealTargets.forEach(section => section.classList.add('reveal'));

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });
  revealTargets.forEach(section => revealObserver.observe(section));
} else {
  revealTargets.forEach(section => section.classList.add('is-visible'));
}

const isHome = location.pathname === '/' || location.pathname.endsWith('/index.html');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
const constrainedConnection = Boolean(connection?.saveData) || /(^|-)2g|3g/.test(connection?.effectiveType || '');
if (constrainedConnection) {
  document.querySelectorAll('video[poster]').forEach(video => {
    video.removeAttribute('autoplay');
    video.querySelector('source')?.remove();
    video.load();
  });
}
let introSeen = false;
try { introSeen = sessionStorage.getItem('oome-intro-seen') === '1'; } catch (_) {}

if (isHome && !reducedMotion && !constrainedConnection && !introSeen) {
  const intro = document.createElement('div');
  intro.className = 'oome-intro';
  intro.setAttribute('aria-hidden', 'true');
  intro.innerHTML = `
    <div class="oome-intro__halo"></div>
    <div class="oome-intro__brand">
      <img src="assets/oome-wordmark-header-clean.png" alt="">
      <span></span>
      <p>Ghanaian mineral expertise · international trade discipline</p>
    </div>`;
  document.body.appendChild(intro);
  document.body.classList.add('intro-active');
  try { sessionStorage.setItem('oome-intro-seen', '1'); } catch (_) {}

  const dismissIntro = () => {
    if (intro.classList.contains('is-exiting')) return;
    intro.classList.add('is-exiting');
    document.body.classList.remove('intro-active');
    window.setTimeout(() => intro.remove(), 700);
  };
  window.setTimeout(dismissIntro, 1050);
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') dismissIntro();
  }, { once: true });
}
