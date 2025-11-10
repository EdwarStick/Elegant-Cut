<script>
  const botonesAgregar = document.querySelectorAll('.agregar-carrito');
  const listaCarrito = document.getElementById('lista-carrito');

  botonesAgregar.forEach(boton => {
    boton.addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      const nombre = card.querySelector('.card-title').textContent;
      const precio = card.querySelector('.card-text').textContent;

      // Crear el ítem en el carrito
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
      li.innerHTML = `${nombre} <span>${precio}</span>`;

      listaCarrito.appendChild(li);
    });
  });
</script>
