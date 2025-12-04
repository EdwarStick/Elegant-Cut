import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Reseñas from './pages/Reseñas'
import Header from './components/Header'
import Footer from './components/Footer'
import Barberos from './pages/Barberos'
import './App.css'
import LoginForm from './components/LoginForm'
import Servicios_dama from './pages/Servicios_dama'
import Servicios_caballero from './pages/Servicios_caballero'
import Form_agenda from './pages/Form_agenda'
import AdminPanel from './pages/AdminPanel'
import Pqrs from './pages/Pqrs'
import ProtectedRoute from './components/ProtectedRoute'
import EjemploDB from './pages/EjemploDB' // Importamos la página de prueba
import Perfil from './pages/Perfil'

// Importar componentes de Admin
import DashboardTab from './components/DashboardTab'
import ServicesTab from './components/ServicesTab'
import BarbersTab from './components/BarbersTab'
import AdminsTab from './components/AdminsTab'
import AppointmentsTab from './components/AppointmentsTab'
import ClientsTab from './components/ClientsTab'
import SettingsTab from './components/SettingsTab'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS SIN HEADER/FOOTER */}
        <Route path="/login" element={<LoginForm />} />

        {/* RUTAS ADMIN PROTEGIDAS CON NESTED ROUTES */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminPanel />
          </ProtectedRoute>
        }>
          {/* Redirigir /admin a /admin/dashboard */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardTab />} />
          <Route path="citas" element={<AppointmentsTab />} />
          <Route path="clientes" element={<ClientsTab />} />
          <Route path="barberos" element={<BarbersTab />} />
          <Route path="administradores" element={<AdminsTab />} />
          <Route path="servicios" element={<ServicesTab />} />
          <Route path="configuracion" element={<SettingsTab />} />
        </Route>

        {/* RUTAS CON HEADER/FOOTER */}
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