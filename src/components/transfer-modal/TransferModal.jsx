import { useState, useEffect } from "react";
import FromAccountSection from "./FromAccountSection";
import ToAccountSection from "./ToAccountSection";
import AmountSection from "./AmountSection";
import RemarksSection from "./RemarksSection";
import TransferTypeSection from "./TransferTypeSection";
import SecuritySection from "./SecuritySection";
import ConfirmationSection from "./ConfirmationSection";
import PostTransferFeedback from "./PostTransferFeedback";
import "./TransferModal.css";

const STEPS = {
  TRANSFER_DETAILS: "transfer_details",
  SECURITY: "security",
  CONFIRMATION: "confirmation",
  FEEDBACK: "feedback",
};

export default function TransferModal({ isOpen, onClose, user, is2FAEnabled = false }) {
  const [currentStep, setCurrentStep] = useState(STEPS.TRANSFER_DETAILS);
  const [errors, setErrors] = useState({});

  // Mock user accounts
  const [accounts] = useState([
    { id: "acc1", number: "****1234", type: "Savings", balance: 15000, currency: "USD" },
    { id: "acc2", number: "****5678", type: "Checking", balance: 8500, currency: "USD" },
    { id: "acc3", number: "****9012", type: "Business", balance: 45000, currency: "USD" },
  ]);

  // Transfer form state
  const [transferData, setTransferData] = useState({
    fromAccount: null,
    toAccountNumber: "",
    recipientName: "",
    bankName: "",
    ifscCode: "",
    saveRecipient: false,
    amount: "",
    currency: "USD",
    remarks: "",
    transferType: "immediate",
    scheduledDate: "",
    scheduledTime: "",
    recurringFrequency: "",
    otpCode: "",
  });

  // Transaction result state
  const [transactionResult, setTransactionResult] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setTimeout(() => {
        setCurrentStep(STEPS.TRANSFER_DETAILS);
        setTransferData({
          fromAccount: null,
          toAccountNumber: "",
          recipientName: "",
          bankName: "",
          ifscCode: "",
          saveRecipient: false,
          amount: "",
          currency: "USD",
          remarks: "",
          transferType: "immediate",
          scheduledDate: "",
          scheduledTime: "",
          recurringFrequency: "",
          otpCode: "",
        });
        setErrors({});
        setTransactionResult(null);
      }, 300);
    }
  }, [isOpen]);

  const updateTransferData = (field, value) => {
    setTransferData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateTransferDetails = () => {
    const newErrors = {};

    if (!transferData.fromAccount) {
      newErrors.fromAccount = "Please select a source account";
    }

    if (!transferData.toAccountNumber.trim()) {
      newErrors.toAccountNumber = "Recipient account number is required";
    } else if (!/^\d{10,16}$/.test(transferData.toAccountNumber.replace(/\s/g, ""))) {
      newErrors.toAccountNumber = "Invalid account number format";
    }

    if (!transferData.recipientName.trim()) {
      newErrors.recipientName = "Recipient name is required";
    }

    if (!transferData.bankName.trim()) {
      newErrors.bankName = "Bank name is required";
    }

    if (!transferData.amount || parseFloat(transferData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    } else if (transferData.fromAccount && parseFloat(transferData.amount) > transferData.fromAccount.balance) {
      newErrors.amount = "Insufficient balance";
    }

    if (transferData.transferType === "scheduled") {
      if (!transferData.scheduledDate) {
        newErrors.scheduledDate = "Please select a date";
      }
      if (!transferData.scheduledTime) {
        newErrors.scheduledTime = "Please select a time";
      }
    }

    if (transferData.transferType === "recurring" && !transferData.recurringFrequency) {
      newErrors.recurringFrequency = "Please select frequency";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToSecurity = () => {
    if (validateTransferDetails()) {
      if (is2FAEnabled) {
        setCurrentStep(STEPS.SECURITY);
      } else {
        setCurrentStep(STEPS.CONFIRMATION);
      }
    }
  };

  const handleSecurityVerified = () => {
    setCurrentStep(STEPS.CONFIRMATION);
  };

  const handleConfirmTransfer = () => {
    // Simulate transfer processing
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate
      setTransactionResult({
        success,
        transactionId: success ? `TXN${Date.now()}` : null,
        message: success
          ? "Transfer completed successfully"
          : "Transfer failed. Please try again.",
        timestamp: new Date().toISOString(),
      });
      setCurrentStep(STEPS.FEEDBACK);
    }, 1500);
  };

  const handleStartNewTransfer = () => {
    setCurrentStep(STEPS.TRANSFER_DETAILS);
    setTransferData({
      fromAccount: transferData.fromAccount,
      toAccountNumber: "",
      recipientName: "",
      bankName: "",
      ifscCode: "",
      saveRecipient: false,
      amount: "",
      currency: transferData.currency,
      remarks: "",
      transferType: "immediate",
      scheduledDate: "",
      scheduledTime: "",
      recurringFrequency: "",
      otpCode: "",
    });
    setErrors({});
    setTransactionResult(null);
  };

  const handleEditTransfer = () => {
    setCurrentStep(STEPS.TRANSFER_DETAILS);
  };

  if (!isOpen) return null;

  return (
    <div className="transfer-modal-overlay" onClick={onClose}>
      <div className="transfer-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="transfer-modal-header">
          <h2>Transfer Funds</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="transfer-modal-body">
          {currentStep === STEPS.TRANSFER_DETAILS && (
            <div className="transfer-details-step">
              <FromAccountSection
                accounts={accounts}
                selectedAccount={transferData.fromAccount}
                onSelectAccount={(account) => updateTransferData("fromAccount", account)}
                error={errors.fromAccount}
              />

              <ToAccountSection
                toAccountNumber={transferData.toAccountNumber}
                recipientName={transferData.recipientName}
                bankName={transferData.bankName}
                ifscCode={transferData.ifscCode}
                saveRecipient={transferData.saveRecipient}
                onUpdate={updateTransferData}
                errors={errors}
              />

              <AmountSection
                amount={transferData.amount}
                currency={transferData.currency}
                maxBalance={transferData.fromAccount?.balance || 0}
                onUpdate={updateTransferData}
                error={errors.amount}
              />

              <RemarksSection
                remarks={transferData.remarks}
                onUpdate={(value) => updateTransferData("remarks", value)}
              />

              <TransferTypeSection
                transferType={transferData.transferType}
                scheduledDate={transferData.scheduledDate}
                scheduledTime={transferData.scheduledTime}
                recurringFrequency={transferData.recurringFrequency}
                onUpdate={updateTransferData}
                errors={errors}
              />

              <div className="modal-actions">
                <button className="btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleProceedToSecurity}>
                  Continue
                </button>
              </div>
            </div>
          )}

          {currentStep === STEPS.SECURITY && (
            <SecuritySection
              is2FAEnabled={is2FAEnabled}
              otpCode={transferData.otpCode}
              onUpdateOtp={(value) => updateTransferData("otpCode", value)}
              onVerified={handleSecurityVerified}
              onBack={() => setCurrentStep(STEPS.TRANSFER_DETAILS)}
            />
          )}

          {currentStep === STEPS.CONFIRMATION && (
            <ConfirmationSection
              transferData={transferData}
              onConfirm={handleConfirmTransfer}
              onEdit={handleEditTransfer}
              onCancel={onClose}
            />
          )}

          {currentStep === STEPS.FEEDBACK && (
            <PostTransferFeedback
              result={transactionResult}
              transferData={transferData}
              onClose={onClose}
              onStartNewTransfer={handleStartNewTransfer}
            />
          )}
        </div>
      </div>
    </div>
  );
}
