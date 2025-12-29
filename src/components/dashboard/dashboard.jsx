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
  const headerBarStyle = {
    position: "fixed",
    top: 20,
    right: 20,
    display: "flex",
    alignItems: "center",
    gap: "12px",
    zIndex: 10,
  };
  const signOutStyle = {
    padding: "10px 16px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#1f7cff",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(0, 0, 0, 0.12)",
  };
  const avatarStyle = {
    width: 44,
    height: 44,
    borderRadius: "50%",
    backgroundColor: "#e2e8f0",
    color: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
    overflow: "hidden",
    border: "2px solid #fff",
    cursor: "pointer",
  };
  const avatarImgStyle = { width: "100%", height: "100%", objectFit: "cover" };
  // Fallback avatar initial when no photo URL is present.
  const avatarInitial = (displayName || user?.email || "U").charAt(0).toUpperCase();

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

  const handleAvatarClick = () => {
    navigate("/profile");
  };

  return (
    <div style={pageStyle}>
      <div style={headerBarStyle}>
        <div style={avatarStyle} aria-label="Profile avatar" onClick={handleAvatarClick}>
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile avatar" style={avatarImgStyle} />
          ) : (
            avatarInitial
          )}
        </div>
        <button style={signOutStyle} onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
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

