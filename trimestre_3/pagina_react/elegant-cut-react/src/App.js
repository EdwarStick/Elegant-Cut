import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import AppointmentsTab from './Componentes/AppointmentsTab'
import ClientsTab from './Componentes/ClientsTab'
import SettingsTab from './Componentes/SettingsTab'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPanel />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardTab />} />
          <Route path="citas" element={<AppointmentsTab />} />
          <Route path="clientes" element={<ClientsTab />} />
          <Route path="barberos" element={<BarbersTab />} />
          <Route path="administradores" element={<AdminsTab />} />
          <Route path="servicios" element={<ServicesTab />} />
          <Route path="configuracion" element={<SettingsTab />} />
        </Route>

        <Route path="/*" element={
          <>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/barberos" element={<Barberos />} />
              <Route path="/reseñas" element={<Reseñas />} />
              <Route path="/Servicios_dama" element={<Servicios_dama />} />
              <Route path="/Servicios_caballero" element={<Servicios_caballero />} />
              <Route path="/Form_agenda" element={<Form_agenda />} />
              <Route path="/Form_agenda" element={<Form_agenda />} />
              <Route path="/Pqrs" element={<Pqrs />} />
              <Route path="/ejemplo-db" element={<EjemploDB />} /> {/* Ruta de prueba */}
              <Route path="/perfil" element={<Perfil />} />
            </Routes>
            <Footer />
          </>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App