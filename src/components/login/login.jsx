import { useEffect, useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "", phone: "", otp: "" });
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });
  const [phoneStatus, setPhoneStatus] = useState({ sending: false, error: "", success: "" });
  const [phoneStep, setPhoneStep] = useState("idle");
  const { user, initializing, setPhoneVerified, phoneVerified } = useAuth();
  const navigate = useNavigate();
  const apiBase = import.meta.env.VITE_API_BASE_URL || "";

  useEffect(() => {
    if (!initializing && user && phoneVerified) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, initializing, navigate, phoneVerified]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const maskPhone = (phone) => {
    if (!phone || phone.length < 4) return phone || "";
    const tail = phone.slice(-4);
    return `****${tail}`;
  };

  const sendPhoneOtp = async (targetPhone) => {
    setPhoneStatus({ sending: true, error: "", success: "" });
    try {
      const response = await fetch(`${apiBase}/api/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: targetPhone, channel: "sms", purpose: "login" }),
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to send OTP.");
      }
      setPhoneStep("otp-sent");
      setPhoneStatus({
        sending: false,
        error: "",
        success: `OTP sent to ${maskPhone(targetPhone)}. Enter the 6-digit code.`,
      });
    } catch (error) {
      setPhoneStatus({ sending: false, error: error.message || "Unable to send OTP.", success: "" });
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: "", success: "" });
    setPhoneStatus({ sending: false, error: "", success: "" });
    setPhoneVerified(false);

    try {
      if (!form.phone) {
        setStatus({ loading: false, error: "Enter your phone number to receive the OTP.", success: "" });
        return;
      }

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

      await sendPhoneOtp(form.phone);
      setStatus({
        loading: false,
        error: "",
        success: "Password verified. Enter the OTP to complete login.",
      });
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: "" });
    }
  };

  const handleVerifyOtp = async () => {
    if (!form.phone || !form.otp) {
      setPhoneStatus((prev) => ({
        ...prev,
        error: "Enter the OTP you received to continue.",
      }));
      return;
    }

    try {
      const response = await fetch(`${apiBase}/api/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.phone, code: form.otp, purpose: "login" }),
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Invalid OTP. Try again.");
      }

      setPhoneVerified(true);
      setPhoneStatus({ sending: false, error: "", success: "Phone verified. Redirecting..." });
      setForm({ email: "", password: "", phone: "", otp: "" });
      setTimeout(() => navigate("/dashboard", { replace: true }), 300);
    } catch (error) {
      setPhoneStatus({ sending: false, error: error.message || "Invalid OTP. Try again.", success: "" });
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
            <span>Phone</span>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              autoComplete="tel"
              placeholder="+1XXXXXXXXXX"
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

        {user && !phoneVerified && (
          <div className="otp-card">
            <p className="subtext">Complete phone verification to finish login.</p>
            <button
              type="button"
              className="secondary-btn"
              disabled={phoneStatus.sending}
              onClick={() => form.phone && sendPhoneOtp(form.phone)}
            >
              {phoneStep === "otp-sent" ? "Resend code" : "Send OTP"}
            </button>
            <label>
              <span>OTP Code</span>
              <input
                type="text"
                name="otp"
                value={form.otp}
                onChange={handleChange}
                inputMode="numeric"
                autoComplete="one-time-code"
                required
              />
            </label>
            <button type="button" disabled={phoneStatus.sending} onClick={handleVerifyOtp}>
              {phoneStatus.sending ? "Verifying..." : "Verify OTP"}
            </button>
            {phoneStatus.error && <p className="error-text">{phoneStatus.error}</p>}
            {phoneStatus.success && <p className="success-text">{phoneStatus.success}</p>}
          </div>
        )}

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
