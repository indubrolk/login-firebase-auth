import { useEffect, useMemo, useState } from "react";
import "./profile-page.css";
import { useAuth } from "../../context/AuthContext";
import { auth } from "../../firebase/firebase";
import { multiFactor, PhoneAuthProvider, PhoneMultiFactorGenerator, RecaptchaVerifier } from "firebase/auth";

const ProfilePage = () => {
  const { user, signOutUser } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });
  const [enrolledFactors, setEnrolledFactors] = useState(user?.multiFactor?.enrolledFactors || []);

  useEffect(() => {
    setEnrolledFactors(user?.multiFactor?.enrolledFactors || []);
  }, [user]);

  const friendlyEmail = useMemo(() => user?.email || "N/A", [user]);
  const friendlyName = useMemo(() => user?.displayName || "N/A", [user]);

  const refreshFactors = async () => {
    // Reload the user to pull the latest enrolled MFA factors.
    await auth.currentUser?.reload();
    setEnrolledFactors(auth.currentUser?.multiFactor?.enrolledFactors || []);
  };

  const getRecaptchaVerifier = () => {
    // Reuse an invisible reCAPTCHA verifier for MFA enrollment.
    if (window.profileMfaRecaptchaVerifier) {
      return window.profileMfaRecaptchaVerifier;
    }
    window.profileMfaRecaptchaVerifier = new RecaptchaVerifier(auth, "profile-mfa-recaptcha", {
      size: "invisible",
    });
    window.profileMfaRecaptchaVerifier.render();
    return window.profileMfaRecaptchaVerifier;
  };

  const handleEnrollPhone = async (event) => {
    event.preventDefault();
    if (!phoneNumber.trim()) {
      setStatus({ loading: false, error: "Enter a phone number with country code (e.g. +1...)", success: "" });
      return;
    }

    setStatus({ loading: true, error: "", success: "" });
    try {
      // Start phone MFA enrollment by sending an SMS code.
      const verifier = getRecaptchaVerifier();
      const mfaUser = multiFactor(auth.currentUser);
      const session = await mfaUser.getSession();
      const provider = new PhoneAuthProvider(auth);
      const id = await provider.verifyPhoneNumber({ phoneNumber: phoneNumber.trim(), session }, verifier);
      setVerificationId(id);
      setStatus({ loading: false, error: "", success: "SMS sent. Enter the code to finish enrollment." });
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: "" });
    }
  };

  const handleConfirmEnroll = async (event) => {
    event.preventDefault();
    if (!verificationId || !verificationCode.trim()) {
      setStatus((prev) => ({ ...prev, error: "Enter the code we sent to your phone." }));
      return;
    }
    setStatus({ loading: true, error: "", success: "" });
    try {
      // Confirm the SMS code and enroll the phone factor.
      const cred = PhoneAuthProvider.credential(verificationId, verificationCode.trim());
      const assertion = PhoneMultiFactorGenerator.assertion(cred);
      await multiFactor(auth.currentUser).enroll(assertion, "Phone");
      await refreshFactors();
      setPhoneNumber("");
      setVerificationCode("");
      setVerificationId("");
      setStatus({ loading: false, error: "", success: "Phone number added for 2FA." });
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: "" });
    }
  };

  const handleRemoveFactor = async (factorUid) => {
    setStatus({ loading: true, error: "", success: "" });
    try {
      await multiFactor(auth.currentUser).unenroll(factorUid);
      await refreshFactors();
      setStatus({ loading: false, error: "", success: "2FA factor removed." });
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: "" });
    }
  };

  return (
    <div className="profile-page">
      <h1>User Profile</h1>

      <div className="profile-section">
        <h2>Personal Information</h2>
        <div className="info-item">
          <label>Name:</label>
          <span>{friendlyName}</span>
        </div>
        <div className="info-item">
          <label>Email:</label>
          <span>{friendlyEmail}</span>
        </div>
      </div>

      <div className="profile-section">
        <h2>Security & Settings</h2>
        <div className="info-item">
          <label>2FA Status:</label>
          <span>{enrolledFactors.length ? "Enabled" : "Disabled"}</span>
        </div>
        {enrolledFactors.length > 0 && (
          <div className="factor-list">
            {enrolledFactors.map((factor) => (
              <div key={factor.uid} className="factor-row">
                <span>{factor.displayName || factor.phoneNumber || "Phone"}</span>
                <button
                  className="action-button danger"
                  onClick={() => handleRemoveFactor(factor.uid)}
                  disabled={status.loading}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <form className="mfa-form" onSubmit={verificationId ? handleConfirmEnroll : handleEnrollPhone}>
          <label className="mfa-label">
            <span>Phone number (with country code)</span>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="+1 555 123 4567"
              required
            />
          </label>

          {verificationId && (
            <label className="mfa-label">
              <span>Verification code</span>
              <input
                type="text"
                value={verificationCode}
                onChange={(event) => setVerificationCode(event.target.value)}
                inputMode="numeric"
                autoComplete="one-time-code"
                required
              />
            </label>
          )}

          <button type="submit" className="action-button" disabled={status.loading}>
            {status.loading
              ? "Working..."
              : verificationId
                ? "Confirm & Enable 2FA"
                : "Send Verification SMS"}
          </button>
        </form>

        {status.error && <p className="error-text">{status.error}</p>}
        {status.success && <p className="success-text">{status.success}</p>}
        <div id="profile-mfa-recaptcha" />
      </div>

      <div className="profile-section">
        <h2>Session</h2>
        <button className="action-button" onClick={signOutUser}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
