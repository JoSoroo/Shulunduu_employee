"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { role: "admin" } гэх мэт
  
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const isManager = decoded.role === "manager";
        setUser({
          role: decoded.role,
          token,
          branchId: isManager ? decoded.branchId : null,
        });
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = async ({ email, password }) => {
    try {
      const role = email === "admin@example.com" ? "admin" : "manager";
      const res = await fetch(`http://localhost:5000/api/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });
      console.log("login:", res);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Login failed");
      }

      const data = await res.json(); // ← эндээс token авч байна
      console.log("data:", data);
      const decoded = jwtDecode(data.token); // ← зөв ашиглаж байна
      localStorage.setItem("token", data.token); // ← хадгална
      setUser({
        role: decoded.role,
        token: data.token,
        branchId: data.branchId,
      }); // ← хэрэглэгчийн мэдээлэл хадгална
      console.log("user:", decoded.role);
      return { success: true, user: decoded.role };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
