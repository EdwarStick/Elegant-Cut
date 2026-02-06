import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, LogOut, User, Settings } from 'lucide-react';
import { AuthClient } from '../Utilidades/authClient';

const BarberSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = AuthClient.getUser();

    const handleLogout = () => {
        AuthClient.logout();
        navigate('/login');
    };

    const menuItems = [
        { path: '/barber/appointments', icon: Calendar, label: 'Mis Citas' },
        { path: '/barber/configuracion', icon: Settings, label: 'Configuración' },
    ];

    return (
        <div style={{
            width: '250px',
            backgroundColor: '#2c3e50',
            color: 'white',
            padding: '2rem 1rem',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Elegant Cut
                </h2>
                <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>Panel del Barbero</p>
            </div>

            <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <User size={20} />
                    <span style={{ fontWeight: 'bold' }}>{user?.name || 'Barbero'}</span>
                </div>
                <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>Barbero Profesional</p>
            </div>

            <nav style={{ flex: 1 }}>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem 1rem',
                                marginBottom: '0.5rem',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                color: 'white',
                                backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <button
                onClick={handleLogout}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c0392b'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e74c3c'}
            >
                <LogOut size={20} />
                <span>Cerrar Sesión</span>
            </button>
        </div>
    );
};

export default BarberSidebar;
