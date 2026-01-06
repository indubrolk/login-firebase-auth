import { useState } from "react";
import TransferModal from "../transfer-modal/TransferModal";

export default function TransferDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  const mockUser = {
    email: "user@example.com",
    displayName: "John Doe",
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1>Transfer Modal Demo</h1>
        <p style={{ color: "#6b7280", marginBottom: "20px" }}>
          Click the button below to open the transfer modal
        </p>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={is2FAEnabled}
              onChange={(e) => setIs2FAEnabled(e.target.checked)}
            />
            <span>Enable 2FA (OTP verification)</span>
          </label>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: "12px 32px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Open Transfer Modal
        </button>
      </div>

      <div style={{ background: "#f9fafb", padding: "24px", borderRadius: "8px", marginTop: "40px" }}>
        <h2 style={{ marginTop: 0 }}>Component Features:</h2>
        <ul style={{ lineHeight: "1.8" }}>
          <li><strong>From Account Section:</strong> Select source account with balance display</li>
          <li><strong>To Account Section:</strong> Enter recipient details with validation</li>
          <li><strong>Amount Section:</strong> Enter transfer amount with currency selection</li>
          <li><strong>Remarks Section:</strong> Optional notes for the transaction</li>
          <li><strong>Transfer Type:</strong> Choose immediate, scheduled, or recurring transfers</li>
          <li><strong>Security Verification:</strong> OTP authentication when 2FA is enabled</li>
          <li><strong>Confirmation Review:</strong> Review all details before confirming</li>
          <li><strong>Post-Transfer Feedback:</strong> Success/failure message with receipt download</li>
        </ul>

        <h3>Test Credentials:</h3>
        <ul style={{ lineHeight: "1.8" }}>
          <li><strong>OTP Code:</strong> 123456 (for testing)</li>
          <li><strong>Mock Accounts:</strong> 3 accounts with different balances pre-loaded</li>
          <li><strong>Success Rate:</strong> 90% (simulated)</li>
        </ul>
      </div>

      <TransferModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={mockUser}
        is2FAEnabled={is2FAEnabled}
      />
    </div>
  );
}
