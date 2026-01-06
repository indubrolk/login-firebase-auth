import { useState, useEffect } from "react";

export default function SecuritySection({ is2FAEnabled, otpCode, onUpdateOtp, onVerified, onBack }) {
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOtp = () => {
    // Simulate sending OTP
    setOtpSent(true);
    setCountdown(60);
    setError("");
    console.log("OTP sent to registered mobile/email");
  };

  const handleVerifyOtp = () => {
    setVerifying(true);
    setError("");

    // Simulate OTP verification
    setTimeout(() => {
      if (otpCode === "123456" || otpCode.length === 6) {
        onVerified();
      } else {
        setError("Invalid OTP. Please try again.");
      }
      setVerifying(false);
    }, 1000);
  };

  return (
    <div className="security-section">
      <h3>Security Verification</h3>
      
      <div className="info-box warning">
        <p>🔒 This transaction requires authentication to ensure security.</p>
        <p className="info-subtext">
          Transaction limit: USD 10,000 per transfer | Daily limit: USD 50,000
        </p>
      </div>

      <div className="form-section">
        {!otpSent ? (
          <div className="otp-request">
            <p>We'll send a verification code to your registered mobile number/email.</p>
            <button className="btn-primary" onClick={handleSendOtp}>
              Send OTP
            </button>
          </div>
        ) : (
          <div className="otp-verification">
            <div className="form-group">
              <label htmlFor="otp-code">Enter OTP Code</label>
              <input
                type="text"
                id="otp-code"
                className={`form-input otp-input ${error ? "error" : ""}`}
                placeholder="000000"
                maxLength="6"
                value={otpCode}
                onChange={(e) => {
                  onUpdateOtp(e.target.value.replace(/\D/g, ""));
                  setError("");
                }}
                autoFocus
              />
              {error && <span className="error-message">{error}</span>}
            </div>

            <div className="otp-actions">
              {countdown > 0 ? (
                <p className="resend-timer">Resend OTP in {countdown}s</p>
              ) : (
                <button className="btn-link" onClick={handleSendOtp}>
                  Resend OTP
                </button>
              )}
            </div>

            <p className="info-text small">
              Hint: Use "123456" for testing purposes
            </p>
          </div>
        )}
      </div>

      <div className="modal-actions">
        <button className="btn-secondary" onClick={onBack}>
          Back
        </button>
        {otpSent && (
          <button
            className="btn-primary"
            onClick={handleVerifyOtp}
            disabled={otpCode.length !== 6 || verifying}
          >
            {verifying ? "Verifying..." : "Verify & Continue"}
          </button>
        )}
      </div>
    </div>
  );
}
