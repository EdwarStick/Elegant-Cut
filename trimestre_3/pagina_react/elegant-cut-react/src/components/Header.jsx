import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
    //creamos la variable 
    const [menuOpen, setMenuOpen] = useState(false);
    
    //sirve para abrir/cerrar el menú
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    //funcion para solo cerrar el menú
    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <div>
            <header>
                {/* Logo y nombre de la marca */}
                <div className="brand-container">
                    <div className="logo">
                        <img 
                            src={`${process.env.PUBLIC_URL}/assets/images/logo.png`} 
                            alt="ElegantCut Barbería" 
                            className="logo-img" 
                        />
                    </div>
                    <div className="brand-name">
                        <span className="brand-text">ELEGANTCUT</span>
                    </div>
                </div>

                {/* Contenedor de íconos visible en escritorio */}
                <div className="button-container desktop-icons">
                    <Link to="/" className="button nav-button" aria-label="Inicio">
                        <i className="bi bi-house-door"></i>
                        <span className="nav-label">Inicio</span>
                    </Link>
                    <Link to="/Reseñas" className="button nav-button" aria-label="Reseñas">
                        <i className="bi bi-star"></i>
                        <span className="nav-label">Reseñas</span>
                    </Link>
                    <Link to="/profile" className="button nav-button" aria-label="Perfil">
                        <i className="bi bi-person"></i>
                        <span className="nav-label">Perfil</span>
                    </Link>
                    <Link to="/services" className="button nav-button" aria-label="Servicios">
                        <i className="bi bi-scissors"></i>
                        <span className="nav-label">Servicios</span>
                    </Link>
                    <Link to="/Barberos" className="button nav-button" aria-label="Barberos">
                        <i className="bi bi-person-badge"></i>
                        <span className="nav-label">Barberos</span>
                    </Link>
                </div>

                {/* Botón abrir menú hamburguesa - AÑADIR ONCLICK AQUÍ */}
                <button 
                    id="abrir" 
                    className="abrir-menu" 
                    aria-label="Abrir menú"
                    onClick={toggleMenu} 
                >
                    <i className="bi bi-list"></i>
                </button>

                {/* Menú hamburguesa - AÑADIR CLASE DINÁMICA AQUÍ */}
                <nav className={`nav ${menuOpen ? 'visible' : ''}`} id="nav">
                    {/* Botón cerrar - AÑADIR ONCLICK AQUÍ */}
                    <button 
                        id="cerrar" 
                        className="cerrar-menu" 
                        aria-label="Cerrar menú"
                        onClick={closeMenu}  
                    >
                        <i className="bi bi-x"></i>
                    </button>

                    {/* Logo en menú hamburguesa */}
                    <div className="mobile-brand">
                        <img 
                            src={`${process.env.PUBLIC_URL}/assets/images/logo.png`} 
                            alt="ElegantCut Barbería" 
                            className="mobile-logo" 
                        />
                        <span className="mobile-brand-text">ELEGANTCUT</span>
                    </div>

                    {/* Íconos del menú hamburguesa - AÑADIR ONCLICK A LOS LINKS */}
                    <div className="menu-icons-container">
                        <Link to="/" className="button menu-nav-button" onClick={closeMenu}>
                            <i className="bi bi-house-door"></i>
                            <span className="menu-nav-label">Inicio</span>
                        </Link>
                        <Link to="/Reseñas" className="button menu-nav-button" onClick={closeMenu}>
                            <i className="bi bi-star"></i>
                            <span className="menu-nav-label">Reseñas</span>
                        </Link>
                        <Link to="/profile" className="button menu-nav-button" onClick={closeMenu}>
                            <i className="bi bi-person"></i>
                            <span className="menu-nav-label">Mi Perfil</span>
                        </Link>
                        <Link to="/services" className="button menu-nav-button" onClick={closeMenu}>
                            <i className="bi bi-scissors"></i>
                            <span className="menu-nav-label">Servicios</span>
                        </Link>
                        <Link to="/Barberos" className="button menu-nav-button" onClick={closeMenu}>
                            <i className="bi bi-person-badge"></i>
                            <span className="menu-nav-label">Barberos</span>
                        </Link>
                    </div>
                </nav>
            </header>
        </div>
    );
}

export default Header;