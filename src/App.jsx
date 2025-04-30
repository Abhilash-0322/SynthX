import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter } from 'react-router-dom';
import SynthX from './pages/Synth';

function App() {
  

  return (
    <>
      <BrowserRouter>
        <SynthX/>
      </BrowserRouter>
    </>
  )
}

export default App
