"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { authApi } from "./api/auth";
import {
  clearStoredAuth,
  getStoredToken,
  getStoredUser,
  setStoredToken,
  setStoredUser,
} from "./auth";
import { AuthResponse, LoginRequest, UserResponse } from "@/types/auth";

interface AuthContextType {
  user: UserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginRequest, remember?: boolean) => Promise<AuthResponse>;
  logout: () => void;
  refreshUser: () => Promise<UserResponse | null>;
  setUser: (user: UserResponse | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state from storage on mount and verify with /auth/me
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getStoredToken();
      const storedUser = getStoredUser();

      if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
          setUser(storedUser);
        }

        try {
          const freshUser = await authApi.getMe(storedToken);
          setUser(freshUser);
          setStoredUser(freshUser, true);
        } catch {
          // Token is invalid or expired
          clearStoredAuth();
          setToken(null);
          setUser(null);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(
    async (payload: LoginRequest, remember: boolean = false): Promise<AuthResponse> => {
      setIsLoading(true);
      try {
        const response = await authApi.login(payload);
        const accessToken = response.tokens.access_token;
        const authUser = response.user;

        setToken(accessToken);
        setUser(authUser);

        setStoredToken(accessToken, remember);
        setStoredUser(authUser, remember);

        return response;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    clearStoredAuth();
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async (): Promise<UserResponse | null> => {
    const currentToken = token || getStoredToken();
    if (!currentToken) return null;

    try {
      const refreshed = await authApi.getMe(currentToken);
      setUser(refreshed);
      setStoredUser(refreshed, true);
      return refreshed;
    } catch {
      logout();
      return null;
    }
  }, [token, logout]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    logout,
    refreshUser,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
