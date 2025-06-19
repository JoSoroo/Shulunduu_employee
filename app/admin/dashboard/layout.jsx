"use client";
import React, { useState, useEffect } from "react";
import { styled } from "@mui/material";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import NavMenu from "../components/sidebar/Navmenu";
import { AuthProvider, useAuth } from "../context/authContext";
const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  flexDirection: "column",
  zIndex: 1,
}));

// Route хандалтын дүрэм
const routeAccess = {
  admin: [
    "/",
    "/admin/dashboard/branches",
    "/admin/dashboard/managers",
    "/admin/dashboard/employees",
    "/admin/dashboard/role",
  ],
  manager: [
    "/",
    "/admin/dashboard/employees",
    "/admin/dashboard/shift",
    "/admin/dashboard",
  ],
};

const publicRoutes = ["/", "/admin"];

const checkRouteAccess = (role, path) => {
  if (!role) return false;
  const allowedRoutes = routeAccess[role] || [];
  return allowedRoutes.includes(path);
};

function LayoutContext({ children }) {
  const { user, loading } = useAuth();
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  if (loading) {
    return <div>Ачааллаж байна...</div>;
  }

  if (!user && !publicRoutes.includes(pathname)) {
    return <div>Түр хүлээнэ үү...</div>;
  }

  const cleanPath = pathname.split("?")[0].split("#")[0];
  const role = user?.role?.toLowerCase(); // 'admin'
  const hasAccess = checkRouteAccess(role, cleanPath);

  if (user && !hasAccess) {
    return <div>Нэвтрэх эрх хүрэлцэхгүй байна.</div>;
  }

  return (
    <MainWrapper>
      {/* Энд тавих нь логин хийгдсэн хойно NavMenu-г үзүүлнэ */}
      <PageWrapper>{children}</PageWrapper>
    </MainWrapper>
  );
}

export default function Rootlayout({ children }) {
  return (
    <SidebarProvider>
      <AuthProvider>
        <NavMenu />
        <SidebarTrigger />
        <LayoutContext>{children}</LayoutContext>
      </AuthProvider>
    </SidebarProvider>
  );
}
