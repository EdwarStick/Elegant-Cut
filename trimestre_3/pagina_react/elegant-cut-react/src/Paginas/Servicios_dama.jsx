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
            image: '/', 
            oldPrice: 12000,
            description: 'Manicure básico sin Diseño'
        },
        { 
            category: 'uñas', 
            name: 'Manicure Básico con color', 
            price: 11000, 
            image: '../images/servicios_dama/Uñas/ManicureConColor.png', 
            oldPrice: 11000,
            description: 'Manicure Básico con Color'
        },
        { 
            category: 'uñas', 
            name: 'Uñas Basico con diseño sencillo', 
            price: 15000, 
            image: '../images/servicios_dama/Uñas/ManicureConDiseño.png', 
            oldPrice: 13000,
            description: 'Uñas Básicas con diseño sencillo'
        },
        { 
            category: 'uñas', 
            name: 'Uñas acrílicas básicas', 
            price: 25000, 
            image: '../images/servicios_dama/Uñas/UñasAcrilicasMedio.png', 
            oldPrice: 35000,
            description: 'Uñas acrílicas básicas'
        },
        { 
            category: 'uñas', 
            name: 'Manicure Largas', 
            price: 40000, 
            image: '../images/servicios_dama/Uñas/Uñas AcrilicasLargas.png', 
            oldPrice: 45000,
            description: 'Uñas acrílicas largas'
        },
        // Cortes Largo
        { 
            category: 'largo', 
            name: 'Corte mariposa', 
            price: 18000, 
            image: '../images/servicios_dama/Corte Largo/Corte Pariposa.png', 
            oldPrice: 15000,
            description: 'Corte Mariposa'
        },
        // Peinados
        { 
            category: 'peinados', 
            name: 'Peinado Especial', 
            price: 18000, 
            image: '../images/servicios_dama/Mujer/Corte Pariposa.png', 
            oldPrice: 25000,
            description: 'Peinado Especial'
        },
        // Mascarillas
        { 
            category: 'mascarillas', 
            name: 'Mascarilla Facial', 
            price: 18000, 
            image: '../images/servicios_dama/Mujer/Corte Pariposa.png', 
            oldPrice: 25000,
            description: 'Mascarilla Facial'
        }
    ];

    // Filtrar productos por categoría activa
    const filteredProducts = activeCategory === 'all' 
        ? products 
        : products.filter(product => product.category === activeCategory);

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
                    {categories.map(category => (
                        <button 
                            key={category.id}
                            data-category={category.id}
                            className={activeCategory === category.id ? 'active' : ''}
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
                            <h3>{product.description}</h3>
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
                <div id="cart" className={cartOpen ? 'open' : ''}>
                    <div className="cart-header">
                        Carrito
                        <i 
                            className="bi bi-x-lg close-cart" 
                            onClick={() => setCartOpen(false)}
                        ></i>
                    </div>
                    <div className="cart-items">
                        {cartItems.length === 0 ? (
                            <p>El carrito está vacío</p>
                        ) : (
                            cartItems.map((item, index) => (
                                <div key={index} className="cart-item">
                                    <span>{item.name}</span>
                                    <span>${item.price.toLocaleString()}</span>
                                    <span>x{item.quantity}</span>
                                    <i 
                                        className="bi bi-trash remove-btn"
                                        onClick={() => removeFromCart(item.name)}
                                    ></i>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="cart-total">
                        Total: <span id="cartTotal">${cartTotal.toLocaleString()}</span>
                    </div>
                    <Link to="/form_agenda">
                        <button id="agendarBtn">Agendar</button>
                    </Link>
                </div>

                {/* BOTÓN FLOTANTE DEL CARRITO */}
                <div id="cartToggle" onClick={() => setCartOpen(!cartOpen)}>
                    <i className="bi bi-bag"></i>
                    <span className="cart-count">{cartCount}</span>
                </div>
            </main>
        </div>
    );
}

export default Servicios_dama;