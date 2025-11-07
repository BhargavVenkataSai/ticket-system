import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/router";
import UserDashboard from "../components/UserDashboard";
import SupportDashboard from "../components/SupportDashboard";
import AdminDashboard from "../components/AdminDashboard";

export default function Dashboard() {
  const { user, token, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !token)) {
      router.push("/login");
      return;
    }
  }, [user, token, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user || !token) {
    return null;
  }

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case "USER":
      return <UserDashboard user={user} token={token} logout={logout} />;
    case "SUPPORT_AGENT":
      return <SupportDashboard user={user} token={token} logout={logout} />;
    case "ADMIN":
      return <AdminDashboard user={user} token={token} logout={logout} />;
    default:
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-xl text-red-600">
            Unknown user role. Please contact administrator.
          </div>
        </div>
      );
  }
}
