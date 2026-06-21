"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type Role = "admin" | "uchastkavoy" | "raisi" | "yetakchi" | null;

export interface User {
  username: string;
  role: Role;
  name: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, pass: string, remember: boolean) => Promise<{ success: boolean; error?: string }>;
  loginWithEImzo: (username: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Validate active HTTPOnly cookie session on mount
  useEffect(() => {
    let active = true;
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (active && data.success) {
            setUser(data.user);
          }
        }
      } catch (e) {
        console.error("Session verification failed", e);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };
    checkSession();
    return () => {
      active = false;
    };
  }, []);

  const login = async (username: string, pass: string, remember: boolean = false): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: pass }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        router.push("/dashboard");
        return { success: true };
      }
      return { success: false, error: data.message || data.error };
    } catch (e) {
      console.error("Login verification failed", e);
      return { success: false, error: "Network error occurred. Please try again." };
    }
  };

  const loginWithEImzo = async (username: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/e-imzo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username, 
          signature: "mock_signature_" + Math.random().toString(36).substring(7),
          challenge: "mock_challenge_" + Date.now()
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        router.push("/dashboard");
        return { success: true };
      }
      return { success: false, error: data.message || data.error };
    } catch (e) {
      console.error("E-IMZO login verification failed", e);
      return { success: false, error: "Network error occurred during E-IMZO authentication." };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout request failed", e);
    }
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithEImzo, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
