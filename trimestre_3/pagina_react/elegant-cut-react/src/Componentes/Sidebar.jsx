import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../Estilos/Sidebar.css';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const navigate = useNavigate();
  import { AuthClient } from '../Utilidades/authClient';

  const Sidebar = ({ isOpen, closeSidebar }) => {
    const navigate = useNavigate();
    const user = AuthClient.getUser() || {};

    const handleLogout = () => {
      AuthClient.logout();
      navigate('/login');
    };

    const menuItems = [
      { id: 'dashboard', icon: 'bi-speedometer2', label: 'Dashboard', path: '/admin/dashboard' },
      { id: 'citas', icon: 'bi-calendar-check', label: 'Citas', path: '/admin/citas' },
      { id: 'clientes', icon: 'bi-people', label: 'Clientes', path: '/admin/clientes' },
      { id: 'barberos', icon: 'bi-scissors', label: 'Barberos', path: '/admin/barberos' },
      { id: 'administradores', icon: 'bi-shield-lock', label: 'Administradores', path: '/admin/administradores' },
      { id: 'servicios', icon: 'bi-grid', label: 'Servicios', path: '/admin/servicios' },
      { id: 'configuracion', icon: 'bi-gear', label: 'Configuración', path: '/admin/configuracion' },
    ];

    return (
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div className="logo-container">
              <i className="bi bi-scissors text-primary fs-2"></i>
              <h3 className="ms-2 mb-0">Elegant Cut</h3>
            </div>
            <button className="btn-close-sidebar d-md-none" onClick={closeSidebar}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          <p className="text-muted small mt-2">Panel de Administración</p>
        </div>

        <div className="user-profile mb-4 px-3">
          <div className="d-flex align-items-center p-2 bg-light rounded">
            <div className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="ms-2 overflow-hidden">
              <h6 className="mb-0 text-truncate">{user.name || 'Admin'}</h6>
              <small className="text-muted">Administrador</small>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => window.innerWidth < 768 && closeSidebar()} // Close menu on selection on mobile
            >
              <i className={`bi ${item.icon} me-3`}></i>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer mt-auto p-3">
          <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i>
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  };

  export default Sidebar;