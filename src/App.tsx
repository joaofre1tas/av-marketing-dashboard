import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ContentManager from './pages/ContentManager'
import CalendarPage from './pages/CalendarPage'
import Competitors from './pages/Competitors'
import NotFound from './pages/NotFound'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/analise" replace />} />
          <Route path="/analise" element={<Dashboard />} />
          <Route path="/conteudo" element={<ContentManager />} />
          <Route path="/calendario" element={<CalendarPage />} />
          <Route path="/monitoramento" element={<Competitors />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
