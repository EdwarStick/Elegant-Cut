import React, { useState } from "react";
import { Link } from "react-router-dom";

function Servicios_caballero() {
  const [activeCategory, setActiveCategory] = useState("todos");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const servicesData = [
    {
      id: 1,
      name: "Buzz Cut",
      price: 25000,
      category: "cortes",
      image: "/assets/images/servicios_caballeros/cortes/buzzz cut.png",
      description: "Un corte limpio, rápido y versátil. Ideal para quienes buscan un look moderno y sin complicaciones.",
      features: ["Máquina", "45 min"],
      categoryLabel: "Corte"
    },
    {
      id: 2,
      name: "Corte Militar (Bascot)",
      price: 28000,
      category: "cortes",
      image: "/assets/images/servicios_caballeros/cortes/Corte Militar (Bascot).png",
      description: "Estilo clásico y disciplinado, con laterales muy cortos y parte superior ligeramente más larga.",
      features: ["Tijera/Máquina", "45 min"],
      categoryLabel: "Corte"
    },
    {
      id: 3,
      name: "Mullet",
      price: 35000,
      category: "cortes",
      image: "/assets/images/servicios_caballeros/cortes/Mullet.png",
      description: "Un estilo audaz y retro, corto adelante y largo atrás. Para quienes quieren destacar.",
      features: ["Estilo", "60 min"],
      categoryLabel: "Corte"
    },
    {
      id: 4,
      name: "Slick Back",
      price: 32000,
      category: "cortes",
      image: "/assets/images/servicios_caballeros/cortes/Slick Back.png",
      description: "Elegancia pura. Cabello peinado hacia atrás con un acabado pulido y sofisticado.",
      features: ["Clásico", "50 min"],
      categoryLabel: "Corte"
    },
    {
      id: 5,
      name: "Corte con Figuras",
      price: 40000,
      category: "cortes",
      image: "/assets/images/servicios_caballeros/cortes/corte con figuras.png",
      description: "Arte en tu cabello. Diseños personalizados y creativos para un look único.",
      features: ["Diseño", "60+ min"],
      categoryLabel: "Corte"
    },
    {
      id: 6,
      name: "Crop Top",
      price: 30000,
      category: "cortes",
      image: "/assets/images/servicios_caballeros/cortes/crop top.png",
      description: "Texturizado en la parte superior con flequillo corto. Moderno y fácil de peinar.",
      features: ["Textura", "50 min"],
      categoryLabel: "Corte"
    },
    {
      id: 7,
      name: "Low Fade",
      price: 30000,
      category: "cortes",
      image: "/assets/images/servicios_caballeros/cortes/low fade.png",
      description: "Degradado suave y bajo que conecta perfectamente con la barba o patillas.",
      features: ["Degradado", "50 min"],
      categoryLabel: "Corte"
    },
    {
      id: 8,
      name: "Undercut",
      price: 32000,
      category: "cortes",
      image: "/assets/images/servicios_caballeros/cortes/undercut.png",
      description: "Contraste marcado entre laterales rapados y volumen superior. Versátil y actual.",
      features: ["Contraste", "50 min"],
      categoryLabel: "Corte"
    }
  ];

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const addToCart = (service) => {
    setCart([...cart, service]);
    setIsCartOpen(true); // Open cart when adding item
  };

  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const filteredServices = activeCategory === "todos"
    ? servicesData
    : servicesData.filter(service => service.category === activeCategory);

  return (
    <div>
      <main>
        <div className={`menu-overlay ${isCartOpen ? 'active' : ''}`} id="overlay" onClick={() => setIsCartOpen(false)}></div>

        {/* CARRUSEL */}
        <div className="carousel-container">
          <div
            id="carouselAuto"
            className="carousel slide"
            data-bs-ride="carousel"
            data-bs-interval="3000"
          >
            <div className="carousel-inner">
              {/* Imagen 1 */}
              <div className="carousel-item active">
                <img
                  src="/assets/images/servicios_caballeros/carrusel/barberia.png"
                  className="d-block w-100"
                  alt="Barbería ElegantCut"
                />
                <div className="carousel-caption d-none d-md-block">
                  <h3>ESTILO Y TRADICIÓN</h3>
                  <p>
                    Descubre la experiencia de barbería que combina técnicas
                    clásicas con tendencias modernas
                  </p>
                </div>
              </div>

              {/* Imagen 2 */}
              <div className="carousel-item">
                <img
                  src="/assets/images/servicios_caballeros/carrusel/servicios_general.png"
                  className="d-block w-100"
                  alt="Nuestros Servicios"
                />
                <div className="carousel-caption d-none d-md-block">
                  <h3>SERVICIOS PREMIUM</h3>
                  <p>
                    Cortes, barbas y tratamientos especializados para el
                    caballero moderno
                  </p>
                </div>
              </div>

              {/* Imagen 3 */}
              <div className="carousel-item">
                <img
                  src="/assets/images/servicios_caballeros/carrusel/varios.png"
                  className="d-block w-100"
                  alt="Ambiente ElegantCut"
                />
                <div className="carousel-caption d-none d-md-block">
                  <h3>AMBIENTE ÚNICO</h3>
                  <p>
                    Disfruta de un espacio diseñado para tu comodidad y
                    relajación
                  </p>
                </div>
              </div>
            </div>

            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselAuto"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Anterior</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselAuto"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Siguiente</span>
            </button>
          </div>
        </div>

        {/* FILTRO DE DAMA Y CABALLERO */}
        <div className="seleccion-genero">
          <h2>Selecciona el tipo de servicios</h2>
          <div className="botones-genero">
            <Link to="/servicios_dama" className="btn-dama">
              Damas
            </Link>
            <Link to="/servicios_caballero" className="btn-caballero">
              Caballeros
            </Link>
          </div>
        </div>

        {/* Filtros de categorías */}
        <div className="category-menu">
          <button
            className={`category-btn ${activeCategory === 'todos' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('todos')}
          >
            Todos los Servicios
          </button>
          <button
            className={`category-btn ${activeCategory === 'cortes' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('cortes')}
          >
            Cortes de Cabello
          </button>
          <button
            className={`category-btn ${activeCategory === 'barba' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('barba')}
          >
            Barba y Afeitado
          </button>
          <button
            className={`category-btn ${activeCategory === 'otros' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('otros')}
          >
            Tratamientos Especiales
          </button>
        </div>

        {/* Área de servicios */}
        <h2 className="section-title">NUESTROS SERVICIOS</h2>

        <div className="services-grid">
          {filteredServices.map((service) => (
            <div key={service.id} className="service-card" data-category={service.category}>
              <div className="category-indicator">{service.categoryLabel}</div>
              <img
                src={service.image}
                alt={service.name}
                className="service-image"
              />
              <div className="service-content">
                <h3 className="service-title">{service.name}</h3>
                <div className="service-price">${service.price.toLocaleString()}</div>
                <p className="service-description">
                  {service.description}
                </p>
                <div className="service-features">
                  {service.features.map((feature, index) => (
                    <span key={index} className="feature-tag">{feature}</span>
                  ))}
                </div>
                <button
                  className="service-button"
                  onClick={() => addToCart(service)}
                >
                  Agregar al Carrito
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CARRITO */}
        <div id="cart" className={isCartOpen ? 'active' : ''} style={{ right: isCartOpen ? '0' : '-400px' }}>
          <div className="cart-header">
            Carrito de Servicios
            <i className="bi bi-x-lg close-cart" onClick={() => setIsCartOpen(false)}></i>
          </div>
          <div className="cart-items">
            {cart.length === 0 ? (
              <p style={{ padding: '20px', textAlign: 'center' }}>El carrito está vacío</p>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="cart-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' }}>
                  <div>
                    <h4>{item.name}</h4>
                    <p>${item.price.toLocaleString()}</p>
                  </div>
                  <button onClick={() => removeFromCart(index)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="cart-total">
            Total: <span id="cartTotal">${calculateTotal().toLocaleString()}</span>
          </div>
          <Link to="/form_agenda">
            <button id="agendarBtn">Agendar Cita</button>
          </Link>
        </div>

        {/* BOTÓN FLOTANTE DEL CARRITO */}
        <div id="cartToggle" onClick={toggleCart}>
          <i className="bi bi-bag"></i>
          <span className="cart-count">{cart.length}</span>
        </div>
      </main>
    </div>
  );
}

export default Servicios_caballero;
