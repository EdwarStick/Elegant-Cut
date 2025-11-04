const nav = document.querySelector("#nav");
const abrir = document.querySelector("#abrir");
const cerrar = document.querySelector("#cerrar");
const body = document.body;
const navLinks = document.querySelectorAll('.nav-link');

// Abrir menú
abrir.addEventListener("click", () => {
    nav.classList.add("visible");
    body.classList.add("menu-open");
});

// Cerrar menú
cerrar.addEventListener("click", () => {
    nav.classList.remove("visible");
    body.classList.remove("menu-open");
});

// Cerrar menú al hacer clic en un enlace
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove("visible");
        body.classList.remove("menu-open");
    });
});

// Cerrar menú al hacer clic fuera de él
document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !abrir.contains(e.target) && nav.classList.contains('visible')) {
        nav.classList.remove("visible");
        body.classList.remove("menu-open");
    }
});

// Cerrar menú con la tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('visible')) {
        nav.classList.remove("visible");
        body.classList.remove("menu-open");
    }
});