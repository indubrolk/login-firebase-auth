import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import SignUp from './components/sign-up/sign-up'
import Login from './components/login/login'
import Dashboard from './components/dashboard/dashboard'
import { useAuth } from './context/AuthContext'

function ProtectedRoute({ children }) {
  const { user, initializing } = useAuth()

  if (initializing) {
    return <div className="page-loading">Checking session...</div>
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
