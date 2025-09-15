"use client";
/* change: client-side guard component
   why: quick UX-level protection (not replacement for server-side security) */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function RequireRole({ children, allowed = ["admin"] }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login");
      } else if (!role) {
        router.push("/unauthorized");
      } else if (!allowed.includes(role)) {
        router.push("/unauthorized");
      }
    }
  }, [user, role, loading, router, allowed]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !role || !allowed.includes(role)) {
    return null; // Will redirect
  }

  return children;
}
