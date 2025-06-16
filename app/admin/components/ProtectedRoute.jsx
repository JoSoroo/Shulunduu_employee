"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/admin/login");
    } else if (!allowedRoles.includes(user.role)) {
      router.push("/unauthorized");
    }
  }, [user]);

  if (!user || !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}
