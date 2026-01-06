export default function PostTransferFeedback({ result, transferData, onClose, onStartNewTransfer }) {
  const handleDownloadReceipt = () => {
    // Simulate receipt download
    const receiptData = {
      transactionId: result.transactionId,
      from: transferData.fromAccount?.number,
      to: transferData.toAccountNumber,
      recipient: transferData.recipientName,
      amount: transferData.amount,
      currency: transferData.currency,
      date: result.timestamp,
      status: result.success ? "Success" : "Failed",
    };

    const blob = new Blob([JSON.stringify(receiptData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${result.transactionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="feedback-section">
      <div className={`feedback-icon ${result.success ? "success" : "error"}`}>
        {result.success ? (
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="4" />
            <path
              d="M25 40L35 50L55 30"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="4" />
            <path
              d="M30 30L50 50M50 30L30 50"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>

      <h3 className={result.success ? "success-text" : "error-text"}>{result.message}</h3>

      {result.success && (
        <div className="receipt-card">
          <div className="receipt-header">
            <h4>Transaction Receipt</h4>
          </div>
          
          <div className="receipt-details">
            <div className="detail-row">
              <span className="detail-label">Transaction ID:</span>
              <span className="detail-value monospace">{result.transactionId}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Date & Time:</span>
              <span className="detail-value">
                {new Date(result.timestamp).toLocaleString()}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">From:</span>
              <span className="detail-value">
                {transferData.fromAccount?.type} - {transferData.fromAccount?.number}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">To:</span>
              <span className="detail-value">
                {transferData.recipientName} ({transferData.toAccountNumber})
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Amount:</span>
              <span className="detail-value amount-highlight">
                {transferData.currency} {parseFloat(transferData.amount).toLocaleString()}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className="detail-value success-badge">Completed</span>
            </div>
          </div>

          <button className="btn-outline download-btn" onClick={handleDownloadReceipt}>
            📥 Download Receipt
          </button>
        </div>
      )}

      {!result.success && (
        <div className="info-box error">
          <p>
            Transaction ID: {result.transactionId || "N/A"}
          </p>
          <p>
            If you continue to experience issues, please contact customer support.
          </p>
        </div>
      )}

      <div className="modal-actions">
        <button className="btn-secondary" onClick={onClose}>
          Close
        </button>
        <button className="btn-primary" onClick={onStartNewTransfer}>
          Start New Transfer
        </button>
      </div>
    </div>
  );
}
