import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';
import DashboardTab from '../components/DashboardTab'; // <- Corregido
import ServicesTab from '../components/ServicesTab';   // <- Corregido  
import BarbersTab from '../components/BarbersTab';     // <- Corregido
import AppointmentsTab from '../components/AppointmentsTab'; // <- Corregido
import ClientsTab from '../components/ClientsTab';     // <- Corregido
import SettingsTab from '../components/SettingsTab';   // <- Corregido

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />; // <- Corregido
      case 'servicios':
        return <ServicesTab />;  // <- Corregido
      case 'barberos':
        return <BarbersTab />;   // <- Corregido
      case 'citas':
        return <AppointmentsTab />; // <- Corregido
      case 'clientes':
        return <ClientsTab />;   // <- Corregido
      case 'configuracion':
        return <SettingsTab />;  // <- Corregido
      default:
        return <DashboardTab />; // <- Corregido
    }
  };

  return (
    <div className="admin-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        <AdminHeader />
        {renderTabContent()}
      </main>
    </div>
  );
};

export default AdminPanel;