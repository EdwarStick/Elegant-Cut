import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Reseñas from './pages/Reseñas'
import Header from './components/Header'
import Footer from './components/Footer'
import Barberos from './pages/Barberos'
import './App.css'
import LoginForm from './components/LoginForm'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS SIN HEADER/FOOTER */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/admin" element={<div>Página Admin - Sin Header/Footer</div>} />
        
        {/* RUTAS CON HEADER/FOOTER */}
        <Route path="/*" element={
          <>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/barberos" element={<Barberos />} />
              <Route path="/reseñas" element={<Reseñas />} />
            </Routes>
            <Footer />
          </>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App