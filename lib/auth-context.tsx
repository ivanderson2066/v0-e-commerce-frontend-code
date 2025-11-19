"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Simulando autenticação
    await new Promise((resolve) => setTimeout(resolve, 500));
    const mockUser: User = {
      id: "user-" + Date.now(),
      name: email.split("@")[0],
      email,
      role: "user",
      createdAt: new Date().toISOString(),
    };
    setUser(mockUser);
    localStorage.setItem("currentUser", JSON.stringify(mockUser));
  };

  const register = async (name: string, email: string, password: string) => {
    // Simulando registro
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newUser: User = {
      id: "user-" + Date.now(),
      name,
      email,
      role: "user",
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem("currentUser", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
