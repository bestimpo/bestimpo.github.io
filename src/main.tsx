import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from '@/App'
import '@/index.css'

// HashRouter, not BrowserRouter: GitHub Pages serves static files only, so a
// deep link like /shop would 404 on refresh. Hash routes never hit the server.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
