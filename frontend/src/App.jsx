import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import MenuManagement from './pages/MenuManagement'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MenuForm from './components/Menu/MenuForm'

function App() {
  

  return (
    
      <BrowserRouter>
        <Routes>
          <Route path="/menu" element={<MenuManagement />} />
          <Route path="/menu/add" element={MenuForm}></Route>
          <Route path="/" element={<Navigate to="/menu" replace />} /> 
        </Routes>
      
      </BrowserRouter>
    
  )
}

export default App



