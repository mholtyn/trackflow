import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './client/setupClientAuth'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
