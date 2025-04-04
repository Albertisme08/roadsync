
import React from "react";
import { Navigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";

const AuthPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4 bg-gray-50">
      <AuthForm />
    </div>
  );
};

export default AuthPage;
