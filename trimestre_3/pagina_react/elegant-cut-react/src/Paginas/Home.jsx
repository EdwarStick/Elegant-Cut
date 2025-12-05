import React from 'react'
import { useScroll } from '../Hooks/useScroll'

function Home() {
    // LLAMAR EL HOOK - Esto activa el efecto de scroll
    useScroll();

    return (
        <div>
            <main>

                {/* SECCIÓN 1 - MANTENIDA INTACTA */}
                <div className="content-grid">  {/* class → className */}
                    {/* Zona izquierda - Contenedor para imagen */}
                    <div className="image-container">  {/* class → className */}
                        <img src={`${process.env.PUBLIC_URL}/assets/images/sec-1-img/imagen-sec-1.png`} alt="Barbería Elegantcut" className="hero-image" />  {/* class → className */}
                    </div>

                    {/* Zona derecha - Mensaje con tipografía moderna */}
                    <div className="message-container">  {/* class → className */}
                        <h1>Donde Tu Estilo Cobra Vida</h1>
                        <p>En ELEGANTCUT combinamos tradición barbera con las últimas tendencias. Nuestros expertos crean looks
                            personalizados que reflejan tu personalidad y elevan tu confianza. Más que un corte, es una
                            experiencia que renueva tu estilo de vida.</p>

                        {/* BOTÓN CORREGIDO: ID diferente */}
                        <button className="cta-button" id="descubre-mas-btn">Descubre Más</button>  {/* class → className */}
                    </div>
                </div>

                {/* SECCIÓN 2 - NUESTRA HISTORIA */}
                <section className="about-section" id="about-section">  {/* class → className */}
                    <div className="about-header">  {/* class → className */}
                        <span className="subtitle">Nuestra Esencia</span>  {/* class → className */}
                        <h2>La Historia de ElegantCut</h2>
                        <p className="section-description"> creando sonrisas y estilos únicos</p>  {/* class → className */}
                    </div>

                    <div className="about-content">  {/* class → className */}
                        <div className="about-text">  {/* class → className */}
                            <h3>Donde la Tradición se Encuentra con la Innovación</h3>
                            <p>Desde 2012, ElegantCut ha sido el santuario para hombres que buscan más que un simple corte. Inspirados por las barberías clásicas europeas, creamos un espacio donde cada detalle cuenta. Combinamos técnicas ancestrales con las últimas tendencias para ofrecerte una experiencia que transforma no solo tu look, sino tu confianza.</p>
                        </div>

                        <div className="about-image">  {/* class → className */}
                            <img src={`${process.env.PUBLIC_URL}/assets/images/sec-1-img/sec-2.png`} alt="Historia de ElegantCut" className="about-hero-image" />  {/* class → className */}
                        </div>
                    </div>
                </section>

                {/* SECCIÓN 3 - TESTIMONIOS */}
                <section className="testimonials-section">  {/* class → className */}
                    <div className="testimonials-header">  {/* class → className */}
                        <span className="subtitle">Testimonios</span>  {/* class → className */}
                        <h2>Nuestros clientes</h2>
                    </div>

                    <div className="testimonials-stats">  {/* class → className */}
                        <div className="stat-box">  {/* class → className */}
                            <span className="stat-number">100+</span>  {/* class → className */}
                            <span className="stat-label">Clientes</span>  {/* class → className */}
                        </div>
                    </div>

                    <div className="testimonials-grid">  {/* class → className */}
                        <div className="testimonial-card">  {/* class → className */}
                            <p className="testimonial-text">Nunca me había sentido tan seguro después de un corte de pelo. El estilista de verdad entendió mi personalidad, entregando una apariencia que se adapta perfectamente a mi estilo de vida.</p>  {/* class → className */}
                            <div className="client-name">Jack J.</div>  {/* class → className */}
                            <div className="client-info">Cliente Regular</div>  {/* class → className */}
                        </div>

                        <div className="testimonial-card">  {/* class → className */}
                            <p className="testimonial-text">Mi maquillaje inicial fue impecable. El artista prestó atención a cada detalle, asegurándome de lucir paciente y segura durante todo mi día especial.</p>  {/* class → className */}
                            <div className="client-name">Liza R.</div>  {/* class → className */}
                            <div className="client-info">Cliente Casual</div>  {/* class → className */}
                        </div>

                        <div className="testimonial-card">  {/* class → className */}
                            <p className="testimonial-text">El ambiente del salón es relajante y acogedor. El personal es amable, Hábil, profesional, cada visita agradable, cómoda y realmente vale la pena repetirla.</p>  {/* class → className */}
                            <div className="client-name">Emma J.</div>  {/* class → className */}
                            <div className="client-info">Cliente Real</div>  {/* class → className */}
                        </div>
                    </div>
                </section>

                {/* SECCIÓN 4 - NUESTROS EXPERTOS */}
                <section className="experts-section">  {/* class → className */}
                    <div className="experts-header">  {/* class → className */}
                        <span className="subtitle">Nuestros Especialistas</span>  {/* class → className */}
                        <h2>Conoce a Nuestro Equipo</h2>
                    </div>

                    <div className="experts-grid">  {/* class → className */}
                        {/* Experto 1 */}
                        <div className="expert-card">  {/* class → className */}
                            <div className="expert-image">  {/* class → className */}
                                {/* CORREGIR RUTA DE IMAGEN */}
                                <img src={`${process.env.PUBLIC_URL}/assets/images/barbero-1.jpg`} alt="Barbero Especialista" className="expert-img" />  {/* class → className */}
                            </div>
                            <div className="expert-info">  {/* class → className */}
                                <h3 className="expert-name">Carlos Rodríguez</h3>  {/* class → className */}
                                <p className="expert-role">Barbero Especialista</p>  {/* class → className */}
                            </div>
                        </div>

                        {/* Experto 2 */}
                        <div className="expert-card">  {/* class → className */}
                            <div className="expert-image">  {/* class → className */}
                                {/* CORREGIR RUTA DE IMAGEN */}
                                <img src={`${process.env.PUBLIC_URL}/assets/images/estilista-1.jpg`} alt="Estilista Profesional" className="expert-img" />  {/* class → className */}
                            </div>
                            <div className="expert-info">  {/* class → className */}
                                <h3 className="expert-name">Ana Martínez</h3>  {/* class → className */}
                                <p className="expert-role">Estilista Profesional</p>  {/* class → className */}
                            </div>
                        </div>

                        {/* Experto 3 */}
                        <div className="expert-card">  {/* class → className */}
                            <div className="expert-image">  {/* class → className */}
                                {/* CORREGIR RUTA DE IMAGEN */}
                                <img src={`${process.env.PUBLIC_URL}/assets/images/especialista-1.jpg`} alt="Especialista en Barbas" className="expert-img" />  {/* class → className */}
                            </div>
                            <div className="expert-info">  {/* class → className */}
                                <h3 className="expert-name">Miguel Sánchez</h3>  {/* class → className */}
                                <p className="expert-role">Especialista en Barbas</p>  {/* class → className */}
                            </div>
                        </div>

                        {/* Experto 4 */}
                        <div className="expert-card">  {/* class → className */}
                            <div className="expert-image">  {/* class → className */}
                                {/* CORREGIR RUTA DE IMAGEN */}
                                <img src={`${process.env.PUBLIC_URL}/assets/images/colorista-1.jpg`} alt="Colorista Profesional" className="expert-img" />  {/* class → className */}
                            </div>
                            <div className="expert-info">  {/* class → className */}
                                <h3 className="expert-name">Laura González</h3>  {/* class → className */}
                                <p className="expert-role">Colorista Profesional</p>  {/* class → className */}
                            </div>
                        </div>

                        {/* Experto 5 */}
                        <div className="expert-card">  {/* class → className */}
                            <div className="expert-image">  {/* class → className */}
                                {/* CORREGIR RUTA DE IMAGEN */}
                                <img src={`${process.env.PUBLIC_URL}/assets/images/maquillador-1.jpg`} alt="Maquillador Profesional" className="expert-img" />  {/* class → className */}
                            </div>
                            <div className="expert-info">  {/* class → className */}
                                <h3 className="expert-name">Sofía Ramírez</h3>  {/* class → className */}
                                <p className="expert-role">Maquillador Profesional</p>  {/* class → className */}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Home