import React from 'react'

function Barberos() {
  return (
    <div>
      <main>
        <section className="team-hero">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">Nuestro Equipo de Expertos</h1>
              <p className="hero-subtitle">Conoce a los profesionales que harán realidad el estilo que mereces</p>
              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-number">15+</div>
                  <div className="stat-label">Años de Experiencia Colectiva</div>
                </div>
                <div className="stat">
                  <div className="stat-number">5,000+</div>
                  <div className="stat-label">Clientes Satisfechos</div>
                </div>
                <div className="stat">
                  <div className="stat-number">98%</div>
                  <div className="stat-label">Rating de Clientes</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filtros de Especialidad */}
        <section className="specialties-section">
          <div className="container">
            <div className="section-header">
              <h2>Encuentra tu Barbero Ideal</h2>
              <p>Filtra por especialidad y encuentra el profesional perfecto para tu estilo</p>
            </div>
            <div className="specialties-filter">
              <button className="filter-btn active" data-filter="all">Todos</button>
              <button className="filter-btn" data-filter="classic">Cortes Clásicos</button>
              <button className="filter-btn" data-filter="modern">Estilos Modernos</button>
              <button className="filter-btn" data-filter="beard">Especialista en Barbas</button>
              <button className="filter-btn" data-filter="fade">Degradados Expertos</button>
              <button className="filter-btn" data-filter="senior">Barberos Senior</button>
            </div>
          </div>
        </section>

        {/* Sección de Barberos Unificada */}
        <section className="barbers-section">
          <div className="container">
            <div className="barbers-grid" id="barbers-container">

              {/* Barbero 1 - Carlos Mendoza */}
              <div className="barber-card" data-category="senior classic">
                <div className="barber-header">
                  <div className="barber-badge senior">Senior</div>
                  <div className="barber-experience">18 años</div>
                </div>
                <div className="barber-image">
                  <img 
                    src={`${process.env.PUBLIC_URL}/assets/images/barberos/barbero-senior1.jpg`} 
                    alt="Carlos Mendoza - Barbero Master"
                  />
                  <div className="barber-overlay">
                    <div className="specialties">
                      <span className="specialty-tag">Clásico</span>
                      <span className="specialty-tag">Afeitado</span>
                      <span className="specialty-tag">Barbas</span>
                    </div>
                  </div>
                </div>
                <div className="barber-info">
                  <h3 className="barber-name">Carlos Mendoza</h3>
                  <p className="barber-title">Barbero Master & Fundador</p>
                  <div className="barber-rating">
                    <div className="stars">
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <span>5.0 (328)</span>
                    </div>
                  </div>
                  <p className="barber-bio">Especialista en cortes clásicos y afeitado tradicional. Más de 18 años
                    transformando estilos con precisión y elegancia.</p>
                  <div className="barber-stats">
                    <div className="stat">
                      <strong>2,500+</strong>
                      <span>Clientes</span>
                    </div>
                    <div className="stat">
                      <strong>98%</strong>
                      <span>Recomiendan</span>
                    </div>
                  </div>
                  <div className="barber-actions">
                    <button className="btn-primary">Ver Portafolio</button>
                    <button className="btn-secondary">Reservar Cita</button>
                  </div>
                </div>
              </div>

              {/* Barbero 2 - Miguel Torres */}
              <div className="barber-card" data-category="modern fade beard">
                <div className="barber-header">
                  <div className="barber-badge trending">Trending</div>
                  <div className="barber-experience">8 años</div>
                </div>
                <div className="barber-image">
                  <img 
                    src={`${process.env.PUBLIC_URL}/assets/images/barberos/barbero2.jpg`} 
                    alt="Miguel Torres - Especialista en Barbas"
                  />
                  <div className="barber-overlay">
                    <div className="specialties">
                      <span className="specialty-tag">Barbas</span>
                      <span className="specialty-tag">Afeitado</span>
                      <span className="specialty-tag">Clásico</span>
                    </div>
                  </div>
                </div>
                <div className="barber-info">
                  <h3 className="barber-name">Miguel Torres</h3>
                  <p className="barber-title">Especialista en Barbas</p>
                  <div className="barber-rating">
                    <div className="stars">
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <span>5.0 (415)</span>
                    </div>
                  </div>
                  <p className="barber-bio">Maestro en afeitado tradicional y diseño de barbas. Transforma tu estilo
                    facial con técnicas ancestrales y productos premium.</p>
                  <div className="barber-stats">
                    <div className="stat">
                      <strong>1,800+</strong>
                      <span>Clientes</span>
                    </div>
                    <div className="stat">
                      <strong>99%</strong>
                      <span>Recomiendan</span>
                    </div>
                  </div>
                  <div className="barber-actions">
                    <button className="btn-primary">Ver Portafolio</button>
                    <button className="btn-secondary">Reservar Cita</button>
                  </div>
                </div>
              </div>

              {/* Repite los mismos cambios para los otros barberos... */}
              {/* Cambia class por className y corrige las rutas de las imágenes */}

            </div>
          </div>
        </section>

        {/* Sección CTA */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>¿Listo para tu Transformación?</h2>
              <p>Agenda tu cita con el barbero perfecto para tu estilo</p>
              <div className="cta-buttons">
                <button className="btn-primary large">Reservar Cita Ahora</button>
                <button className="btn-secondary large">Llamar para Consulta</button>
              </div>
              <div className="cta-features">
                <div className="feature">
                  <i className="bi bi-clock"></i>
                  <span>Reservas 24/7</span>
                </div>
                <div className="feature">
                  <i className="bi bi-credit-card"></i>
                  <span>Múltiples Pagos</span>
                </div>
                <div className="feature">
                  <i className="bi bi-star"></i>
                  <span>Garantía de Satisfacción</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Barberos