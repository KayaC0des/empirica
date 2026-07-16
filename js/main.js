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

  const checkIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l6 6L20 6"/></svg>';
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    const originalIcon = btn.innerHTML;
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        return;
      }
      btn.innerHTML = checkIcon;
      btn.classList.add('is-copied');
      setTimeout(() => {
        btn.innerHTML = originalIcon;
        btn.classList.remove('is-copied');
      }, 1500);
    });
  });

  const symbolism = document.querySelector('[data-symbolism]');
  if (symbolism) {
    const items = Array.from(symbolism.querySelectorAll('.symbolism-item'));
    const panels = Array.from(symbolism.querySelectorAll('.symbolism-panel-item'));
    items.forEach((item, i) => {
      item.addEventListener('click', () => {
        items.forEach((it, j) => it.classList.toggle('is-active', j === i));
        panels.forEach((p, j) => p.classList.toggle('is-active', j === i));
      });
    });
  }

  const carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    const track = carousel.querySelector('.testimonial-track');
    const slides = Array.from(carousel.querySelectorAll('.testimonial-slide'));
    const dots = Array.from(carousel.querySelectorAll('.carousel-dot'));
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    let current = 0;
    let timer = null;

    const show = (index) => {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));
    };

    const startAutoplay = () => {
      clearInterval(timer);
      timer = setInterval(() => show(current + 1), 6000);
    };

    if (prevBtn) prevBtn.addEventListener('click', () => { show(current - 1); startAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { show(current + 1); startAutoplay(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { show(i); startAutoplay(); }));

    show(0);
    startAutoplay();
  }

  const parallaxLayer = document.querySelector('.parallax-hero .parallax-layer');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (parallaxLayer && !prefersReducedMotion) {
    const heroSection = document.querySelector('.parallax-hero');
    let ticking = false;
    const updateParallax = () => {
      const rect = heroSection.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        parallaxLayer.style.transform = `translateY(${window.scrollY * 0.15}px)`;
      }
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
    updateParallax();
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
