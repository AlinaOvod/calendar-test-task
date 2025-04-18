import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppWithContext } from './AppWithContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithContext />
  </StrictMode>,
)
