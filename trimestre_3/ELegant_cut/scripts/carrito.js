/*Carrito*/
// === Icono y carrito desplegable ===
const cartIcon = document.getElementById('cart-icon');
const cart = document.getElementById('cart');
const cartCount = document.getElementById('cart-count');
const cartItemsList = document.getElementById('cart-items');
const totalPrice = document.getElementById('total-price');

let cartItems = [];
let total = 0;

// Mostrar / ocultar carrito al hacer clic
cartIcon.addEventListener('click', () => {
  cart.classList.toggle('active');
});

// Cerrar carrito al hacer clic fuera
document.addEventListener('click', (e) => {
  if (!cart.contains(e.target) && !cartIcon.contains(e.target)) {
    cart.classList.remove('active');
  }
});

// Agregar productos al carrito
document.querySelectorAll('.add-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    const name = card.dataset.name;
    const price = parseInt(card.dataset.price);

    cartItems.push({ name, price });
    total += price;
    actualizarCarrito();
  });
});

function actualizarCarrito() {
  cartItemsList.innerHTML = '';

  cartItems.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - $${item.price.toLocaleString()}`;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '✕';
    removeBtn.classList.add('remove-btn');
    removeBtn.addEventListener('click', () => {
      total -= item.price;
      cartItems.splice(index, 1);
      actualizarCarrito();
    });

    li.appendChild(removeBtn);
    cartItemsList.appendChild(li);
  });

  totalPrice.textContent = `$${total.toLocaleString()}`;
  cartCount.textContent = cartItems.length;
}
//Desplazamiento de secciones de productos
  document.querySelectorAll('.category-menu button').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = document.getElementById(btn.dataset.target);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });