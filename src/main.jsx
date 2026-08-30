/**
 * Application entry point.
 * Mounts the React application onto the DOM inside React StrictMode,
 * wrapped in a BrowserRouter to enable client-side routing via react-router-dom.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import "flag-icons/css/flag-icons.min.css";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)