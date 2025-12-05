import React from 'react'

function Reseñas() {
  return (
    <div>
      <main className="reviews-main">
        {/* Banner de oferta exclusiva */}
        <section className="exclusive-offer">
          <div className="offer-container">
            <span className="offer-badge">Oferta Exclusiva</span>
            <h1 className="offer-title">15% OFF</h1>
            <h2 className="offer-subtitle">En tu primer corte de cabello</h2>
            <p className="offer-text">Solo esta semana... ¡No te lo pierdas!</p>
            <button className="cta-button">Reservar Ahora →</button>
          </div>
        </section>

        {/* Oferta regular */}
        <section className="regular-offer">
          <div className="offer-container">
            <h3 className="regular-title">Oferta Regular</h3>
            <p className="regular-text">10% de cashback en cuidado personal</p>
            <p className="cashback-info">Cashback máximo: $12. Código: BARBER12</p>
            <button className="secondary-button">Ver Servicios →</button>
          </div>
        </section>

        {/* Título de reseñas */}
        <section className="reviews-header">
          <div className="container">
            <span className="section-subtitle">Testimonios</span>
            <h2 className="reviews-title">No nos creas, mira lo que dicen nuestros clientes</h2>
          </div>
        </section>

        {/* Reseñas de clientes con carousel */}
        <section className="customer-reviews">
          <div className="container">
            <div className="reviews-carousel">
              <div className="review-card">
                <div className="review-content">
                  <div className="rating-stars">
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                  </div>
                  <p className="review-text">"Excelente servicio en la barbería. Los barberos son muy
                    profesionales y el ambiente es increíble. Siempre salgo satisfecho con mi corte."</p>
                  <div className="review-author">
                    <strong>Carlos M.</strong>
                    <span>- Ciudad de México</span>
                  </div>
                </div>
              </div>

              <div className="review-card">
                <div className="review-content">
                  <div className="rating-stars">
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-half"></i>
                  </div>
                  <p className="review-text">"La mejor experiencia de corte que he tenido. Atención personalizada
                    y resultados exactamente como quería. ¡Altamente recomendados!"</p>
                  <div className="review-author">
                    <strong>Miguel R.</strong>
                    <span>- Guadalajara, JAL</span>
                  </div>
                </div>
              </div>

              <div className="review-card">
                <div className="review-content">
                  <div className="rating-stars">
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                  </div>
                  <p className="review-text">"Increíble atención al cliente y resultados impecables. Los productos
                    que usan son de primera calidad. Mi barbería de confianza."</p>
                  <div className="review-author">
                    <strong>Javier L.</strong>
                    <span>- Monterrey, NL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Indicadores del carousel */}
            <div className="carousel-indicators">
              <span className="carousel-indicator active"></span>
              <span className="carousel-indicator"></span>
              <span className="carousel-indicator"></span>
            </div>
          </div>
        </section>

        {/* FORMULARIO DE RESEÑAS */}
        <section className="review-form-section">
          <div className="container">
            <h2>Deja tu reseña</h2>
            <form className="review-form">
              <div className="form-group">
                <label htmlFor="name">Nombre completo</label>
                <input type="text" id="name" name="name" required/>
              </div>
              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <input type="email" id="email" name="email" required/>
              </div>
              <div className="form-group">
                <label htmlFor="rating">Calificación</label>
                <select id="rating" name="rating" required>
                  <option value="">Selecciona una calificación</option>
                  <option value="5">★★★★★ Excelente</option>
                  <option value="4">★★★★ Muy Bueno</option>
                  <option value="3">★★★ Bueno</option>
                  <option value="2">★★ Regular</option>
                  <option value="1">★ Malo</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="review">Tu reseña</label>
                <textarea id="review" name="review" rows="5" required></textarea>
              </div>
              <button type="submit" className="submit-button">
                <div className="svg-wrapper-1">
                  <div className="svg-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path fill="currentColor"
                        d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z">
                      </path>
                    </svg>
                  </div>
                </div>
                <span>Enviar</span>
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Reseñas