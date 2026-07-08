const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

function setActiveNav(sectionId) {
  navAnchors.forEach((anchor) => {
    anchor.classList.toggle('active', anchor.getAttribute('href') === `#${sectionId}`);
  });
}

if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveNav(entry.target.getAttribute('id'));
      }
    });
  }, {
    rootMargin: '-35% 0px -55% 0px',
    threshold: 0
  });

  sections.forEach((section) => navObserver.observe(section));
} else {
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        let current = 'home';

        sections.forEach((section) => {
          const sectionTop = section.offsetTop - 150;
          if (window.scrollY >= sectionTop) current = section.getAttribute('id');
        });

        setActiveNav(current);
        ticking = false;
      });

      ticking = true;
    }
  }, { passive: true });
}

const emailToast = document.getElementById('emailToast');
const emailLinks = document.querySelectorAll('[data-email-link]');
let emailToastTimer;

function showEmailToast(message) {
  if (!emailToast) return;

  emailToast.textContent = message;
  emailToast.classList.add('show');
  clearTimeout(emailToastTimer);
  emailToastTimer = setTimeout(() => {
    emailToast.classList.remove('show');
  }, 2600);
}

emailLinks.forEach((link) => {
  link.addEventListener('click', async () => {
    const email = link.dataset.email || 'Arthp2002@gmail.com';

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
        showEmailToast(`Email copied: ${email}`);
      } else {
        showEmailToast(`Email: ${email}`);
      }
    } catch (error) {
      showEmailToast(`Email: ${email}`);
    }
  });
});
