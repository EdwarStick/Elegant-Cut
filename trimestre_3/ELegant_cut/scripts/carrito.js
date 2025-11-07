//Carrito
document.addEventListener("DOMContentLoaded", () => {
  const cartToggle = document.getElementById("cartToggle");
  const cart = document.getElementById("cart");
  const closeCart = document.querySelector(".close-cart");
  const cartItemsContainer = document.querySelector(".cart-items");
  const cartTotal = document.getElementById("cartTotal");
  const cartCount = document.querySelector(".cart-count");
  const addButtons = document.querySelectorAll(".add-btn");

  let cartItems = [];

  // Mostrar / Ocultar Carrito
  cartToggle.addEventListener("click", () => {
    cart.classList.toggle("open");
  });

  closeCart.addEventListener("click", () => {
    cart.classList.remove("open");
  });

  // Agregar producto al carrito
  addButtons.forEach(button => {
    button.addEventListener("click", e => {
      const card = e.target.closest(".product-card");
      const name = card.dataset.name;
      const price = parseInt(card.dataset.price);

      const existing = cartItems.find(item => item.name === name);

      if (existing) {
        existing.quantity++;
      } else {
        cartItems.push({ name, price, quantity: 1 });
      }

      updateCart();
    });
  });

  // Actualizar carrito
  function updateCart() {
    cartItemsContainer.innerHTML = "";

    let total = 0;
    let count = 0;

    cartItems.forEach(item => {
      total += item.price * item.quantity;
      count += item.quantity;

      const itemDiv = document.createElement("div");
      itemDiv.classList.add("cart-item");

      itemDiv.innerHTML = `
        <span>${item.name}</span>
        <span>$${item.price}</span>
        <span>x${item.quantity}</span>
        <i class="bi bi-trash remove-btn"></i>
      `;

      itemDiv.querySelector(".remove-btn").addEventListener("click", () => {
        removeItem(item.name);
      });

      cartItemsContainer.appendChild(itemDiv);
    });

    cartTotal.textContent = `$${total}`;
    cartCount.textContent = count;
  }

  // Eliminar producto del carrito
  function removeItem(name) {
    const index = cartItems.findIndex(item => item.name === name);

    if (index !== -1) {
      if (cartItems[index].quantity > 1) {
        cartItems[index].quantity--;
      } else {
        cartItems.splice(index, 1);
      }
    }

    updateCart();
  }
});

// Categorías
document.querySelectorAll(".category-menu button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".category-menu button")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const category = btn.dataset.category;
    document.querySelectorAll(".product-card").forEach((card) => {
      card.style.display =
        card.dataset.category === category ? "block" : "none";
    });
  });
});