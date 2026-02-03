import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../Componentes/Sidebar';
import AdminHeader from '../Componentes/AdminHeader';
import '../Estilos/AdminPanel.css';

const AdminPanel = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="admin-panel">
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && <div className="admin-overlay" onClick={closeSidebar}></div>}

      <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />

      <div className="admin-content">
        <AdminHeader toggleSidebar={toggleSidebar} />
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;