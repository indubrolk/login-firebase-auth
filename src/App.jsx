import './App.css'
import { Routes, Route } from 'react-router-dom'
import SignUp from './components/sign-up/sign-up'
import Login from './components/login/login'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  )
}

export default App
