document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const backToTop = document.querySelector('#backToTop');
  if (backToTop) {
    const toggleVisibility = () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    };
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const sideSocial = document.querySelector('.side-social');
  const hero = document.querySelector('.hero');
  const footer = document.querySelector('.site-footer');
  if (sideSocial && (hero || footer) && 'IntersectionObserver' in window) {
    const overlapping = new Set();
    const updateVisibility = () => {
      sideSocial.classList.toggle('is-hidden', overlapping.size > 0);
    };
    const watch = (el, options) => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) overlapping.add(el);
          else overlapping.delete(el);
        });
        updateVisibility();
      }, options);
      observer.observe(el);
    };
    if (hero) watch(hero, { threshold: 0.1 });
    // Requires a meaningful chunk of the footer visible (not just a sliver),
    // so the sidebar doesn't hide early right after the short CTA section.
    if (footer) watch(footer, { threshold: 0.3 });
  }

  const form = document.querySelector('#contact-form');
  if (form) {
    const status = document.querySelector('#form-status');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const lang = document.documentElement.lang === 'en' ? 'en' : 'pl';
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });

        if (response.ok) {
          form.reset();
          status.textContent = lang === 'en'
            ? "Thank you for your message. I'll reply as soon as possible."
            : 'Dziękuję za wiadomość. Odpowiem najszybciej, jak to możliwe.';
          status.className = 'form-status success';
        } else {
          throw new Error('Form submission failed');
        }
      } catch (err) {
        status.textContent = lang === 'en'
          ? 'Something went wrong. Please try again or email directly using the address alongside.'
          : 'Coś poszło nie tak. Spróbuj ponownie lub napisz bezpośrednio na adres e-mail obok.';
        status.className = 'form-status error';
      } finally {
        submitBtn.disabled = false;
      }
    });
  }
});
