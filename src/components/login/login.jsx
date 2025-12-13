import { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  getMultiFactorResolver,
  RecaptchaVerifier,
} from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });
  const [mfaStep, setMfaStep] = useState({
    resolver: null,
    verificationId: "",
    code: "",
    phoneHint: "",
  });
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

  const getRecaptchaVerifier = () => {
    if (window.loginRecaptchaVerifier) {
      return window.loginRecaptchaVerifier;
    }
    window.loginRecaptchaVerifier = new RecaptchaVerifier(auth, "login-mfa-recaptcha", {
      size: "invisible",
    });
    window.loginRecaptchaVerifier.render();
    return window.loginRecaptchaVerifier;
  };

  const sendMfaCode = async (resolver) => {
    const hint = resolver?.hints?.[0];
    if (!hint) {
      throw new Error("No phone factor available for MFA.");
    }

    const verifier = getRecaptchaVerifier();
    const phoneProvider = new PhoneAuthProvider(auth);
    const verificationId = await phoneProvider.verifyPhoneNumber(
      { multiFactorHint: hint, session: resolver.session },
      verifier
    );
    setMfaStep({
      resolver,
      verificationId,
      code: "",
      phoneHint: hint.phoneNumber || "Phone",
    });
    setStatus({ loading: false, error: "", success: "Verification code sent." });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: "", success: "" });

    try {
      if (!form.email) {
        setStatus({ loading: false, error: "Enter your email.", success: "" });
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

      setStatus({
        loading: false,
        error: "",
        success: "Login successful. Redirecting...",
      });
      setTimeout(() => navigate("/dashboard", { replace: true }), 200);
    } catch (error) {
      if (error?.code === "auth/multi-factor-auth-required") {
        try {
          const resolver = getMultiFactorResolver(auth, error);
          await sendMfaCode(resolver);
        } catch (mfaError) {
          setStatus({ loading: false, error: mfaError.message, success: "" });
        }
        return;
      }
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

  const handleMfaSubmit = async (event) => {
    event.preventDefault();
    if (!mfaStep.verificationId || !mfaStep.code || !mfaStep.resolver) {
      setStatus((prev) => ({ ...prev, error: "Enter the verification code sent to your phone." }));
      return;
    }

    setStatus({ loading: true, error: "", success: "" });
    try {
      const credential = PhoneAuthProvider.credential(mfaStep.verificationId, mfaStep.code);
      const assertion = PhoneMultiFactorGenerator.assertion(credential);
      await mfaStep.resolver.resolveSignIn(assertion);
      setStatus({ loading: false, error: "", success: "Login successful. Redirecting..." });
      setTimeout(() => navigate("/dashboard", { replace: true }), 200);
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: "" });
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome back</h2>
          <p>Sign in to continue to your dashboard.</p>
        </div>

        {mfaStep.resolver ? (
          <form onSubmit={handleMfaSubmit} className="login-form">
            <p className="success-text">Enter the code sent to {mfaStep.phoneHint}.</p>
            <label>
              <span>Verification Code</span>
              <input
                type="text"
                name="code"
                value={mfaStep.code}
                onChange={(event) => setMfaStep((prev) => ({ ...prev, code: event.target.value }))}
                inputMode="numeric"
                autoComplete="one-time-code"
                required
              />
            </label>
            <button type="submit" disabled={status.loading}>
              {status.loading ? "Verifying..." : "Verify & Sign In"}
            </button>
          </form>
        ) : (
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
        )}

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
        <div id="login-mfa-recaptcha" />
      </div>
    </div>
  );
}
