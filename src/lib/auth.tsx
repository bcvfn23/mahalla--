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
  login: (user: User, remember: boolean) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check session on mount
    let active = true;
    requestAnimationFrame(() => {
      const token = sessionStorage.getItem("app_token") || localStorage.getItem("app_token");
      if (token) {
        try {
          const decoded = JSON.parse(atob(token));
          if (active) {
            setUser(decoded);
          }
        } catch (e) {
          console.error("Invalid token", e);
          sessionStorage.removeItem("app_token");
          localStorage.removeItem("app_token");
        }
      }
      if (active) {
        setIsLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const login = (newUser: User, remember: boolean = false) => {
    setUser(newUser);
    // Fake JWT encoding for some base security/professionalism
    const token = btoa(JSON.stringify(newUser));
    if (remember) {
      localStorage.setItem("app_token", token);
    } else {
      sessionStorage.setItem("app_token", token);
    }
    router.push("/dashboard");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("app_token");
    sessionStorage.removeItem("app_token");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
