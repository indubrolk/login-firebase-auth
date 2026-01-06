import { useState } from "react";

export default function ConfirmationSection({ transferData, onConfirm, onEdit, onCancel }) {
  const [processing, setProcessing] = useState(false);

  const calculateFee = () => {
    const amount = parseFloat(transferData.amount);
    if (amount <= 1000) return 0;
    if (amount <= 10000) return 2.5;
    return 5.0;
  };

  const fee = calculateFee();
  const totalAmount = parseFloat(transferData.amount) + fee;

  const getTransferTypeDisplay = () => {
    if (transferData.transferType === "immediate") return "Immediate";
    if (transferData.transferType === "scheduled") {
      return `Scheduled: ${transferData.scheduledDate} at ${transferData.scheduledTime}`;
    }
    if (transferData.transferType === "recurring") {
      return `Recurring: ${transferData.recurringFrequency}`;
    }
    return transferData.transferType;
  };

  const handleConfirm = () => {
    setProcessing(true);
    onConfirm();
  };

  return (
    <div className="confirmation-section">
      <h3>Review & Confirm Transfer</h3>
      
      <div className="confirmation-card">
        <div className="confirmation-group">
          <h4>From Account</h4>
          <div className="detail-row">
            <span className="detail-label">Account Type:</span>
            <span className="detail-value">{transferData.fromAccount?.type}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Account Number:</span>
            <span className="detail-value">{transferData.fromAccount?.number}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Current Balance:</span>
            <span className="detail-value">
              {transferData.currency} {transferData.fromAccount?.balance.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="confirmation-divider">→</div>

        <div className="confirmation-group">
          <h4>To Account</h4>
          <div className="detail-row">
            <span className="detail-label">Recipient Name:</span>
            <span className="detail-value">{transferData.recipientName}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Account Number:</span>
            <span className="detail-value">{transferData.toAccountNumber}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Bank:</span>
            <span className="detail-value">{transferData.bankName}</span>
          </div>
          {transferData.ifscCode && (
            <div className="detail-row">
              <span className="detail-label">IFSC/Routing:</span>
              <span className="detail-value">{transferData.ifscCode}</span>
            </div>
          )}
        </div>
      </div>

      <div className="confirmation-card">
        <div className="confirmation-group">
          <h4>Transfer Details</h4>
          <div className="detail-row">
            <span className="detail-label">Amount:</span>
            <span className="detail-value amount-highlight">
              {transferData.currency} {parseFloat(transferData.amount).toLocaleString()}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Transfer Fee:</span>
            <span className="detail-value">
              {transferData.currency} {fee.toFixed(2)}
            </span>
          </div>
          <div className="detail-row total-row">
            <span className="detail-label">Total Amount:</span>
            <span className="detail-value">
              {transferData.currency} {totalAmount.toLocaleString()}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Transfer Type:</span>
            <span className="detail-value">{getTransferTypeDisplay()}</span>
          </div>
          {transferData.remarks && (
            <div className="detail-row">
              <span className="detail-label">Remarks:</span>
              <span className="detail-value">{transferData.remarks}</span>
            </div>
          )}
        </div>
      </div>

      <div className="info-box">
        <p className="info-text">
          ⚠️ Please review all details carefully. This transaction cannot be undone once confirmed.
        </p>
      </div>

      <div className="modal-actions">
        <button className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn-outline" onClick={onEdit}>
          Edit
        </button>
        <button
          className="btn-primary"
          onClick={handleConfirm}
          disabled={processing}
        >
          {processing ? "Processing..." : "Confirm Transfer"}
        </button>
      </div>
    </div>
  );
}
