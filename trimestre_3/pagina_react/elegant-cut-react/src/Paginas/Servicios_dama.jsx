import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';

function Servicios_dama() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [cartOpen, setCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [alertVisible, setAlertVisible] = useState(false); // Alerta de carrito vacío (dentro del modal)
    const [loginAlertVisible, setLoginAlertVisible] = useState(false); // Alerta de login (flotante)
    const [activeCategory, setActiveCategory] = useState('uñas');

    // Calcular total y cantidad
    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    // Agregar producto al carrito
    const addToCart = (product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.name === product.name);

            if (existingItem) {
                return prevItems.map(item =>
                    item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevItems, { ...product, quantity: 1 }]; // Agregamos todo el producto (incluyendo imagen)
            }
        });
        setCartOpen(true);
    };

    // Eliminar producto del carrito
    const removeFromCart = (name) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.name === name);

            if (existingItem && existingItem.quantity > 1) {
                return prevItems.map(item =>
                    item.name === name ? { ...item, quantity: item.quantity - 1 } : item
                );
            } else {
                return prevItems.filter(item => item.name !== name);
            }
        });
    };

    // Filtrar productos por categoría
    const filterByCategory = (category) => {
        setActiveCategory(category);
    };

    // Categorías disponibles
    const categories = [
        { id: 'uñas', name: 'Uñas' },
        { id: 'largo', name: 'Cortes Cabello Largo' },
        { id: 'corto', name: 'Cortes Cabello Corto' },
        { id: 'tinte', name: 'Color / Tintes' },
        { id: 'peinados', name: 'Peinados' },
        { id: 'mascarillas', name: 'Mascarillas' }
    ];

    // Productos disponibles
    const products = [
        // Uñas
        {
            category: 'uñas',
            name: 'Uñas sin diseño',
            price: 10000,
            image: '/assets/images/servicios_dama/Uñas/ManicureSinDiseño.png',
            oldPrice: 12000,
            description: 'Manicure básico sin Diseño',
            features: ['Limpieza', 'Esmalte', '30 min'],
            categoryLabel: 'Uñas'
        },
        {
            category: 'uñas',
            name: 'Manicure Básico con color',
            price: 11000,
            image: '/assets/images/servicios_dama/Uñas/ManicureConColor.png',
            oldPrice: 13000,
            description: 'Manicure Básico con Color',
            features: ['Limpieza', 'Color', '35 min'],
            categoryLabel: 'Uñas'
        },
        {
            category: 'uñas',
            name: 'Uñas con diseño sencillo',
            price: 15000,
            image: '/assets/images/servicios_dama/Uñas/ManicureConDiseño.png',
            oldPrice: 18000,
            description: 'Uñas Básicas con diseño sencillo',
            features: ['Diseño', 'Arte', '45 min'],
            categoryLabel: 'Uñas'
        },
        {
            category: 'uñas',
            name: 'Uñas acrílicas básicas',
            price: 25000,
            image: '/assets/images/servicios_dama/Uñas/UñasAcrilicasMedio.png',
            oldPrice: 35000,
            description: 'Uñas acrílicas básicas',
            features: ['Acrílico', 'Duración', '90 min'],
            categoryLabel: 'Uñas'
        },
        {
            category: 'uñas',
            name: 'Manicure Largas',
            price: 40000,
            image: '/assets/images/servicios_dama/Uñas/Uñas AcrilicasLargas.png',
            oldPrice: 45000,
            description: 'Uñas acrílicas largas',
            features: ['Extensión', 'Estilo', '120 min'],
            categoryLabel: 'Uñas'
        },
        // Cortes Largo
        {
            category: 'largo',
            name: 'Corte Mariposa',
            price: 18000,
            image: '/assets/images/servicios_dama/Corte Largo/Corte Pariposa.png',
            oldPrice: 22000,
            description: 'Corte en capas estilo Mariposa',
            features: ['Volumen', 'Capas', '60 min'],
            categoryLabel: 'Corte'
        },
        {
            category: 'largo',
            name: 'Corte Recto',
            price: 15000,
            image: '/assets/images/servicios_dama/Corte Largo/Corte Recto.png',
            oldPrice: 18000,
            description: 'Corte recto clásico para puntas sanas',
            features: ['Puntas', 'Sano', '45 min'],
            categoryLabel: 'Corte'
        },
        {
            category: 'largo',
            name: 'Corte en V',
            price: 16000,
            image: '/assets/images/servicios_dama/Corte Largo/Corte v.png',
            oldPrice: 20000,
            description: 'Corte en V para dar movimiento',
            features: ['Movimiento', 'Estilo', '50 min'],
            categoryLabel: 'Corte'
        },
        // Cortes Corto
        {
            category: 'corto',
            name: 'Bob Clásico',
            price: 20000,
            image: '/assets/images/servicios_dama/Corte Corto/Bob Clasico.png',
            oldPrice: 25000,
            description: 'Estilo Bob elegante y atemporal',
            features: ['Elegancia', 'Corto', '50 min'],
            categoryLabel: 'Corte'
        },
        {
            category: 'corto',
            name: 'Pixie Cut',
            price: 22000,
            image: '/assets/images/servicios_dama/Corte Corto/Pixie.png',
            oldPrice: 28000,
            description: 'Estilo Pixie moderno y audaz',
            features: ['Audaz', 'Moderno', '45 min'],
            categoryLabel: 'Corte'
        },
        // Peinados
        {
            category: 'peinados',
            name: 'Peinado Especial',
            price: 25000,
            image: '/assets/images/servicios_dama/Corte Largo/Corte Pariposa.png',
            oldPrice: 30000,
            description: 'Peinado para ocasiones especiales',
            features: ['Fiesta', 'Elegante', '60 min'],
            categoryLabel: 'Peinados'
        },
        // Mascarillas
        {
            category: 'mascarillas',
            name: 'Hidratación Profunda',
            price: 35000,
            image: '/assets/images/servicios_dama/Corte Largo/Corte Recto.png',
            oldPrice: 45000,
            description: 'Mascarilla capilar restauradora',
            features: ['Hidratación', 'Brillo', '40 min'],
            categoryLabel: 'Tratamiento'
        },
        // Tintes
        {
            category: 'tinte',
            name: 'Tinte Completo',
            price: 60000,
            image: '/assets/images/servicios_dama/Corte Largo/Corte v.png',
            oldPrice: 75000,
            description: 'Aplicación de tinte completo',
            features: ['Color', 'Cambio', '120 min'],
            categoryLabel: 'Color'
        }
    ];

    // Filtrar productos por categoría activa
    const filteredProducts = activeCategory === 'all'
        ? products
        : products.filter(product => product.category === activeCategory);

    return (
        <div>
            <main>
                <div className={`menu-overlay ${cartOpen ? 'active' : ''}`} id="overlay" onClick={() => setCartOpen(false)}></div>

                {/* ALERTA FLOTANTE DE LOGIN */}
                {loginAlertVisible && (
                    <div
                        className="alert alert-warning alert-dismissible fade show"
                        role="alert"
                        style={{
                            position: 'fixed',
                            top: '20px',
                            right: '20px',
                            zIndex: 9999,
                            width: '300px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                    >
                        <strong>¡Atención!</strong> Debes iniciar sesión o crear una cuenta para agendar una cita.
                        <button type="button" className="btn-close" onClick={() => setLoginAlertVisible(false)}></button>
                    </div>
                )}

                {/* CARRUSEL BOOTSTRAP */}
                <div className="carousel-container">
                    <div id="carouselDama" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <img src="/assets/images/servicios_dama/Carrusel/Carrusel1.jpg" className="d-block w-100" alt="Estilo Dama 1" />
                                <div className="carousel-caption d-none d-md-block">
                                    <h3>BELLEZA Y ELEGANCIA</h3>
                                    <p>Descubre tu mejor versión con nuestros expertos</p>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <img src="/assets/images/servicios_dama/Carrusel/Carrusel2.jpg" className="d-block w-100" alt="Estilo Dama 2" />
                                <div className="carousel-caption d-none d-md-block">
                                    <h3>CUIDADO INTEGRAL</h3>
                                    <p>Tratamientos exclusivos para tu cabello y piel</p>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <img src="/assets/images/servicios_dama/Carrusel/Carrusel3.jpg" className="d-block w-100" alt="Estilo Dama 3" />
                                <div className="carousel-caption d-none d-md-block">
                                    <h3>TENDENCIAS ACTUALES</h3>
                                    <p>Lo último en cortes y coloración</p>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <img src="/assets/images/servicios_dama/Carrusel/Carrusel4.jpg" className="d-block w-100" alt="Estilo Dama 4" />
                            </div>
                            <div className="carousel-item">
                                <img src="/assets/images/servicios_dama/Carrusel/Carrusel5.jpg" className="d-block w-100" alt="Estilo Dama 5" />
                            </div>
                            <div className="carousel-item">
                                <img src="/assets/images/servicios_dama/Carrusel/Carrusel6.jpg" className="d-block w-100" alt="Estilo Dama 6" />
                            </div>
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselDama" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Anterior</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselDama" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Siguiente</span>
                        </button>
                    </div>
                </div>

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
                        <Link to="/Servicios_dama" className="btn-dama">Damas</Link>
                        <Link to="/Servicios_caballero" className="btn-caballero">Caballeros</Link>
                    </div>
                </div>

                {/* MENÚ DE CATEGORÍAS */}
                <div className="category-menu">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            data-category={category.id}
                            className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                            onClick={() => filterByCategory(category.id)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* CATALOGO DE PRODUCTOS */}
                <div className="catalog-container" id="catalog">
                    {filteredProducts.map((product, index) => (
                        <div
                            key={index}
                            className="product-card"
                            data-category={product.category}
                        >
                            <div className="category-indicator">{product.categoryLabel}</div>
                            <img src={product.image} alt={product.description} />

                            <div className="service-content">
                                <h3>{product.name}</h3>
                                <div className="price-container">
                                    <div className="price-new">${product.price.toLocaleString()}</div>
                                    <div className="price-old">${product.oldPrice?.toLocaleString()}</div>
                                </div>
                                <p className="service-description">{product.description}</p>
                                <div className="service-features">
                                    {product.features && product.features.map((feature, idx) => (
                                        <span key={idx} className="feature-tag">{feature}</span>
                                    ))}
                                </div>
                                <button
                                    className="add-btn"
                                    onClick={() => addToCart(product)}
                                >
                                    Agregar al carrito
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CARRITO - VISTA APARTE / MODAL */}
                <div id="cart" className={cartOpen ? 'active' : ''}>
                    <div className="cart-content">
                        <div className="cart-header">
                            <span>Tu Carrito</span>
                            <i className="bi bi-x-lg close-cart" onClick={() => setCartOpen(false)}></i>
                        </div>

                        {alertVisible && (
                            <div className="alert alert-danger text-center m-3" role="alert">
                                <i className="bi bi-exclamation-circle-fill me-2"></i>
                                Tu carrito está vacío. Agrega servicios antes de agendar.
                            </div>
                        )}

                        <div className="cart-items">
                            {cartItems.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                                    <i className="bi bi-cart-x" style={{ fontSize: '3rem', marginBottom: '10px', display: 'block' }}></i>
                                    <p>No has añadido servicios aún.</p>
                                </div>
                            ) : (
                                cartItems.map((item, index) => (
                                    <div key={index} className="cart-item">
                                        <div className="cart-item-info">
                                            {/* Usamos item.image si existe, si no un placeholder o nada */}
                                            {item.image && <img src={item.image} alt={item.name} className="cart-item-img" />}
                                            <div>
                                                <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{item.name}</h4>
                                                <p style={{ margin: 0, color: '#bc2041', fontWeight: 'bold' }}>
                                                    ${item.price.toLocaleString()} x {item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.name)}
                                            style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '1.2rem' }}
                                            title="Eliminar servicio"
                                        >
                                            <i className="bi bi-trash-fill"></i>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="cart-total">
                            <span>Total a Pagar:</span>
                            <span>${cartTotal.toLocaleString()}</span>
                        </div>

                        <div style={{ padding: '0 30px 30px 30px' }}>
                            <button
                                id="agendarBtn"
                                onClick={() => {
                                    if (cartItems.length === 0) {
                                        setAlertVisible(true);
                                        setTimeout(() => setAlertVisible(false), 3000);
                                    } else if (!isAuthenticated) {
                                        setLoginAlertVisible(true);
                                        setTimeout(() => setLoginAlertVisible(false), 5000);
                                    } else {
                                        setCartOpen(false);
                                        navigate('/Form_agenda');
                                    }
                                }}
                            >
                                AGENDAR CITA AHORA
                            </button>
                            <button
                                onClick={() => setCartOpen(false)}
                                style={{ width: '100%', marginTop: '10px', padding: '10px', background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                Seguir viendo servicios
                            </button>
                        </div>
                    </div>
                </div>

                {/* BOTÓN FLOTANTE DEL CARRITO */}
                <div id="cartToggle" onClick={() => setCartOpen(!cartOpen)}>
                    <i className="bi bi-cart-fill" style={{ fontSize: '1.5rem' }}></i>
                    <span className="cart-count">{cartCount}</span>
                </div>
            </main>
        </div>
    );
}

export default Servicios_dama;