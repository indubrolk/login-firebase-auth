import { useEffect, useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });
  const { user, initializing } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!initializing && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, initializing, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: "", success: "" });

    try {
      const credential = await signInWithEmailAndPassword(auth, form.email, form.password);

      if (!credential.user.emailVerified) {
        await sendEmailVerification(credential.user);
        await signOut(auth);
        setStatus({
          loading: false,
          error: "",
          success: "Verification email sent. Please verify your email, then log in again.",
        });
        return;
      }

      setStatus({ loading: false, error: "", success: "Login successful!" });
      setForm({ email: "", password: "" });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: "" });
    }
  };

  const handleForgotPassword = async () => {
    if (!form.email) {
      setStatus((prev) => ({ ...prev, error: "Enter your email to reset password." }));
      return;
    }

    try {
      await sendPasswordResetEmail(auth, form.email);
      setStatus((prev) => ({ ...prev, success: "Password reset email sent!", error: "" }));
    } catch (error) {
      setStatus((prev) => ({ ...prev, error: error.message }));
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome back</h2>
          <p>Sign in to continue to your dashboard.</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <label>
            <span>Email</span>
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
            <span>Password</span>
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

        <p className="forgot-text" onClick={handleForgotPassword}>
          Forgot Password?
        </p>

        <p className="switch-auth">
          Don&apos;t have an account?{" "}
          <Link to="/signup">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
