const CONTACT_EMAIL = "abolanlemicky@gmail.com";

const root = document.documentElement;
const themeBtn = document.getElementById("theme-toggle");
const menuBtn = document.getElementById("menu-btn");
const drawer = document.getElementById("mobile-drawer");
const overlay = document.getElementById("overlay");
const year = document.getElementById("year");
const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");
const navLinks = document.querySelectorAll(".nav-links a, .mobile-drawer a");

function preferredTheme() {
  const saved = localStorage.getItem("theme");
  if (saved) return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("theme", theme);
  themeBtn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
}

setTheme(preferredTheme());
year.textContent = new Date().getFullYear();

themeBtn.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

function closeMenu() {
  drawer.classList.remove("open");
  overlay.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

function openMenu() {
  drawer.classList.add("open");
  overlay.classList.add("open");
  menuBtn.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

menuBtn.addEventListener("click", () => {
  drawer.classList.contains("open") ? closeMenu() : openMenu();
});
overlay.addEventListener("click", closeMenu);

navLinks.forEach((link) => {
  link.addEventListener("click", () => closeMenu());
});

const sections = [...document.querySelectorAll("main section[id]")];
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll(".nav-links a").forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-40% 0px -50% 0px" }
);
sections.forEach((section) => observer.observe(section));

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const name = data.name.trim();
  const email = data.email.trim();
  const subject = data.subject.trim();
  const message = data.message.trim();

  if (!name || !email || !subject || !message) {
    statusEl.textContent = "Please fill in every field.";
    statusEl.className = "form-status error";
    return;
  }
  if (!validEmail(email)) {
    statusEl.textContent = "Please enter a valid email address.";
    statusEl.className = "form-status error";
    return;
  }
  if (message.length < 12) {
    statusEl.textContent = "Please write a slightly longer message.";
    statusEl.className = "form-status error";
    return;
  }

  const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
  form.reset();
  statusEl.textContent = "Your email app should open now. If it does not, write to " + CONTACT_EMAIL + ".";
  statusEl.className = "form-status success";
});
