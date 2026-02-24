/* =============================================
   ELEGANT HEALTHCARE CENTRE — JAVASCRIPT
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ── Scroll Progress Bar ──────────────────────
  const progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  });

  // ── Navbar scroll effect ─────────────────────
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a[data-section]');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  });

  // ── Mobile Nav ───────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });

  // ── Smooth scroll for nav ────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── Scroll fade animations ───────────────────
  const observerOptions = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-up, .fade-in').forEach((el, i) => {
    if (!el.dataset.delay) el.dataset.delay = 0;
    observer.observe(el);
  });

  // Stagger service cards
  document.querySelectorAll('.service-card').forEach((card, i) => {
    card.classList.add('fade-up');
    card.dataset.delay = i * 60;
    observer.observe(card);
  });

  // Stagger contact cards
  document.querySelectorAll('.contact-card').forEach((card, i) => {
    card.classList.add('fade-up');
    card.dataset.delay = i * 80;
    observer.observe(card);
  });

  // ── Service book button → scroll to booking ──
  document.querySelectorAll('.service-book-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const service = btn.dataset.service;
      const select = document.getElementById('service');
      if (select && service) {
        select.value = service;
      }
      const bookingSection = document.getElementById('booking');
      const offset = 72;
      const top = bookingSection.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // Hero CTA scroll
  const heroCta = document.getElementById('hero-cta');
  if (heroCta) {
    heroCta.addEventListener('click', () => {
      document.querySelector('#booking').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // ── Booking Form Validation ──────────────────
  const bookingForm = document.getElementById('booking-form');
  const formSuccess = document.getElementById('form-success');
  const formAgain = document.getElementById('form-again');

  function showError(field, msg) {
    const group = field.closest('.form-group');
    group.classList.add('has-error');
    field.classList.add('error');
    const errEl = group.querySelector('.error-msg');
    if (errEl) errEl.textContent = msg;
  }

  function clearError(field) {
    const group = field.closest('.form-group');
    group.classList.remove('has-error');
    field.classList.remove('error');
  }

  function validatePhone(phone) {
    return /^[\d\s+()-]{7,15}$/.test(phone.trim());
  }

  if (bookingForm) {
    // Live validation
    bookingForm.querySelectorAll('input, select').forEach(field => {
      field.addEventListener('input', () => clearError(field));
      field.addEventListener('change', () => clearError(field));
    });

    bookingForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      const name = document.getElementById('name');
      const phone = document.getElementById('phone');
      const service = document.getElementById('service');
      const date = document.getElementById('date');

      // Name
      if (!name.value.trim() || name.value.trim().length < 2) {
        showError(name, 'Please enter your full name.');
        valid = false;
      }
      // Phone
      if (!phone.value.trim() || !validatePhone(phone.value)) {
        showError(phone, 'Please enter a valid phone number.');
        valid = false;
      }
      // Service
      if (!service.value) {
        showError(service, 'Please select a service.');
        valid = false;
      }
      // Date
      if (!date.value) {
        showError(date, 'Please select your preferred date.');
        valid = false;
      } else {
        const chosen = new Date(date.value);
        const today = new Date();
        today.setHours(0,0,0,0);
        if (chosen < today) {
          showError(date, 'Please select a future date.');
          valid = false;
        }
      }

      if (valid) {
        // Animate button
        const btn = bookingForm.querySelector('.submit-btn');
        btn.textContent = 'Sending...';
        btn.disabled = true;

        setTimeout(() => {
          bookingForm.style.display = 'none';
          formSuccess.classList.add('show');
        }, 900);
      }
    });
  }

  if (formAgain) {
    formAgain.addEventListener('click', () => {
      bookingForm.reset();
      bookingForm.style.display = 'block';
      formSuccess.classList.remove('show');
      const btn = bookingForm.querySelector('.submit-btn');
      btn.disabled = false;
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg><span>Confirm Booking</span>`;
    });
  }

  // ── Button ripple effect ─────────────────────
  document.querySelectorAll('.btn-primary, .submit-btn, .nav-cta').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position:absolute;
        width:${size}px;height:${size}px;
        border-radius:50%;
        background:rgba(255,255,255,0.25);
        transform:translate(-50%,-50%) scale(0);
        left:${e.clientX - rect.left}px;
        top:${e.clientY - rect.top}px;
        animation:rippleAnim 0.5s ease-out forwards;
        pointer-events:none;
      `;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Ripple keyframes (inject once)
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes rippleAnim {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // ── Set min date for booking ─────────────────
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  // ── Counter animation for hero stats ─────────
  function animateCounter(el, target, duration = 1500) {
    const start = performance.now();
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + (el.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.stat-num').forEach(stat => {
          const val = parseInt(stat.dataset.value);
          if (val) animateCounter(stat, val);
        });
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const statsBlock = document.querySelector('.hero-stats');
  if (statsBlock) statsObserver.observe(statsBlock);

});
