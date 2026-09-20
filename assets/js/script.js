/* ==========================================================================
   HANEXA - CORE JAVASCRIPT & INTERACTIONS
   GSAP Animations, Smooth Interactions, Form Logic, and State
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Scroll Progress Bar & Sticky Header
  const progressBar = document.getElementById("scroll-progress");
  const header = document.getElementById("main-header");
  const backToTopBtn = document.getElementById("back-to-top");

  function updateScrollState() {
    const scrollY = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (header) {
      if (scrollY > 40) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    if (backToTopBtn) {
      if (scrollY > 450) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    }
  }

  window.addEventListener("scroll", updateScrollState, { passive: true });
  updateScrollState();

  // 2. Back to Top Button
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // 3. Mobile Navigation Drawer
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const mobileDrawer = document.getElementById("mobile-drawer");
  const mobileLinks = document.querySelectorAll(".mobile-nav-links a");

  function toggleMobileMenu() {
    const isActive = hamburgerBtn.classList.toggle("active");
    mobileDrawer.classList.toggle("active", isActive);
    document.body.style.overflow = isActive ? "hidden" : "";
  }

  function closeMobileMenu() {
    if (hamburgerBtn.classList.contains("active")) {
      hamburgerBtn.classList.remove("active");
      mobileDrawer.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener("click", toggleMobileMenu);

    const mobileCloseBtn = document.getElementById("mobile-drawer-close");
    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener("click", closeMobileMenu);
    }

    mobileLinks.forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMobileMenu();
    });
  }

  // 4. Smooth Anchor Scrolling & Active Link Highlighting
  const navAnchorLinks = document.querySelectorAll('a[href^="#"]');
  navAnchorLinks.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  // Active navigation highlight on scroll
  const sections = document.querySelectorAll("section[id]");
  const desktopNavLinks = document.querySelectorAll(".nav-links a");

  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        desktopNavLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", highlightNavOnScroll, { passive: true });

  // 5. Services Category Filter Tabs
  const filterBtns = document.querySelectorAll(".service-tab-btn");
  const serviceCards = document.querySelectorAll(".service-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      serviceCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filterValue === "all" || category === filterValue) {
          card.style.display = "flex";
          if (typeof gsap !== "undefined") {
            gsap.fromTo(
              card,
              { opacity: 0, y: 15 },
              { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
            );
          } else {
            card.style.opacity = "1";
          }
        } else {
          card.style.display = "none";
        }
      });

      // Refresh ScrollTrigger calculations after grid size changes
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }
    });
  });

  // 6. FAQ Accordion
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-button");
    button.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close all other items for clean accordion UX
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove("active");
          const otherBtn = other.querySelector(".faq-button");
          if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove("active");
        button.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("active");
        button.setAttribute("aria-expanded", "true");
      }

      if (typeof ScrollTrigger !== "undefined") {
        setTimeout(() => ScrollTrigger.refresh(), 400);
      }
    });
  });

  // 7. Interactive WhatsApp Quick Inquiry Form
  const inquiryForm = document.getElementById("hanexa-inquiry-form");
  if (inquiryForm) {
    inquiryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const serviceType = document.getElementById("project-type").value;
      const clientName = document.getElementById("client-name").value.trim();
      const projectDetails = document.getElementById("project-details").value.trim();

      const messageText = `Hi Hanexa, my name is ${clientName}. I am looking for ${serviceType}. Project details: ${projectDetails}`;
      const encodedMsg = encodeURIComponent(messageText);
      const whatsappUrl = `https://wa.me/917006505391?text=${encodedMsg}`;

      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    });
  }

  // 8. GSAP ScrollTrigger Animations
  if (typeof gsap !== "undefined") {
    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      // Hero Elements Stagger Reveal
      gsap.from(".hero-pill, .hero-title, .hero-description, .hero-cta-group, .hero-badges-row", {
        opacity: 0,
        y: 35,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
      });

      gsap.from(".hero-visual-wrapper", {
        opacity: 0,
        scale: 0.92,
        duration: 1.1,
        ease: "power3.out",
        delay: 0.3,
      });

      // Section Titles Reveal
      gsap.utils.toArray(".section-header").forEach((headerEl) => {
        gsap.from(headerEl, {
          scrollTrigger: {
            trigger: headerEl,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power2.out",
        });
      });

      // Process Cards Stagger Reveal
      gsap.utils.toArray(".process-card").forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 30,
          duration: 0.6,
          delay: (index % 3) * 0.12,
          ease: "power2.out",
        });
      });

      // Why Hanexa Cards Reveal
      gsap.utils.toArray(".why-card").forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 25,
          duration: 0.55,
          delay: (index % 3) * 0.1,
          ease: "power2.out",
        });
      });

      // Scoping / Pricing Card
      const scopingCard = document.querySelector(".scoping-card");
      if (scopingCard) {
        gsap.from(scopingCard, {
          scrollTrigger: {
            trigger: scopingCard,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power2.out",
        });
      }

      // Contact Box
      const contactBox = document.querySelector(".contact-card-box");
      if (contactBox) {
        gsap.from(contactBox, {
          scrollTrigger: {
            trigger: contactBox,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power2.out",
        });
      }
    }
  }
});
