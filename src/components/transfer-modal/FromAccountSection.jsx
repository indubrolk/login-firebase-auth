export default function FromAccountSection({ accounts, selectedAccount, onSelectAccount, error }) {
  return (
    <div className="form-section">
      <h3>From Account</h3>
      <div className="form-group">
        <label htmlFor="from-account">Select Source Account</label>
        <select
          id="from-account"
          className={`form-input ${error ? "error" : ""}`}
          value={selectedAccount?.id || ""}
          onChange={(e) => {
            const account = accounts.find((acc) => acc.id === e.target.value);
            onSelectAccount(account);
          }}
        >
          <option value="">-- Select Account --</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.type} - {account.number} (Balance: {account.currency} {account.balance.toLocaleString()})
            </option>
          ))}
        </select>
        {error && <span className="error-message">{error}</span>}
      </div>

      {selectedAccount && (
        <div className="account-details-card">
          <div className="detail-row">
            <span className="detail-label">Account Type:</span>
            <span className="detail-value">{selectedAccount.type}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Account Number:</span>
            <span className="detail-value">{selectedAccount.number}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Available Balance:</span>
            <span className="detail-value balance-highlight">
              {selectedAccount.currency} {selectedAccount.balance.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
