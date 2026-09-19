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
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const status = document.querySelector('#form-status');
    const submit = form.querySelector('button[type="submit"]');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    data.consent = form.querySelector('#consent').checked;
    submit.disabled = true;
    submit.setAttribute('aria-busy', 'true');
    status.textContent = 'Sending your enquiry…';
    status.classList.add('show');

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) throw new Error(result.message || 'Unable to send enquiry.');
      status.textContent = result.message;
      form.reset();
    } catch (error) {
      status.textContent = error.message || 'We could not send your enquiry at present. Please try again shortly.';
    } finally {
      submit.disabled = false;
      submit.removeAttribute('aria-busy');
    }
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
const replayIntro = isHome && new URLSearchParams(location.search).get('replay-intro') === '1';
if (replayIntro) {
  try { sessionStorage.removeItem('oome-intro-seen'); } catch (_) {}
  history.replaceState(null, '', `${location.pathname}${location.hash}`);
}

let introSeen = false;
try { introSeen = sessionStorage.getItem('oome-intro-seen') === '1'; } catch (_) {}

if (isHome && !reducedMotion && !constrainedConnection && !introSeen) {
  const intro = document.createElement('div');
  intro.className = 'oome-intro';
  intro.setAttribute('aria-hidden', 'true');
  intro.innerHTML = `
    <div class="oome-intro__ground-glow"></div>
    <div class="oome-intro__emblem-stage">
      <img src="assets/oome-emblem-gold.png" alt="">
    </div>
    <div class="oome-intro__soil" aria-hidden="true"></div>
    <div class="oome-intro__brand">
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
  window.setTimeout(dismissIntro, 2200);
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') dismissIntro();
  }, { once: true });
}
