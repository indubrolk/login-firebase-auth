import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AccountCard from "../account-card/account-card";

export default function Dashboard() {
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.displayName || user?.email || "User";

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
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div>
          <p className="eyebrow">Signed in</p>
          <h1 className="headline">Welcome, {displayName}!</h1>
          <p className="subtext">You are now authenticated with Firebase.</p>
        </div>
        <button className="primary-button" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
      <AccountCard
        userName={profileData.userName}
        accountNumber={profileData.accountNumber}
        accountType={profileData.accountType}
        balance={profileData.balance}
        avatarUrl={profileData.avatarUrl}
      />
    </div>
  );
}
