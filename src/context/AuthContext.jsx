import { createContext, useContext } from "react";

export const AuthContext = createContext({
  user: null,
  initializing: true,
  signOutUser: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}
