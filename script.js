'use strict';

const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Number(delay));
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach(el => revealObserver.observe(el));

const statNums = document.querySelectorAll('.stat-num');

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const step = 16;
  const steps = Math.ceil(duration / step);
  const increment = target / steps;
  let current = 0;
  let count = 0;

  const timer = setInterval(() => {
    count++;
    current = count >= steps ? target : Math.round(current + increment);
    el.textContent = current;
    if (count >= steps) clearInterval(timer);
  }, step);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

statNums.forEach(el => counterObserver.observe(el));

const track     = document.getElementById('testimonialTrack');
const dotsWrap  = document.getElementById('tDots');
const cards     = track ? track.querySelectorAll('.testimonial-card') : [];

let currentSlide  = 0;
let autoplayTimer = null;
const CARD_WIDTH  = 340 + 24; // card width + gap
const VISIBLE     = () => window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
const MAX_SLIDE   = () => Math.max(0, cards.length - VISIBLE());

// Build dots
if (dotsWrap && cards.length) {
  const dotCount = MAX_SLIDE() + 1;
  for (let i = 0; i <= MAX_SLIDE(); i++) {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  }
}

function updateDots() {
  if (!dotsWrap) return;
  dotsWrap.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
  });
}

function goTo(index) {
  currentSlide = Math.max(0, Math.min(index, MAX_SLIDE()));
  if (track) track.style.transform = `translateX(-${currentSlide * CARD_WIDTH}px)`;
  updateDots();
}

function nextSlide() {
  goTo(currentSlide >= MAX_SLIDE() ? 0 : currentSlide + 1);
}

function startAutoplay() {
  stopAutoplay();
  autoplayTimer = setInterval(nextSlide, 4000);
}

function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
}

if (track) {
  startAutoplay();
  track.addEventListener('mouseenter', stopAutoplay);
  track.addEventListener('mouseleave', startAutoplay);


  let touchStartX = 0;
  track.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : goTo(currentSlide - 1);
    startAutoplay();
  }, { passive: true });
}

window.addEventListener('resize', () => goTo(Math.min(currentSlide, MAX_SLIDE())));


const contactForm = document.getElementById('contactForm');
const formMsg     = document.getElementById('formMsg');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Validate required fields
    const fname   = contactForm.fname.value.trim();
    const lname   = contactForm.lname.value.trim();
    const email   = contactForm.email.value.trim();
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fname || !lname) {
      showMsg('Please enter your full name.', 'error');
      return;
    }
    if (!email || !emailRx.test(email)) {
      showMsg('Please enter a valid email address.', 'error');
      return;
    }


    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    await new Promise(resolve => setTimeout(resolve, 1400));

    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    contactForm.reset();
    showMsg('✓ Your enquiry has been sent! A GNN specialist will be in touch within 24 hours.', 'success');
  });
}

function showMsg(text, type) {
  if (!formMsg) return;
  formMsg.textContent = text;
  formMsg.className = 'form-msg ' + type;
  setTimeout(() => {
    formMsg.className = 'form-msg';
    formMsg.textContent = '';
  }, 6000);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const sections  = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(sec => sectionObserver.observe(sec));