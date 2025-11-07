// Bloquear fecha anterior
document.getElementById("fecha").min = new Date().toISOString().split("T")[0];

// Elementos
const pago = document.getElementById("pago");
const nequi = document.getElementById("nequi-info");
const tarjeta = document.getElementById("tarjeta-card");
const card = document.getElementById("card-flip");

// Cambio según tipo de pago
pago.addEventListener("change", () => {
  nequi.classList.add("hidden");
  tarjeta.classList.add("hidden");
  card.classList.remove("flip");

  if (pago.value === "nequi") nequi.classList.remove("hidden");
  if (pago.value === "tarjeta") tarjeta.classList.remove("hidden");
});

// Voltear tarjeta tocándola
tarjeta.addEventListener("click", () => card.classList.toggle("flip"));
