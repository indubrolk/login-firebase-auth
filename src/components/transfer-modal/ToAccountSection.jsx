export default function ToAccountSection({
  toAccountNumber,
  recipientName,
  bankName,
  ifscCode,
  saveRecipient,
  onUpdate,
  errors,
}) {
  return (
    <div className="form-section">
      <h3>To Account</h3>
      
      <div className="form-group">
        <label htmlFor="recipient-account">Recipient Account Number *</label>
        <input
          type="text"
          id="recipient-account"
          className={`form-input ${errors.toAccountNumber ? "error" : ""}`}
          placeholder="Enter account number"
          value={toAccountNumber}
          onChange={(e) => onUpdate("toAccountNumber", e.target.value)}
        />
        {errors.toAccountNumber && <span className="error-message">{errors.toAccountNumber}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="recipient-name">Recipient Name *</label>
        <input
          type="text"
          id="recipient-name"
          className={`form-input ${errors.recipientName ? "error" : ""}`}
          placeholder="Enter recipient name"
          value={recipientName}
          onChange={(e) => onUpdate("recipientName", e.target.value)}
        />
        {errors.recipientName && <span className="error-message">{errors.recipientName}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="bank-name">Bank Name *</label>
          <input
            type="text"
            id="bank-name"
            className={`form-input ${errors.bankName ? "error" : ""}`}
            placeholder="Enter bank name"
            value={bankName}
            onChange={(e) => onUpdate("bankName", e.target.value)}
          />
          {errors.bankName && <span className="error-message">{errors.bankName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="ifsc-code">IFSC Code / Routing Number</label>
          <input
            type="text"
            id="ifsc-code"
            className="form-input"
            placeholder="Optional"
            value={ifscCode}
            onChange={(e) => onUpdate("ifscCode", e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={saveRecipient}
            onChange={(e) => onUpdate("saveRecipient", e.target.checked)}
          />
          <span>Save this recipient for future transfers</span>
        </label>
      </div>
    </div>
  );
}
