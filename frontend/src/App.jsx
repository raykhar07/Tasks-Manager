import {BrowserRouter, Routes, Route, useLocation} from 'react-router-dom'
import {LoginPage} from './pages/LoginPage.jsx'
import {RegisterPage} from './pages/RegisterPage.jsx'
import {AuthProvider} from './context/AuthContext.provider.jsx'
import {TasksPage} from './pages/TasksPage.jsx'
import {TasksFormPage} from './pages/TasksFormPage.jsx'
import {HomePage} from './pages/HomePage.jsx'
import {ProfilePage} from './pages/ProfilePage.jsx'
import {ProtectedRoute} from './components/ProtectedRoute.jsx'
import {TaskContextProvider} from './context/TaskContext.Provider.jsx'
import { Navbar } from './components/Navbar.jsx'

// La clave (key) es la ruta: al cambiar de pestaña se monta un contenedor
// nuevo, y la animación de entrada del <main> se vuelve a disparar.
const AnimatedRoutes = () => {
  const location = useLocation()

  return (
    <div key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/add-task" element={<TasksFormPage />} />
        <Route path="/tasks/:id" element={<TasksFormPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<h1 className="py-16 text-center text-2xl tracking-tight text-ink">404 — Página no encontrada</h1>} />
      </Routes>
    </div>
  )
}

export const App = () => {
  return (
    <AuthProvider>
      <TaskContextProvider>
        <BrowserRouter>
          <main className="stagger container mx-auto px-6 pb-16 sm:px-10">
            <Navbar/>
            <AnimatedRoutes />
          </main>
      </BrowserRouter>
      </TaskContextProvider>
    </AuthProvider>
  )
}
