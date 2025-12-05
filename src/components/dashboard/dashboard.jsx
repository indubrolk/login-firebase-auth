import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.displayName || user?.email || "User";

  const handleSignOut = async () => {
    await signOutUser();
    navigate("/", { replace: true });
  };

  return (
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
  );
}
