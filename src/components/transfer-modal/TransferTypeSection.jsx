export default function TransferTypeSection({
  transferType,
  scheduledDate,
  scheduledTime,
  recurringFrequency,
  onUpdate,
  errors,
}) {
  const frequencies = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "biweekly", label: "Bi-weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // Minimum 30 minutes from now
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="form-section">
      <h3>Transfer Type / Schedule</h3>
      
      <div className="form-group">
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="transfer-type"
              value="immediate"
              checked={transferType === "immediate"}
              onChange={(e) => onUpdate("transferType", e.target.value)}
            />
            <span>Immediate Transfer</span>
          </label>

          <label className="radio-label">
            <input
              type="radio"
              name="transfer-type"
              value="scheduled"
              checked={transferType === "scheduled"}
              onChange={(e) => onUpdate("transferType", e.target.value)}
            />
            <span>Scheduled Transfer</span>
          </label>

          <label className="radio-label">
            <input
              type="radio"
              name="transfer-type"
              value="recurring"
              checked={transferType === "recurring"}
              onChange={(e) => onUpdate("transferType", e.target.value)}
            />
            <span>Recurring Transfer</span>
          </label>
        </div>
      </div>

      {transferType === "scheduled" && (
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="scheduled-date">Schedule Date *</label>
            <input
              type="date"
              id="scheduled-date"
              className={`form-input ${errors.scheduledDate ? "error" : ""}`}
              value={scheduledDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => onUpdate("scheduledDate", e.target.value)}
            />
            {errors.scheduledDate && <span className="error-message">{errors.scheduledDate}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="scheduled-time">Schedule Time *</label>
            <input
              type="time"
              id="scheduled-time"
              className={`form-input ${errors.scheduledTime ? "error" : ""}`}
              value={scheduledTime}
              onChange={(e) => onUpdate("scheduledTime", e.target.value)}
            />
            {errors.scheduledTime && <span className="error-message">{errors.scheduledTime}</span>}
          </div>
        </div>
      )}

      {transferType === "recurring" && (
        <div className="form-group">
          <label htmlFor="recurring-frequency">Frequency *</label>
          <select
            id="recurring-frequency"
            className={`form-input ${errors.recurringFrequency ? "error" : ""}`}
            value={recurringFrequency}
            onChange={(e) => onUpdate("recurringFrequency", e.target.value)}
          >
            <option value="">-- Select Frequency --</option>
            {frequencies.map((freq) => (
              <option key={freq.value} value={freq.value}>
                {freq.label}
              </option>
            ))}
          </select>
          {errors.recurringFrequency && <span className="error-message">{errors.recurringFrequency}</span>}
        </div>
      )}
    </div>
  );
}
