
// Selección de botones y contenido
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

// Función para activar sección
function activateTab(tabId) {
    // Quitar estado activo
    tabButtons.forEach(btn => btn.classList.remove("active"));
    tabContents.forEach(content => content.classList.remove("active"));

    // Activar botón presionado
    document.querySelector(`[data-tab="${tabId}"]`).classList.add("active");

    // Activar contenido correspondiente
    document.getElementById(tabId).classList.add("active");
}

// Eventos de click
tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-tab");
        activateTab(tab);
    });
});

// Activar la primera pestaña por defecto
activateTab("peticiones");