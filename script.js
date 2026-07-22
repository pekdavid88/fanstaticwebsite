/* FanStaticWeb — Hero + Header interactions */
(function () {
  "use strict";

  const header = document.getElementById("site-header");

  // Scroll shadow a headeren - Forced Reflow mentes megoldás
  if (header) {
    let ticking = false;

    const updateHeader = () => {
      if (window.scrollY > 8) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
      ticking = false;
    };

    // A befejeződő DOM kirenderelés UTÁN hívjuk meg először (így nincs kényszerített újraszámítás!)
    requestAnimationFrame(updateHeader);

    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  }

  // Mobile menu toggle
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");

  if (toggle && menu) {
    const setOpen = (open) => {
      document.body.classList.toggle("menu-open", open);
      document.body.style.overflow = open ? "hidden" : "";
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.setAttribute("aria-hidden", String(!open));
    };

    toggle.addEventListener("click", () => {
      setOpen(!document.body.classList.contains("menu-open"));
    });

    // Close menu on link click
    menu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => setOpen(false));
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
        setOpen(false);
      }
    });
  }

  // Rotating headline
  const words = document.querySelectorAll(".rotator-word:not(.rotator-ghost)");
  if (words.length) {
    let i = 0;
    setInterval(() => {
      words[i].classList.remove("active");
      words[i].classList.add("leaving");
      const next = (i + 1) % words.length;
      words[next].classList.remove("leaving");
      words[next].classList.add("active");
      const prev = i;
      i = next;
      setTimeout(() => {
        words[prev].classList.remove("leaving");
      }, 800);
    }, 2200);
  }

  // Footer year
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }
})();


// Formspree űrlap + csomagválasztó
// Dynamic Package Selection from Pricing Section
document.addEventListener('DOMContentLoaded', () => {
  const pricingButtons = document.querySelectorAll('.pricing-cta');
  const packageSelect = document.getElementById('package-select');

  pricingButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      // Find package title from the card
      const card = button.closest('.pricing-card');
      if (card) {
        const titleElement = card.querySelector('.pricing-title');
        if (titleElement) {
          const packageName = titleElement.textContent.trim().toLowerCase();
          
          // Match with select option values
          if (packageSelect) {
            if (packageName.includes('starter')) packageSelect.value = 'starter';
            if (packageName.includes('business')) packageSelect.value = 'business';
            if (packageName.includes('ultimate')) packageSelect.value = 'ultimate';
          }
        }
      }
    });
  });
});

//Netlify űrlap + modal
// Netlify Form AJAX Submission & Success Modal Handler
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  const successModal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Gomb állapotának frissítése küldés közben
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
      submitBtn.innerHTML = '<span>Sending...</span>';

      const formData = new FormData(contactForm);

      // Netlify AJAX fetch hívás
      fetch('/', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
      })
      .then((response) => {
        if (response.ok) {
          // Sikeres küldés: űrlap ürítése és modal megjelenítése
          contactForm.reset();
          openModal();
        } else {
          alert('Oops! There was a problem submitting your form. Please try again.');
        }
      })
      .catch((error) => {
        alert('Network error. Please check your connection and try again.');
      })
      .finally(() => {
        // Gomb alaphelyzetbe állítása
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.innerHTML = originalBtnText;
      });
    });
  }

  // Modal nyitása
  function openModal() {
    if (successModal) {
      successModal.classList.add('is-active');
      successModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Háttér görgetésének letiltása
    }
  }

  // Modal zárása
  function closeModal() {
    if (successModal) {
      successModal.classList.remove('is-active');
      successModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // Görgetés visszakapcsolása
    }
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  // Bezárás a háttérre (overlay) való kattintáskor
  if (successModal) {
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        closeModal();
      }
    });
  }

  // Bezárás ESC gombra
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && successModal && successModal.classList.contains('is-active')) {
      closeModal();
    }
  });
});

//Lágyan előtűnő szekciók
// Scroll Reveal Observer
document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('.fade-in-up');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px', // Akkor jelenik meg, mielőtt teljesen középre érne
      threshold: 0.15 // Az elem 15%-ának látszódnia kell
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Ha azt szeretnéd, hogy csak egyszer animáljon be, leiratkozunk róla:
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback régebbi böngészőkhöz
    revealElements.forEach(el => el.classList.add('is-visible'));
  }
});