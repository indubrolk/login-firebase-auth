export default function RemarksSection({ remarks, onUpdate }) {
  return (
    <div className="form-section">
      <h3>Remarks (Optional)</h3>
      
      <div className="form-group">
        <label htmlFor="remarks">Transaction Description / Notes</label>
        <textarea
          id="remarks"
          className="form-input"
          placeholder="Enter any notes or description for this transfer..."
          rows="3"
          maxLength="200"
          value={remarks}
          onChange={(e) => onUpdate(e.target.value)}
        />
        <span className="char-count">{remarks.length}/200</span>
      </div>
    </div>
  );
}
