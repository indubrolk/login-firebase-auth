export default function AmountSection({ amount, currency, maxBalance, onUpdate, error }) {
  const currencies = ["USD", "EUR", "GBP", "INR", "JPY"];

  return (
    <div className="form-section">
      <h3>Transfer Amount</h3>
      
      <div className="form-row">
        <div className="form-group flex-grow">
          <label htmlFor="amount">Amount *</label>
          <input
            type="number"
            id="amount"
            className={`form-input ${error ? "error" : ""}`}
            placeholder="0.00"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => onUpdate("amount", e.target.value)}
          />
          {error && <span className="error-message">{error}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="currency">Currency</label>
          <select
            id="currency"
            className="form-input"
            value={currency}
            onChange={(e) => onUpdate("currency", e.target.value)}
          >
            {currencies.map((curr) => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {maxBalance > 0 && (
        <div className="info-box">
          <p className="info-text">
            Maximum available: {currency} {maxBalance.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
