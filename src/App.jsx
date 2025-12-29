import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import SignUp from './components/sign-up/sign-up'
import Login from './components/login/login'
import Dashboard from './components/dashboard/dashboard'
import ProfilePage from './components/profile-page/profile-page'
import { useAuth } from './context/AuthContext'

function ProtectedRoute({ children }) {
  const { user, initializing, signOutUser } = useAuth()

  if (initializing) {
    return <div className="page-loading">Checking session...</div>
  }

  if (user && !user.emailVerified) {
    // Block access until the user's email is verified.
    return (
      <div className="page-loading">
        Please verify your email from your inbox, then sign in again.
        <button className="ml-2 underline" onClick={signOutUser}>Sign out</button>
      </div>
    )
  }

  if (!user) {
    // Redirect unauthenticated users to the login screen.
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
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
