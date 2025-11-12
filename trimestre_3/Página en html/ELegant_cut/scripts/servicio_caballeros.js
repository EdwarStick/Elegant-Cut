// Filtrado de categorías
    document.addEventListener('DOMContentLoaded', function() {
      const categoryButtons = document.querySelectorAll('.category-btn');
      const serviceCards = document.querySelectorAll('.service-card');
      
      categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
          // Remover clase active de todos los botones
          categoryButtons.forEach(btn => btn.classList.remove('active'));
          // Agregar clase active al botón clickeado
          this.classList.add('active');
          
          const category = this.getAttribute('data-category');
          
          // Mostrar/ocultar tarjetas según la categoría
          serviceCards.forEach(card => {
            if (category === 'todos' || card.getAttribute('data-category') === category) {
              card.style.display = 'block';
            } else {
              card.style.display = 'none';
            }
          });
        });
      });
      
      // Funcionalidad del carrito
      const cartToggle = document.getElementById('cartToggle');
      const cart = document.getElementById('cart');
      const closeCart = document.querySelector('.close-cart');
      const cartItems = document.querySelector('.cart-items');
      const cartTotal = document.getElementById('cartTotal');
      const cartCount = document.querySelector('.cart-count');
      const serviceButtons = document.querySelectorAll('.service-button');
      
      let cartData = [];
      
      // Abrir/cerrar carrito
      cartToggle.addEventListener('click', function() {
        cart.classList.add('open');
      });
      
      closeCart.addEventListener('click', function() {
        cart.classList.remove('open');
      });
      
      // Agregar servicio al carrito
      serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
          const service = this.getAttribute('data-service');
          const price = parseInt(this.getAttribute('data-price'));
          
          // Agregar servicio al carrito
          cartData.push({ service, price });
          
          // Actualizar carrito
          updateCart();
          
          // Mostrar carrito
          cart.classList.add('open');
        });
      });
      
      // Actualizar carrito
      function updateCart() {
        // Limpiar carrito
        cartItems.innerHTML = '';
        
        let total = 0;
        
        // Agregar items al carrito
        cartData.forEach((item, index) => {
          total += item.price;
          
          const cartItem = document.createElement('div');
          cartItem.className = 'cart-item';
          cartItem.innerHTML = `
            <div>
              <div>${item.service}</div>
              <div>$${item.price.toLocaleString()}</div>
            </div>
            <i class="bi bi-trash remove-item" data-index="${index}"></i>
          `;
          
          cartItems.appendChild(cartItem);
        });
        
        // Actualizar total y contador
        cartTotal.textContent = `$${total.toLocaleString()}`;
        cartCount.textContent = cartData.length;
        
        // Agregar event listeners a los botones de eliminar
        document.querySelectorAll('.remove-item').forEach(button => {
          button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            cartData.splice(index, 1);
            updateCart();
          });
        });
      }
    });