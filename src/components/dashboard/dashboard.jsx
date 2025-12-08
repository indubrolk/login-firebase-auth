import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProfileCard from "../account-card/account-card";

export default function Dashboard() {
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.displayName || user?.email || "User";
  const pageStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px",
    background: "linear-gradient(135deg, #f5f7fb, #e8f0ff)",
  };
  const cardWrapperStyle = { width: "100%", maxWidth: "1100px" };
  const signOutStyle = {
    position: "fixed",
    top: 20,
    right: 20,
    padding: "10px 16px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#1f7cff",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(0, 0, 0, 0.12)",
  };

  // Mock data for account card - replace with real data from your backend
  const profileData = {
    userName: displayName,
    accountNumber: "1234567890", // This will be masked as ****6789
    accountType: "Checking",
    balance: 2500.75,
    avatarUrl: user?.photoURL || null, // Use Firebase photoURL if available
  };

  const handleSignOut = async () => {
    await signOutUser();
    navigate("/", { replace: true });
  };

  return (
    <div style={pageStyle}>
      <button style={signOutStyle} onClick={handleSignOut}>
        Sign Out
      </button>
      <div style={cardWrapperStyle}>
        <ProfileCard
          userName={profileData.userName}
          accountNumber={profileData.accountNumber}
          accountType={profileData.accountType}
          balance={profileData.balance}
          avatarUrl={profileData.avatarUrl}
        />
      </div>
    </div>
  );
}

