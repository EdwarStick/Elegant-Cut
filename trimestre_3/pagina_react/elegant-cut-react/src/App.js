import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Home from './Paginas/Home'
import Reseñas from './Paginas/Reseñas'
import Header from './Componentes/Header'
import Footer from './Componentes/Footer'
import Barberos from './Paginas/Barberos'
import './App.css'
import LoginForm from './Componentes/LoginForm'
import Servicios_dama from './Paginas/Servicios_dama'
import Servicios_caballero from './Paginas/Servicios_caballero'
import Form_agenda from './Paginas/Form_agenda'
import AdminPanel from './Paginas/AdminPanel'
import Pqrs from './Paginas/Pqrs'
import Perfil from './Paginas/Perfil'
import ProtectedRoute from './Componentes/ProtectedRoute'
import EjemploDB from './Paginas/EjemploDB'
import Unauthorized from './Paginas/Unauthorized'

// Importar componentes de Admin
import DashboardTab from './Componentes/DashboardTab'
import ServicesTab from './Componentes/ServicesTab'
import BarbersTab from './Componentes/BarbersTab'
import AdminsTab from './Componentes/AdminsTab'
import AppointmentsTab from './Componentes/AppointmentsTab'
import ClientsTab from './Componentes/ClientsTab'
import SettingsTab from './Componentes/SettingsTab'

// Importar componentes de Barber
import BarberPanel from './Paginas/BarberPanel'
import BarberAppointments from './Paginas/BarberAppointments'
import BarberSettings from './Paginas/BarberSettings'

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

        <Route
          path="/barber"
          element={
            <ProtectedRoute requiredRole="barber">
              <BarberPanel />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/barber/appointments" replace />} />
          <Route path="appointments" element={<BarberAppointments />} />
          <Route path="configuracion" element={<BarberSettings />} />
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
              <Route path="/Pqrs" element={<Pqrs />} />
              <Route path="/ejemplo-db" element={<EjemploDB />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
            <Footer />
          </>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App