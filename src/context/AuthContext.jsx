import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

const AuthContext = createContext({
  user: null,
  initializing: true,
  signOutUser: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      user,
      initializing,
      signOutUser: () => signOut(auth),
    }),
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
