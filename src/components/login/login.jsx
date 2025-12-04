import { useState } from "react";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { app } from "../firebase/firebase";
import { Link } from "react-router-dom";

const auth = getAuth(app);

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: "", success: "" });

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      setStatus({ loading: false, error: "", success: "Login successful!" });
      setForm({ email: "", password: "" });
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: "" });
    }
  };

  const handleForgotPassword = async () => {
    if (!form.email) {
      setStatus({ ...status, error: "Enter your email to reset password." });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, form.email);
      setStatus({ ...status, success: "Password reset email sent!" });
    } catch (error) {
      setStatus({ ...status, error: error.message });
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
        </label>

        <button type="submit" disabled={status.loading}>
          {status.loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {status.error && <p className="error-text">{status.error}</p>}
      {status.success && <p className="success-text">{status.success}</p>}

      <p className="forgot-text" onClick={handleForgotPassword} style={{ cursor: "pointer", color: "blue" }}>
        Forgot Password?
      </p>

      <p>
        Don't have an account?{" "}
        <Link to="/signup" style={{ color: "blue" }}>
          Sign Up
        </Link>
      </p>
    </div>
  );
}
