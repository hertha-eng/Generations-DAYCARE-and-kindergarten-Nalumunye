const whatsappNumber = "256753557140";
const whatsappMessage = encodeURIComponent(
  "Hello Generations Daycare and Kindergarten, I would like to ask about admissions and school visits."
);

document.querySelectorAll(".js-whatsapp-link").forEach((link) => {
  link.href = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
});

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const siteHeader = document.querySelector(".site-header");

if (navToggle && navLinks) {
  const mobileNavBreakpoint = window.matchMedia("(max-width: 980px)");

  const setNavOpen = (isOpen) => {
    navLinks.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen && mobileNavBreakpoint.matches);
  };

  navToggle.addEventListener("click", () => {
    setNavOpen(!navLinks.classList.contains("is-open"));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setNavOpen(false);
    });
  });

  document.addEventListener("click", (event) => {
    if (!mobileNavBreakpoint.matches || !navLinks.classList.contains("is-open")) {
      return;
    }

    if (!navToggle.contains(event.target) && !navLinks.contains(event.target)) {
      setNavOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navLinks.classList.contains("is-open")) {
      setNavOpen(false);
      navToggle.focus();
    }
  });

  mobileNavBreakpoint.addEventListener("change", (event) => {
    if (!event.matches) {
      setNavOpen(false);
    }
  });
}

if (siteHeader) {
  const mobileHeaderBreakpoint = window.matchMedia("(max-width: 980px)");
  let lastScrollY = window.scrollY;
  let ticking = false;

  const syncHeaderVisibility = () => {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;
    const navIsOpen = Boolean(navLinks && navLinks.classList.contains("is-open"));

    if (!mobileHeaderBreakpoint.matches || navIsOpen || currentScrollY <= 24) {
      siteHeader.classList.remove("is-hidden");
    } else if (scrollDelta > 6 && currentScrollY > 120) {
      siteHeader.classList.add("is-hidden");
    } else if (scrollDelta < -6) {
      siteHeader.classList.remove("is-hidden");
    }

    lastScrollY = currentScrollY;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(syncHeaderVisibility);
        ticking = true;
      }
    },
    { passive: true }
  );

  mobileHeaderBreakpoint.addEventListener("change", () => {
    siteHeader.classList.remove("is-hidden");
    lastScrollY = window.scrollY;
  });
}

const page = document.body.dataset.page;
document.querySelectorAll(".nav-links a[data-page]").forEach((link) => {
  if (link.dataset.page === page) {
    link.classList.add("is-active");
    link.setAttribute("aria-current", "page");
  }
});

const pageToFooterHrefs = {
  home: ["index.html"],
  about: ["about.html"],
  programs: ["program.html"],
  admissions: ["admissions.html"],
  gallery: ["gallery.html"],
  contact: ["contacts.html"],
  privacy: ["privacy.html"],
  terms: ["terms.html"],
};

const activeFooterHrefs = pageToFooterHrefs[page] || [];
document.querySelectorAll(".footer a[href]").forEach((link) => {
  const href = link.getAttribute("href");
  if (href && activeFooterHrefs.includes(href)) {
    link.classList.add("is-active");
    link.setAttribute("aria-current", "page");
  }
});

document.querySelectorAll("form[data-formspree-form]").forEach((form) => {
  const status = form.querySelector("[data-form-status]");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      if (status) {
        status.textContent = "Please complete the required fields before sending.";
        status.className = "form-status is-error";
      }
      return;
    }

    if (status) {
      status.textContent = "Sending your message...";
      status.className = "form-status";
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.textContent : "";

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    try {
      const response = await fetch(form.action, {
        method: form.method || "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      form.reset();

      if (status) {
        status.textContent =
          form.dataset.successMessage ||
          "Your form has been sent successfully.";
        status.className = "form-status is-success";
      }
    } catch (error) {
      if (status) {
        status.textContent =
          "We could not send your form right now. Please try again in a moment.";
        status.className = "form-status is-error";
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll("[data-reveal]").forEach((element) => {
  element.classList.add("reveal");
  revealObserver.observe(element);
});
