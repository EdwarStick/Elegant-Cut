import React, { useState } from 'react';
import '../Estilos/Barberos.css';


function Barberos() {
  const [activeFilter, setActiveFilter] = useState('all');

  // Datos de los barberos
  const barbers = [
    {
      id: 1,
      name: "Carlos Mendoza",
      title: "Barbero Master & Fundador",
      experience: "18 años",
      rating: "5.0 (328)",
      bio: "Especialista en cortes clásicos y afeitado tradicional. Más de 18 años transformando estilos con precisión y elegancia.",
      stats: { clients: "2,500+", recommend: "98%" },
      categories: ["senior", "classic"],
      specialties: ["Clásico", "Afeitado", "Barbas"],
      badge: "senior",
      image: "barbero-senior1.jpg"
    },
    {
      id: 2,
      name: "Miguel Torres",
      title: "Especialista en Barbas",
      experience: "8 años",
      rating: "5.0 (415)",
      bio: "Maestro en afeitado tradicional y diseño de barbas. Transforma tu estilo facial con técnicas ancestrales y productos premium.",
      stats: { clients: "1,800+", recommend: "99%" },
      categories: ["modern", "fade", "beard"],
      specialties: ["Barbas", "Afeitado", "Clásico"],
      badge: "trending",
      image: "barbero2.jpg"
    },
    {
      id: 3,
      name: "Alejandro Rojas",
      title: "Artista del Degradado",
      experience: "6 años",
      rating: "4.9 (287)",
      bio: "Joven talento especializado en degradados modernos y cortes urbanos. Siempre a la vanguardia de las últimas tendencias.",
      stats: { clients: "1,200+", recommend: "97%" },
      categories: ["modern", "fade"],
      specialties: ["Degradados", "Moderno", "Color"],
      badge: "popular",
      image: "barbero3.jpg"
    },
    {
      id: 4,
      name: "Roberto Silva",
      title: "Maestro Clásico",
      experience: "12 años",
      rating: "4.9 (356)",
      bio: "Guardian de las técnicas tradicionales de barbería. Especializado en cortes atemporales que nunca pasan de moda.",
      stats: { clients: "2,100+", recommend: "98%" },
      categories: ["senior", "classic"],
      specialties: ["Clásico", "Tradicional", "Afeitado"],
      badge: "senior",
      image: "barbero4.jpg"
    },
    {
      id: 5,
      name: "David Chen",
      title: "Especialista en Estilos Modernos",
      experience: "5 años",
      rating: "4.8 (194)",
      bio: "Innovador en cortes contemporáneos y técnicas avanzadas. Crea looks únicos que reflejan tu personalidad.",
      stats: { clients: "900+", recommend: "96%" },
      categories: ["modern", "fade"],
      specialties: ["Moderno", "Texturizado", "Diseño"],
      badge: "new",
      image: "barbero5.jpg"
    },
    {
      id: 6,
      name: "Javier Morales",
      title: "Artista de Barbas",
      experience: "7 años",
      rating: "4.9 (273)",
      bio: "Especialista en diseño y mantenimiento de barbas. Domina desde el estilo corporate hasta looks más audaces.",
      stats: { clients: "1,500+", recommend: "98%" },
      categories: ["beard", "classic"],
      specialties: ["Barbas", "Diseño", "Mantenimiento"],
      badge: "expert",
      image: "barbero6.jpg"
    }
  ];

  // Filtros disponibles
  const filters = [
    { key: 'all', label: 'Todos' },
    { key: 'classic', label: 'Cortes Clásicos' },
    { key: 'modern', label: 'Estilos Modernos' },
    { key: 'beard', label: 'Especialista en Barbas' },
    { key: 'fade', label: 'Degradados Expertos' },
    { key: 'senior', label: 'Barberos Senior' }
  ];

  // Filtrar barberos
  const filteredBarbers = barbers.filter(barber =>
    activeFilter === 'all' || barber.categories.includes(activeFilter)
  );

  // Manejar cambio de filtro
  const handleFilterChange = (filterKey) => {
    setActiveFilter(filterKey);
  };

  // Renderizar barberos
  const renderBarberCard = (barber) => (
    <div
      key={barber.id}
      className="barber-card"
      data-category={barber.categories.join(' ')}
    >
      <div className="barber-header">
        <div className={`barber-badge ${barber.badge}`}>
          {barber.badge === 'senior' && 'Senior'}
          {barber.badge === 'trending' && 'Trending'}
          {barber.badge === 'popular' && 'Popular'}
          {barber.badge === 'new' && 'Nuevo'}
          {barber.badge === 'expert' && 'Experto'}
        </div>
        <div className="barber-experience">{barber.experience}</div>
      </div>
      <div className="barber-image">
        <img
          src={`${process.env.PUBLIC_URL}/assets/images/barberos/${barber.image}`}
          alt={`${barber.name} - ${barber.title}`}
        />
        <div className="barber-overlay">
          <div className="specialties">
            {barber.specialties.map((specialty, index) => (
              <span key={index} className="specialty-tag">{specialty}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="barber-info">
        <h3 className="barber-name">{barber.name}</h3>
        <p className="barber-title">{barber.title}</p>
        <div className="barber-rating">
          <div className="stars">
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <span>{barber.rating}</span>
          </div>
        </div>
        <p className="barber-bio">{barber.bio}</p>
        <div className="barber-stats">
          <div className="stat">
            <strong>{barber.stats.clients}</strong>
            <span>Clientes</span>
          </div>
          <div className="stat">
            <strong>{barber.stats.recommend}</strong>
            <span>Recomiendan</span>
          </div>
        </div>
        <div className="barber-actions">
          <button className="btn-primary">Ver Portafolio</button>
          <button className="btn-secondary">Reservar Cita</button>
        </div>
      </div>
    </div>
  );

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
              {filters.map(filter => (
                <button
                  key={filter.key}
                  className={`filter-btn ${activeFilter === filter.key ? 'active' : ''}`}
                  onClick={() => handleFilterChange(filter.key)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Sección de Barberos Unificada */}
        <section className="barbers-section">
          <div className="container">
            <div className="barbers-grid" id="barbers-container">
              {filteredBarbers.map(renderBarberCard)}
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

export default Barberos;