import React from 'react';
import { Outlet } from 'react-router-dom';
import BarberSidebar from '../Componentes/BarberSidebar';

const BarberPanel = () => {
    return (
        <div className="barber-panel-container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <BarberSidebar />
            <div className="barber-content" style={{ flex: 1, padding: '2rem' }}>
                <Outlet />
            </div>
        </div>
    );
};

export default BarberPanel;
