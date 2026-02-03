import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Servicios_dama() {
    const [cartOpen, setCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [activeCategory, setActiveCategory] = useState('uñas');

    // Calcular total y cantidad
    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    // Agregar producto al carrito
    const addToCart = (name, price) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.name === name);

            if (existingItem) {
                return prevItems.map(item =>
                    item.name === name ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevItems, { name, price, quantity: 1 }];
            }
        });
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
            description: 'Manicure básico sin Diseño'
        },
        {
            category: 'uñas',
            name: 'Manicure Básico con color',
            price: 11000,
            image: '/assets/images/servicios_dama/Uñas/ManicureConColor.png',
            oldPrice: 13000,
            description: 'Manicure Básico con Color'
        },
        {
            category: 'uñas',
            name: 'Uñas con diseño sencillo',
            price: 15000,
            image: '/assets/images/servicios_dama/Uñas/ManicureConDiseño.png',
            oldPrice: 18000,
            description: 'Uñas Básicas con diseño sencillo'
        },
        {
            category: 'uñas',
            name: 'Uñas acrílicas básicas',
            price: 25000,
            image: '/assets/images/servicios_dama/Uñas/UñasAcrilicasMedio.png',
            oldPrice: 35000,
            description: 'Uñas acrílicas básicas'
        },
        {
            category: 'uñas',
            name: 'Manicure Largas',
            price: 40000,
            image: '/assets/images/servicios_dama/Uñas/Uñas AcrilicasLargas.png',
            oldPrice: 45000,
            description: 'Uñas acrílicas largas'
        },
        // Cortes Largo
        {
            category: 'largo',
            name: 'Corte Mariposa',
            price: 18000,
            image: '/assets/images/servicios_dama/Corte Largo/Corte Pariposa.png',
            oldPrice: 22000,
            description: 'Corte en capas estilo Mariposa'
        },
        {
            category: 'largo',
            name: 'Corte Recto',
            price: 15000,
            image: '/assets/images/servicios_dama/Corte Largo/Corte Recto.png',
            oldPrice: 18000,
            description: 'Corte recto clásico para puntas sanas'
        },
        {
            category: 'largo',
            name: 'Corte en V',
            price: 16000,
            image: '/assets/images/servicios_dama/Corte Largo/Corte v.png',
            oldPrice: 20000,
            description: 'Corte en V para dar movimiento'
        },
        // Cortes Corto
        {
            category: 'corto',
            name: 'Bob Clásico',
            price: 20000,
            image: '/assets/images/servicios_dama/Corte Corto/Bob Clasico.png',
            oldPrice: 25000,
            description: 'Estilo Bob elegante y atemporal'
        },
        {
            category: 'corto',
            name: 'Pixie Cut',
            price: 22000,
            image: '/assets/images/servicios_dama/Corte Corto/Pixie.png',
            oldPrice: 28000,
            description: 'Estilo Pixie moderno y audaz'
        },
        // Peinados (Usando placeholders por ahora ya que no hay carpeta específica)
        {
            category: 'peinados',
            name: 'Peinado Especial',
            price: 25000,
            image: '/assets/images/servicios_dama/Corte Largo/Corte Pariposa.png',
            oldPrice: 30000,
            description: 'Peinado para ocasiones especiales'
        },
        // Mascarillas (Usando placeholders)
        {
            category: 'mascarillas',
            name: 'Hidratación Profunda',
            price: 35000,
            image: '/assets/images/servicios_dama/Corte Largo/Corte Recto.png',
            oldPrice: 45000,
            description: 'Mascarilla capilar restauradora'
        },
        // Tintes (Usando placeholders)
        {
            category: 'tinte',
            name: 'Tinte Completo',
            price: 60000,
            image: '/assets/images/servicios_dama/Corte Largo/Corte v.png',
            oldPrice: 75000,
            description: 'Aplicación de tinte completo'
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
                            <img src={product.image} alt={product.description} />
                            <h3>{product.name}</h3>
                            <p className="service-description">{product.description}</p>
                            <div className="price-old">${product.oldPrice?.toLocaleString()}</div>
                            <div className="price-new">${product.price.toLocaleString()}</div>
                            <button
                                className="add-btn"
                                onClick={() => addToCart(product.name, product.price)}
                            >
                                Agregar al carrito
                            </button>
                        </div>
                    ))}
                </div>

                {/* CARRITO */}
                <div id="cart" className={cartOpen ? 'active' : ''} style={{ right: cartOpen ? '0' : '-400px' }}>
                    <div className="cart-header">
                        Carrito
                        <i
                            className="bi bi-x-lg close-cart"
                            onClick={() => setCartOpen(false)}
                        ></i>
                    </div>
                    <div className="cart-items">
                        {cartItems.length === 0 ? (
                            <p style={{ padding: '20px', textAlign: 'center' }}>El carrito está vacío</p>
                        ) : (
                            cartItems.map((item, index) => (
                                <div key={index} className="cart-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' }}>
                                    <div>
                                        <h4>{item.name}</h4>
                                        <p>${item.price.toLocaleString()} x {item.quantity}</p>
                                    </div>
                                    <button onClick={() => removeFromCart(item.name)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="cart-total">
                        Total: <span id="cartTotal">${cartTotal.toLocaleString()}</span>
                    </div>
                    <Link to="/Form_agenda">
                        <button id="agendarBtn" style={{ width: '100%' }}>AGENDAR CITA</button>
                    </Link>
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