
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import EmployeeLoginForm from "@/components/auth/EmployeeLoginForm";

const EmployeeAuth: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  // If user is already logged in and is an employee, redirect to dashboard
  if (isAuthenticated && user?.role === "employee") {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If user is logged in but not an employee, log them out first
  if (isAuthenticated) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4 bg-gray-50">
      <EmployeeLoginForm />
    </div>
  );
};

export default EmployeeAuth;
