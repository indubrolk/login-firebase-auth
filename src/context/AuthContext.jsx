import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

const AuthContext = createContext({
  user: null,
  initializing: true,
  phoneVerified: false,
  setPhoneVerified: () => {},
  signOutUser: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [phoneVerified, setPhoneVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setPhoneVerified(false); // reset per session until OTP verification passes
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      user,
      initializing,
      phoneVerified,
      setPhoneVerified,
      signOutUser: () => signOut(auth),
    }),
    [user, initializing, phoneVerified]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
