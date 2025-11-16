import React from 'react';
import { Link } from 'react-router-dom';

function Servicios_dama() {
    return (
        <div>
            <main>
                <section className="carousel">
                    <div className="slides">
                        <div className="slide"><img src="../images/servicios_dama/Carrusel/Carrusel1.jpg" alt="" /></div>
                        <div className="slide"><img src="../images/servicios_dama/Carrusel/Carrusel2.jpg" alt="" /></div>
                        <div className="slide"><img src="../images/servicios_dama/Carrusel/Carrusel3.jpg" alt="" /></div>
                        <div className="slide"><img src="../images/servicios_dama/Carrusel/Carrusel4.jpg" alt="" /></div>
                        <div className="slide"><img src="../images/servicios_dama/Carrusel/Carrusel5.jpg" alt="" /></div>
                        <div className="slide"><img src="../images/servicios_dama/Carrusel/Carrusel6.jpg" alt="" /></div>
                    </div>
                </section>

                {/* MARQUEE */}
                <div className="marquee">
                    <p>
                        Renueva tu estilo, realza tu esencia.
                        Tu belleza merece un toque de elegancia.
                        Un nuevo look, una nueva versión de ti.
                        Renueva tu estilo, realza tu esencia.
                        Tu belleza merece un toque de elegancia.
                        Un nuevo look, una nueva versión de ti.
                    </p>
                </div>

                {/* FILTRO DE DAMA Y CABALLERO */}
                <div className="seleccion-genero">
                    <h2>Selecciona el tipo de servicios</h2>
                    <div className="botones-genero">
                        <Link to="/servicios_dama" className="btn-dama">Damas</Link>
                        <Link to="/servicios_caballero" className="btn-caballero">Caballeros</Link>
                    </div>
                </div>

                {/* MENÚ DE CATEGORÍAS */}
                <div className="category-menu">
                    <button data-category="uñas" className="active">Uñas</button>
                    <button data-category="largo">Cortes Cabello Largo</button>
                    <button data-category="corto">Cortes Cabello Corto</button>
                    <button data-category="tinte">Color / Tintes</button>
                    <button data-category="peinados">Peinados</button>
                    <button data-category="mascarillas">Mascarillas</button>
                </div>

                {/* CATALOGO DE PRODUCTOS */}
                <div className="catalog-container" id="catalog">
                    <div className="product-card" data-category="uñas" data-name="Uñas sin diseño" data-price="10000">
                        <img src="/" alt="Uñas acrílicas básicas" />
                        <h3>Manicure básico sin Diseño</h3>
                        <div className="price-old">$12.000</div>
                        <div className="price-new">$10.000</div>
                        <button className="add-btn">Agregar al carrito</button>
                    </div>

                    {/* CATALOGO DE UÑAS */}
                    <div className="product-card" data-category="uñas" data-name="Manicure Básico con color" data-price="11000">
                        <img src="../images/servicios_dama/Uñas/ManicureConColor.png" alt="Manicure Básico" />
                        <h3>Manicure Básico con Color</h3>
                        <div className="price-old">$11.000</div>
                        <div className="price-new">$11.000</div>
                        <button className="add-btn">Agregar al carrito</button>
                    </div>

                    <div className="product-card" data-category="uñas" data-name="Uñas Basico con diseño sencillo" data-price="15000">
                        <img src="../images/servicios_dama/Uñas/ManicureConDiseño.png" alt="Uñas acrílicas básicas" />
                        <h3>Uñas Básicas con diseño sencillo</h3>
                        <div className="price-old">$13.000</div>
                        <div className="price-new">$15.000</div>
                        <button className="add-btn">Agregar al carrito</button>
                    </div>

                    <div className="product-card" data-category="uñas" data-name="Uñas acrílicas básicas" data-price="25000">
                        <img src="../images/servicios_dama/Uñas/UñasAcrilicasMedio.png" alt="Uñas acrílicas básicas" />
                        <h3>Uñas acrílicas básicas</h3>
                        <div className="price-old">$35.000</div>
                        <div className="price-new">$25.000</div>
                        <button className="add-btn">Agregar al carrito</button>
                    </div>

                    <div className="product-card" data-category="uñas" data-name="Manicure Largas" data-price="40000">
                        <img src="../images/servicios_dama/Uñas/Uñas AcrilicasLargas.png" alt="Uñas acrílicas largas" />
                        <h3>Uñas acrílicas largas</h3>
                        <div className="price-old">$45.000</div>
                        <div className="price-new">$40.000</div>
                        <button className="add-btn">Agregar al carrito</button>
                    </div>

                    {/* CATALOGO DE CORTE LARGO */}
                    <div className="product-card" data-category="largo" data-name="Corte mariposa" data-price="18000">
                        <img src="../images/servicios_dama/Corte Largo/Corte Pariposa.png" alt="Corte Mariposa" />
                        <h3>Corte Mariposa</h3>
                        <div className="price-old">$15.000</div>
                        <div className="price-new">$18.000</div>
                        <button className="add-btn">Agregar al carrito</button>
                    </div>

                    {/* CATALOGO DE PEINADOS */}
                    <div className="product-card" data-category="peinados" data-name="Manicure Básico" data-price="18000">
                        <img src="../images/servicios_dama/Mujer/Corte Pariposa.png" alt="Manicure Básico" />
                        <h3>Manicure Básico</h3>
                        <div className="price-old">$25.000</div>
                        <div className="price-new">$18.000</div>
                        <button className="add-btn">Agregar al carrito</button>
                    </div>

                    {/* CATALOGO DE MASCARILLAS */}
                    <div className="product-card" data-category="mascarillas" data-name="Manicure Básico" data-price="18000">
                        <img src="../images/servicios_dama/Mujer/Corte Pariposa.png" alt="Manicure Básico" />
                        <h3>Manicure Básico</h3>
                        <div className="price-old">$25.000</div>
                        <div className="price-new">$18.000</div>
                        <button className="add-btn">Agregar al carrito</button>
                    </div>
                </div>

                {/* CARRITO */}
                <div id="cart">
                    <div className="cart-header">
                        Carrito
                        <i className="bi bi-x-lg close-cart"></i>
                    </div>
                    <div className="cart-items"></div>
                    <div className="cart-total">
                        Total: <span id="cartTotal">$0</span>
                    </div>
                    <Link to="/form_agenda">
                        <button id="agendarBtn">Agendar</button>
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

export default Servicios_dama;
