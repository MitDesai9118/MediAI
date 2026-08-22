import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);


export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);


  // Check existing login session
  const checkAuth = async () => {

    try {

      const response = await api.get(
        "/auth/me"
      );

      if (response.data.authenticated) {

        setUser(
          response.data.user
        );

      } else {

        setUser(null);

      }

    } catch (error) {

      console.error(
        "Authentication check failed:",
        error
      );

      setUser(null);

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    checkAuth();

  }, []);


  // Login
  const login = async (
    email,
    password
  ) => {

    const response = await api.post(
      "/auth/login",
      {
        email,
        password,
      }
    );

    if (response.data.success) {

      setUser(
        response.data.user
      );

    }

    return response.data;
  };


  // Logout
  const logout = async () => {

    try {

      await api.post(
        "/auth/logout"
      );

    } finally {

      setUser(null);

    }
  };


  return (

    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >

      {children}

    </AuthContext.Provider>

  );
}


export function useAuth() {

  return useContext(
    AuthContext
  );

}