"use client";
import { uniqueId } from "lodash";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import DashboardIcon from "@mui/icons-material/Dashboard";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import React from "react";
import Link from "next/link";
import { useAuth } from "../../context/authContext";
import RoofingIcon from '@mui/icons-material/Roofing';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import BadgeIcon from '@mui/icons-material/Badge';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
const NavMenu = () => {
  const { user } = useAuth();

  if (!user) return null;

  const userRole = user.role;

  const allMenuItems = [
    {
      id: uniqueId(),
      title: "Хянах самбар",
      icon: DashboardIcon,
      href: "/admin/dashboard",
      roles: ["admin", "manager"],
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
      icon: VaccinesIcon,
      href: "/admin/dashboard/shift",
      roles: ["manager"],
    },
  ];

  const filteredItems = allMenuItems.filter((item) => item.roles.includes(userRole));

  return (
     <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Үндсэн цэс</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default NavMenu;
