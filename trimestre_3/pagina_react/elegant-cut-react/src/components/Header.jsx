import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth.js';

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        closeMenu();
        navigate('/');
    };

    const handleLogin = () => {
        closeMenu();
        navigate('/login');
    };

    const handleProfile = () => {
        closeMenu();
        if (isAuthenticated) {
            navigate('/profile');
        } else {
            navigate('/login');
        }
    };

    // Desactivar scroll cuando menú está abierto
    useEffect(() => {
        if (menuOpen) {
            document.body.classList.add('menu-open');
            document.body.style.overflow = "hidden";
        } else {
            document.body.classList.remove('menu-open');
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.classList.remove('menu-open');
            document.body.style.overflow = "auto";
        };
    }, [menuOpen]);

    return (
        <div>
            {/* Header que se oculta cuando el menú está abierto */}
            <header className={menuOpen ? "header-hidden" : ""}>

                {/* Logo principal */}
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

                {/* Íconos en escritorio */}
                <div className="button-container desktop-icons">
                    <Link to="/" className="button nav-button">
                        <i className="bi bi-house-door"></i>
                        <span className="nav-label">Inicio</span>
                    </Link>
                    <Link to="/Reseñas" className="button nav-button">
                        <i className="bi bi-star"></i>
                        <span className="nav-label">Reseñas</span>
                    </Link>
                    <button 
                        className="button nav-button"
                        onClick={handleProfile}
                    >
                        <i className="bi bi-person"></i>
                        <span className="nav-label">
                            {isAuthenticated ? 'Mi Perfil' : 'Perfil'}
                        </span>
                    </button>
                    <Link to="/Servicios_dama" className="button nav-button">
                        <i className="bi bi-scissors"></i>
                        <span className="nav-label">Servicios</span>
                    </Link>
                    <Link to="/Barberos" className="button nav-button">
                        <i className="bi bi-person-badge"></i>
                        <span className="nav-label">Barberos</span>
                    </Link>

                    {/* Autenticación en escritorio */}
                    {isAuthenticated ? (
                        <div className="user-info-desktop">
                            <span className="user-welcome">
                                Hola, {user?.name}
                            </span>
                            <button
                                className="button logout-button"
                                onClick={handleLogout}
                            >
                                <i className="bi bi-box-arrow-right"></i>
                                <span className="nav-label">Salir</span>
                            </button>
                        </div>
                    ) : (
                        <button
                            className="button login-button"
                            onClick={handleLogin}
                        >
                            <i className="bi bi-box-arrow-in-right"></i>
                            <span className="nav-label">Ingresar</span>
                        </button>
                    )}
                </div>

                {/* Botón hamburguesa */}
                <button 
                    id="abrir" 
                    className="abrir-menu" 
                    aria-label="Abrir menú"
                    onClick={toggleMenu} 
                >
                    <i className="bi bi-list"></i>
                </button>
            </header>

            {/* Menú móvil */}
            <nav className={`nav ${menuOpen ? 'visible' : ''}`} id="nav">
                {/* Botón cerrar */}
                <button 
                    id="cerrar" 
                    className="cerrar-menu" 
                    aria-label="Cerrar menú"
                    onClick={closeMenu}
                >
                    <i className="bi bi-x"></i>
                </button>

                {/* Logo móvil pequeño - ORGANIZADO AL PRINCIPIO */}
                <div className="mobile-brand">
                    <img 
                        src={`${process.env.PUBLIC_URL}/assets/images/logo.png`} 
                        alt="ElegantCut Barbería" 
                        className="mobile-logo-small"
                    />
                    <div className="mobile-brand-text">ELEGANTCUT</div>
                    <div className="mobile-slogan">Barbería & Estilo</div>
                </div>

                {/* Botones del menú */}
                <div className="menu-icons-container">
                    <Link to="/" className="button menu-nav-button" onClick={closeMenu}>
                        <i className="bi bi-house-door"></i>
                        <span className="menu-nav-label">Inicio</span>
                    </Link>
                    <Link to="/Reseñas" className="button menu-nav-button" onClick={closeMenu}>
                        <i className="bi bi-star"></i>
                        <span className="menu-nav-label">Reseñas</span>
                    </Link>
                    <button 
                        className="button menu-nav-button"
                        onClick={handleProfile}
                    >
                        <i className="bi bi-person"></i>
                        <span className="menu-nav-label">
                            {isAuthenticated ? 'Mi Perfil' : 'Iniciar Sesión'}
                        </span>
                    </button>
                    <Link to="/Servicios_dama" className="button menu-nav-button" onClick={closeMenu}>
                        <i className="bi bi-scissors"></i>
                        <span className="menu-nav-label">Servicios</span>
                    </Link>
                    <Link to="/Barberos" className="button menu-nav-button" onClick={closeMenu}>
                        <i className="bi bi-person-badge"></i>
                        <span className="menu-nav-label">Barberos</span>
                    </Link>

                    {/* Botón salir / login */}
                    {isAuthenticated ? (
                        <button 
                            className="button menu-nav-button logout-mobile"
                            onClick={handleLogout}
                        >
                            <i className="bi bi-box-arrow-right"></i>
                            <span className="menu-nav-label">Cerrar Sesión</span>
                        </button>
                    ) : (
                        <button 
                            className="button menu-nav-button login-mobile"
                            onClick={handleLogin}
                        >
                            <i className="bi bi-box-arrow-in-right"></i>
                            <span className="menu-nav-label">Iniciar Sesión</span>
                        </button>
                    )}

                    {/* Info del usuario al fondo */}
                    {isAuthenticated && (
                        <div className="user-info-mobile">
                            <div className="user-avatar">
                                <i className="bi bi-person-circle"></i>
                            </div>
                            <div className="user-details">
                                <span className="user-name">{user?.name}</span>
                                <span className="user-role">{user?.role}</span>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
}

export default Header;