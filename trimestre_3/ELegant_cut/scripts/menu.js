const nav = document.querySelector("#nav");
const abrir = document.querySelector("#abrir");
const cerrar = document.querySelector("#cerrar");

// Abrir menú
abrir.addEventListener("click", () => {
    nav.classList.add("visible");
    document.body.style.overflow = "hidden"; // Prevenir scroll del body
});

// Cerrar menú
cerrar.addEventListener("click", () => {
    nav.classList.remove("visible");
    document.body.style.overflow = "auto"; // Restaurar scroll del body
});

// Cerrar menú al hacer clic fuera de él
nav.addEventListener("click", (e) => {
    if (e.target === nav) {
        nav.classList.remove("visible");
        document.body.style.overflow = "auto";
    }
});

// Cerrar menú con tecla Escape
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("visible")) {
        nav.classList.remove("visible");
        document.body.style.overflow = "auto";
    }
});