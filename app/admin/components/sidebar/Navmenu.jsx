"use client";
import { uniqueId } from "lodash";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../context/authContext";
import RoofingIcon from "@mui/icons-material/Roofing";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BadgeIcon from "@mui/icons-material/Badge";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const NavMenu = () => {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    setIsMounted(true);
    setPathname(window.location.pathname);
  }, []);

  if (!isMounted) return null;

  if (!user) return null;

  const userRole = user.role;

  const allMenuItems = [
    {
      id: uniqueId(),
      title: "Хянах самбар",
      icon: DashboardIcon,
      href: "/admin/dashboard",
      roles: ["manager"],
    },
    {
      id: uniqueId(),
      title: "Салбар",
      icon: RoofingIcon,
      href: "/admin/dashboard/branches",
      roles: ["admin"],
    },
    {
      id: uniqueId(),
      title: "Албан тушаал",
      icon: AdminPanelSettingsIcon,
      href: "/admin/dashboard/role",
      roles: ["admin"],
    },
    {
      id: uniqueId(),
      title: "Менежер",
      icon: ManageAccountsIcon,
      href: "/admin/dashboard/managers",
      roles: ["admin"],
    },
    {
      id: uniqueId(),
      title: "Ажилчин",
      icon: BadgeIcon,
      href: "/admin/dashboard/employees",
      roles: ["admin", "manager"],
    },
    {
      id: uniqueId(),
      title: "Ээлж",
      icon: AccessTimeIcon,
      href: "/admin/dashboard/shift",
      roles: ["manager"],
    },
    {
      id: uniqueId(),
      title: "Реклам",
      icon: OndemandVideoIcon,
      href: "/admin/dashboard/reclam",
      roles: ["admin"],
    },
  ];

  const filteredItems = allMenuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Үндсэн цэс</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* <Image /> */}
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.href}
                      className={`${
                        pathname === item.href
                          ? "active border-black border"
                          : ""
                      }`}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuButton asChild onClick={handleLogout}>
                <a href="/admin">
                  <LogoutIcon />
                  <span>Гарах</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default NavMenu;
