import { createContext, useContext, useState } from "react";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ data: User | null; error: Error | null }>;
  signUp: (
    email: string,
    password: string,
  ) => Promise<{ data: User | null; error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  signIn: async () => ({ data: null, error: null }),
  signUp: async () => ({ data: null, error: null }),
  signOut: async () => ({ error: null }),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Simple mock authentication - in a real app you'd validate credentials
      if (email && password) {
        const mockUser: User = {
          id: "1",
          email,
          name: email.split("@")[0],
        };
        setUser(mockUser);
        return { data: mockUser, error: null };
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Authentication failed");
      setError(error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Simple mock registration
      if (email && password) {
        const mockUser: User = {
          id: "1",
          email,
          name: email.split("@")[0],
        };
        setUser(mockUser);
        return { data: mockUser, error: null };
      } else {
        throw new Error("Invalid registration data");
      }
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Registration failed");
      setError(error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      setUser(null);
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Sign out failed");
      return { error };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
