import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Reseñas from './pages/Reseñas'
import Header from './components/Header'
import Footer from './components/Footer'
import Barberos from './pages/Barberos'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>        {/* Ruta principal */}
        <Route path='/home' element={<Home/>}/>    {/* Alternativa */}
        <Route path='/Barberos' element={<Barberos/>}/>
        <Route path='/reseñas' element={<Reseñas/>}/>
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}

export default App