
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

const AdminPage = () => {
  const { user, isAdmin } = useAuth();
  
  if (!user) {
    // Redirect to login if not logged in
    return <Navigate to="/auth?from=/admin" replace />;
  }
  
  if (!isAdmin) {
    // Show access denied for non-admin users
    return (
      <div className="container mx-auto py-16 px-4 flex flex-col items-center justify-center min-h-[60vh]">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-center mb-2">Access Denied</h1>
        <p className="text-gray-600 text-center mb-6">
          You don't have permission to access the admin dashboard.
        </p>
        <Button onClick={() => window.location.href = "/"} className="mt-4">
          Return to Homepage
        </Button>
      </div>
    );
  }
  
  // Render the admin dashboard for authenticated admins
  return <AdminDashboard />;
};

export default AdminPage;
