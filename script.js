// Where contact form submissions go.
// Default: opens the visitor's email app addressed to you. Nothing is stored
// by this website.
// To receive submissions directly, create a form at https://formspree.io and
// paste its endpoint (e.g. "https://formspree.io/f/abcdwxyz") below. If you do,
// keep the Formspree entry in privacy.html.
const CONTACT_EMAIL = "chris@ctrdigi.com";
const FORM_ENDPOINT = "";

document.getElementById("year").textContent = new Date().getFullYear();

// Mobile menu
const toggle = document.getElementById("nav-toggle");
const links = document.getElementById("nav-links");
const setMenu = (open, returnFocus) => {
  links.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.textContent = open ? "Close" : "Menu";
  if (!open && returnFocus) toggle.focus();
};
toggle.addEventListener("click", () => setMenu(!links.classList.contains("open")));
links.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && links.classList.contains("open")) setMenu(false, true);
});

// Marquee pause control (WCAG 2.2.2: moving content must be pausable)
const marquee = document.getElementById("marquee");
const marqueeToggle = document.getElementById("marquee-toggle");
marqueeToggle.addEventListener("click", () => {
  const paused = marquee.classList.toggle("paused");
  marqueeToggle.setAttribute("aria-pressed", String(paused));
  marqueeToggle.textContent = paused ? "Play animation" : "Pause animation";
});

// Reveal-on-scroll (added by JS so content stays visible if JS fails)
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const targets = document.querySelectorAll(".tile, .timeline li, .price-row, .faq details, .big-statement");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  targets.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    io.observe(el);
  });
}

// Contact form
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

const messages = {
  name: "Please enter your name.",
  email: "Please enter a valid email address, like name@example.com.",
  message: "Please tell us a little about your project.",
  consent: "Please tick this box so we can reply to you.",
};

const validateField = (field) => {
  const ok = field.type === "checkbox" ? field.checked : field.value.trim() !== "" && field.checkValidity();
  const err = document.getElementById(`${field.id}-err`);
  field.setAttribute("aria-invalid", String(!ok));
  if (err) err.textContent = ok ? "" : messages[field.name];
  return ok;
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.className = "form-status";
  status.textContent = "";

  const required = [...form.querySelectorAll("[required]")];
  const invalid = required.filter((field) => !validateField(field));
  if (invalid.length) {
    status.className = "form-status err";
    status.textContent = `Please fix ${invalid.length === 1 ? "1 field" : `${invalid.length} fields`} above.`;
    invalid[0].focus();
    return;
  }

  const data = new FormData(form);
  const interest = data.get("interest") || "Not specified";

  if (FORM_ENDPOINT) {
    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    button.textContent = "Sending…";
    try {
      const res = await fetch(FORM_ENDPOINT, { method: "POST", headers: { Accept: "application/json" }, body: data });
      if (!res.ok) throw new Error(res.statusText);
      form.reset();
      required.forEach((f) => f.removeAttribute("aria-invalid"));
      status.className = "form-status ok";
      status.textContent = "Thanks, your message has been sent.";
    } catch {
      status.className = "form-status err";
      status.textContent = `Sorry, something went wrong. Please email ${CONTACT_EMAIL}.`;
    } finally {
      button.disabled = false;
      button.textContent = "Send message";
    }
    return;
  }

  const subject = `Project enquiry: ${interest} (${data.get("name")})`;
  const body = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nNeed: ${interest}\nBest time for a call: ${data.get("time") || "Not specified"}\n\n${data.get("message")}`;
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  status.className = "form-status ok";
  status.textContent = "Opening your email app. Press send there to deliver your message.";
});

// Clear an error as soon as the visitor fixes the field
form.addEventListener("input", (e) => {
  if (e.target.getAttribute("aria-invalid") === "true") validateField(e.target);
});
form.addEventListener("change", (e) => {
  if (e.target.type === "checkbox" && e.target.getAttribute("aria-invalid") === "true") validateField(e.target);
});
