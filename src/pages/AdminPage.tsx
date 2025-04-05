
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { useRegistration } from "@/hooks/auth/useRegistration";
import { toast } from "@/lib/sonner";

const AdminPage = () => {
  const { user, isAdmin, loadInitialData, allUsers, setAllUsers, setUser, setIsLoading } = useAuth();
  
  // Get the addTestUser function from the registration hook
  const { addTestUser } = useRegistration(setUser, setAllUsers, setIsLoading);
  
  // Add a function to create a test pending user
  const handleAddTestUser = () => {
    const added = addTestUser();
    if (added) {
      loadInitialData(); // Reload data to show the new user
      console.log("Test pending user added and data reloaded");
      toast.success("Test pending user added successfully");
    } else {
      toast.info("Test user already exists");
    }
  };
  
  // Force load data when admin page mounts
  useEffect(() => {
    console.log("AdminPage mounted - forcing data load");
    // Ensure localStorage is initialized
    if (!localStorage.getItem("allUsers")) {
      localStorage.setItem("allUsers", JSON.stringify([]));
    }
    
    // Load data from storage
    loadInitialData();
    
    // Check if we have pending users
    const pendingCount = allUsers.filter(u => u.approvalStatus === "pending").length;
    console.log(`Current pending users: ${pendingCount}`);
    
    // Set up a periodic refresh every 10 seconds for better reactivity
    const intervalId = setInterval(() => {
      console.log("AdminPage periodic refresh");
      loadInitialData();
    }, 10000); // Changed from 30s to 10s for better responsiveness
    
    return () => clearInterval(intervalId);
  }, []);
  
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
  return (
    <>
      <div className="container mx-auto p-4">
        <div className="mb-4 flex justify-end">
          <Button
            onClick={handleAddTestUser}
            variant="outline"
            className="text-sm"
          >
            Add Test Pending User
          </Button>
        </div>
      </div>
      <AdminDashboard />
    </>
  );
};

export default AdminPage;
