import React from "react";
import { Link } from "react-router-dom";

function Servicios_caballero() {
  return (
    <div>
      <main>
        <div className="menu-overlay" id="overlay"></div>

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
                  src="../images/servicios_caballeros/carrusel/barberia.png"
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
                  src="../images/servicios_caballeros/carrusel/servicios_general.png"
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
                  src="../images/servicios_caballeros/carrusel/varios.png"
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
          <button className="category-btn active" data-category="todos">
            Todos los Servicios
          </button>
          <button className="category-btn" data-category="cortes">
            Cortes de Cabello
          </button>
          <button className="category-btn" data-category="barba">
            Barba y Afeitado
          </button>
          <button className="category-btn" data-category="otros">
            Tratamientos Especiales
          </button>
        </div>

        {/* Área de servicios */}
        <h2 className="section-title">NUESTROS SERVICIOS</h2>

        <div className="services-grid">
          {/* Servicio 1 - Buzz Cut */}
          <div className="service-card" data-category="cortes">
            <div className="category-indicator">Corte</div>
            <img
              src="../images/servicios_caballeros/cortes/buzzz cut.png"
              alt="Buzz Cut"
              className="service-image"
            />
            <div className="service-content">
              <h3 className="service-title">Buzz Cut</h3>
              <div className="service-price">$25.000</div>
              <p className="service-description">
                Un corte limpio, rápido y versátil. Ideal para quienes buscan un
                look moderno y sin complicaciones.
              </p>
              <div className="service-features">
                <span className="feature-tag">Máquina</span>
                <span className="feature-tag">45 min</span>
              </div>
              <button
                className="service-button"
                data-service="Buzz Cut"
                data-price="25000"
              >
                Agregar al Carrito
              </button>
            </div>
          </div>

          {/*  Aquí puedes dejar el resto de tus servicios igual (ya sabes cómo adaptarlos) */}
        </div>

        {/* CARRITO */}
        <div id="cart">
          <div className="cart-header">
            Carrito de Servicios
            <i className="bi bi-x-lg close-cart"></i>
          </div>
          <div className="cart-items"></div>
          <div className="cart-total">
            Total: <span id="cartTotal">$0</span>
          </div>
          <Link to="/form_agenda">
            <button id="agendarBtn">Agendar Cita</button>
          </Link>
        </div>

        {/* BOTÓN FLOTANTE DEL CARRITO */}
        <div id="cartToggle">
          <i className="bi bi-bag"></i>
          <span className="cart-count">0</span>
        </div>
      </main>
    </div>
  );
}

export default Servicios_caballero;
