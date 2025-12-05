import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../Componentes/Sidebar';
import AdminHeader from '../Componentes/AdminHeader';
import '../Estilos/AdminPanel.css';

const AdminPanel = () => {
  const location = useLocation();

  console.log('🎯 AdminPanel rendering, location:', location.pathname);

  return (
    <div className="admin-panel">
      <Sidebar />
      <div className="admin-content">
        <AdminHeader />
        <div className="admin-main">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;