import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS SIN HEADER/FOOTER */}
        <Route path="/login" element={<LoginForm />} />

        {/* RUTA ADMIN PROTEGIDA - CAMBIA ESTA LÍNEA */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminPanel />
          </ProtectedRoute>
        } />

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
            </Routes>
            <Footer />
          </>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App