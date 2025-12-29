import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileImage.css";

const STORAGE_KEY_IMAGE = "profileImageDataUrl";
const STORAGE_KEY_PROFILE = "profileDetails";

export default function ProfileImage({ user, onSignOut = () => {} }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [currentUrl, setCurrentUrl] = useState(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY_IMAGE) : null;
    return stored || user?.photoURL || "";
  });

  const [profile, setProfile] = useState(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY_PROFILE) : null;
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [editForm, setEditForm] = useState(() => {
    const displayName = profile?.name || user?.displayName || user?.email || "User";
    const phone = profile?.phone || "";
    return { name: displayName, phone };
  });

  const [previewUrl, setPreviewUrl] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [viewPhone, setViewPhone] = useState(() => profile?.phone || "");
  const [smsSent, setSmsSent] = useState(false);
  const fileInputRef = useRef(null);

  const avatarInitial = useMemo(() => {
    const displayName = profile?.name || user?.displayName || user?.email || "User";
    return displayName.charAt(0).toUpperCase();
  }, [profile, user]);

  const displayUrl = previewUrl || currentUrl || "";

  const closeAll = () => {
    setIsMenuOpen(false);
    setIsViewOpen(false);
    setIsEditOpen(false);
    setPreviewUrl("");
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleMenuSelect = (action) => {
    setIsMenuOpen(false);
    if (action === "dashboard") {
      navigate("/dashboard");
    }
    if (action === "view") {
      setIsViewOpen(true);
    }
    if (action === "edit") {
      setEditForm({
        name: profile?.name || user?.displayName || user?.email || "User",
        phone: profile?.phone || "",
      });
      setIsEditOpen(true);
    }
    if (action === "logout") {
      onSignOut();
    }
  };

  const onFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!(file.type === "image/jpeg" || file.type === "image/png")) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onSaveEdit = () => {
    const nextImage = previewUrl || currentUrl;
    const nextProfile = { name: editForm.name || "User", phone: editForm.phone || "" };
    setCurrentUrl(nextImage);
    setProfile(nextProfile);

    try {
      window.localStorage.setItem(STORAGE_KEY_IMAGE, nextImage || "");
      window.localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(nextProfile));
    } catch {
      // ignore storage errors
    }

    setIsEditOpen(false);
    setPreviewUrl("");
  };

  const onCancelEdit = () => {
    setIsEditOpen(false);
    setPreviewUrl("");
  };

  const handleSendSMS = () => {
    if (!viewPhone.trim()) {
      return;
    }
    setSmsSent(true);
    setIs2FAEnabled(true);
    setTimeout(() => setSmsSent(false), 3000);
  };

  const displayName = profile?.name || user?.displayName || user?.email || "User";
  const displayEmail = user?.email || "";
  const displayViewPhone = viewPhone || "";

  return (
    <div className="pi-root">
      <button className="pi-avatar" aria-label="Profile menu" onClick={toggleMenu}>
        {displayUrl ? (
          <img src={displayUrl} alt="Profile" className="pi-img" />
        ) : (
          <span className="pi-initial">{avatarInitial}</span>
        )}
      </button>

      {isMenuOpen && (
        <div className="pi-dropdown" role="menu">
          <button className="pi-item" onClick={() => handleMenuSelect("dashboard")}>Dashboard</button>
          <button className="pi-item" onClick={() => handleMenuSelect("view")}>View Profile</button>
          <button className="pi-item" onClick={() => handleMenuSelect("edit")}>Edit Profile</button>
          <button className="pi-item danger" onClick={() => handleMenuSelect("logout")}>Log Out</button>
        </div>
      )}

      {isViewOpen && (
        <div className="pi-overlay" role="dialog" aria-modal="true">
          <div className="pi-panel">
            <div className="pi-header">
              <h3 className="pi-title">View Profile</h3>
              <button className="pi-close" onClick={closeAll} aria-label="Close">✕</button>
            </div>

            <div className="pi-preview-wrap">
              {currentUrl ? (
                <img src={currentUrl} alt="Profile" className="pi-preview" />
              ) : (
                <div className="pi-preview pi-placeholder">{avatarInitial}</div>
              )}
            </div>

            <div className="pi-section">
              <h4 className="pi-section-title">Personal Information</h4>
              <div className="pi-field-row">
                <span className="pi-field-label">Name</span>
                <span className="pi-field-value">{displayName}</span>
              </div>
              <div className="pi-field-row">
                <span className="pi-field-label">Email</span>
                <span className="pi-field-value">{displayEmail}</span>
              </div>
            </div>

            <div className="pi-section">
              <h4 className="pi-section-title">Security & Settings</h4>
              <div className="pi-field-row">
                <span className="pi-field-label">2FA Status</span>
                <span className={`pi-badge ${is2FAEnabled ? "enabled" : "disabled"}`}>
                  {is2FAEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>
              <label className="pi-field">
                <span>Phone Number</span>
                <input
                  type="tel"
                  value={displayViewPhone}
                  onChange={(e) => setViewPhone(e.target.value)}
                  placeholder="+1 555 123 4567"
                />
              </label>
              <button className="pi-btn primary" onClick={handleSendSMS}>
                Send Verification SMS
              </button>
              {smsSent && (
                <p className="pi-success">Verification SMS sent successfully.</p>
              )}
            </div>

            <button className="pi-btn logout" onClick={() => { closeAll(); onSignOut(); }}>
              Log Out
            </button>
          </div>
        </div>
      )}

      {isEditOpen && (
        <div className="pi-overlay" role="dialog" aria-modal="true">
          <div className="pi-panel">
            <div className="pi-header">
              <h3 className="pi-title">Edit Profile</h3>
              <button className="pi-close" onClick={closeAll} aria-label="Close">✕</button>
            </div>

            <div className="pi-preview-wrap">
              {previewUrl || currentUrl ? (
                <img src={previewUrl || currentUrl} alt="Preview" className="pi-preview" />
              ) : (
                <div className="pi-preview pi-placeholder">{avatarInitial}</div>
              )}
            </div>

            <div className="pi-form">
              <label className="pi-field">
                <span>Name</span>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Full name"
                />
              </label>
              <label className="pi-field">
                <span>Phone</span>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="e.g. +1 555 123 4567"
                />
              </label>
            </div>

            <div className="pi-actions">
              <button className="pi-btn primary" onClick={() => fileInputRef.current?.click()}>
                Change Profile Photo
              </button>
              <input
                ref={fileInputRef}
                className="pi-file"
                type="file"
                accept="image/png, image/jpeg"
                onChange={onFileSelected}
              />
            </div>

            <div className="pi-buttons">
              <button className="pi-btn save" onClick={onSaveEdit}>Save</button>
              <button className="pi-btn" onClick={onCancelEdit}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
