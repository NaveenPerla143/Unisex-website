/* ============================================
   VJ UNISEX FITNESS STUDIO — Interactive JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ============================================
  // Preloader
  // ============================================
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 1800);
  });
  // Fallback: hide after 3s even if load event issues
  setTimeout(() => {
    preloader.classList.add('hidden');
  }, 3000);

  // ============================================
  // Scrolling Effects (Navbar & Progress)
  // ============================================
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');
  const scrollProgress = document.getElementById('scroll-progress');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar background
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button
    if (scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Scroll progress bar
    if (scrollProgress) {
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (scrollY / height) * 100;
      scrollProgress.style.width = scrolled + '%';
    }

    lastScroll = scrollY;
  });

  // Back to top click
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ============================================
  // Mobile Navigation
  // ============================================
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const navOverlay = document.getElementById('nav-overlay');
  const allNavLinks = document.querySelectorAll('.nav-link');

  function openMenu() {
    navToggle.classList.add('active');
    navLinks.classList.add('open');
    navOverlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
    navOverlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navOverlay.addEventListener('click', closeMenu);

  // Close menu on nav link click
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close on CTA click
  const navCtaBtn = document.getElementById('nav-cta-btn');
  if (navCtaBtn) {
    navCtaBtn.addEventListener('click', closeMenu);
  }

  // ============================================
  // Smooth Scroll for All Anchor Links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // Active Navigation Link Highlight
  // ============================================
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        allNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  // ============================================
  // Counter Animation
  // ============================================
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;

    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easedProgress * target);

        counter.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      }

      requestAnimationFrame(updateCounter);
    });

    countersAnimated = true;
  }

  // Trigger counters when hero stats are visible
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          counterObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });

    counterObserver.observe(heroStats);
  }

  // ============================================
  // Scroll Reveal Animations
  // ============================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // ============================================
  // Highlight Today's Hours
  // ============================================
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const hoursItems = document.querySelectorAll('.hours-item');

  hoursItems.forEach(item => {
    const dayNum = parseInt(item.getAttribute('data-day'));
    if (dayNum === today) {
      item.classList.add('today');
    }
  });

  // ============================================
  // Contact Form Handling
  // ============================================
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      // Validate required fields
      if (!data.firstName || !data.phone) {
        shakeElement(document.getElementById('firstName'));
        return;
      }

      // Show loading state on button
      const submitBtn = document.getElementById('form-submit-btn');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.style.pointerEvents = 'none';

      // Simulate form submission (replace with actual backend)
      setTimeout(() => {
        contactForm.style.display = 'none';
        formSuccess.classList.add('show');

        // Construct WhatsApp message
        const whatsappMsg = `Hi VJ Fitness! My name is ${data.firstName}${data.lastName ? ' ' + data.lastName : ''}. Phone: ${data.phone}. ${data.interest ? 'Interested in: ' + data.interest + '.' : ''} ${data.message ? 'Message: ' + data.message : ''}`;
        
        // Open WhatsApp with the message after a delay
        setTimeout(() => {
          const whatsappUrl = `https://wa.me/917904566917?text=${encodeURIComponent(whatsappMsg)}`;
          window.open(whatsappUrl, '_blank');
        }, 2000);

      }, 1500);
    });
  }

  function shakeElement(el) {
    if (!el) return;
    el.style.borderColor = '#ff4444';
    el.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
      el.style.borderColor = '';
      el.style.animation = '';
    }, 500);
  }

  // Add shake keyframe dynamically
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      60% { transform: translateX(-4px); }
      80% { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(shakeStyle);

  // ============================================
  // FAQ Accordion
  // ============================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const icon = otherItem.querySelector('.faq-icon');
        if (icon) icon.textContent = '+';
      });

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
        const icon = item.querySelector('.faq-icon');
        if (icon) icon.textContent = '×';
      }
    });
  });

  // ============================================
  // Program Cards Click (scroll to contact)
  // ============================================
  const programCards = document.querySelectorAll('.program-card');
  programCards.forEach(card => {
    card.addEventListener('click', () => {
      const contactSection = document.getElementById('contact');
      const navHeight = navbar.offsetHeight;
      const targetPosition = contactSection.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Auto-select the relevant program in the form
      const title = card.querySelector('h3').textContent.toLowerCase();
      const interestSelect = document.getElementById('interest');
      if (interestSelect) {
        if (title.includes('strength')) interestSelect.value = 'strength';
        else if (title.includes('cardio')) interestSelect.value = 'cardio';
        else if (title.includes('personal')) interestSelect.value = 'personal';
      }
    });
  });

  // ============================================
  // Pricing Cards Click (scroll to contact)
  // ============================================
  const pricingBtns = document.querySelectorAll('.pricing-btn');
  pricingBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // The href already points to #contact, smooth scroll handles it
    });
  });

  // ============================================
  // Contact Info Items — Clickable Actions
  // ============================================
  const contactPhone = document.getElementById('contact-phone');
  if (contactPhone) {
    contactPhone.addEventListener('click', (e) => {
      // The href handles it natively (tel:)
    });
  }

  // ============================================
  // Parallax-lite for Hero on Scroll
  // ============================================
  const heroBg = document.querySelector('.hero-bg img');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrollY * 0.3}px) scale(1.05)`;
      }
    });
  }

  // ============================================
  // Trainer Card Tilt Effect
  // ============================================
  const trainerCards = document.querySelectorAll('.trainer-card');
  trainerCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // ============================================
  // Keyboard Accessibility — Escape closes menu
  // ============================================
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  // ============================================
  // Image Lazy Loading Fallback
  // ============================================
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
  } else {
    // Simple intersection observer fallback
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.src;
          imageObserver.unobserve(img);
        }
      });
    });
    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // ============================================
  // Console Branding
  // ============================================
  console.log(
    '%c💪 VJ UNISEX FITNESS STUDIO %c\nTransform Your Body & Mind\nwww.vjfitness.in',
    'color: #FF6B2C; font-size: 20px; font-weight: bold;',
    'color: #888; font-size: 12px;'
  );
});
