
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";

const AuthPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // If user is already logged in, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col min-h-[80vh] items-center justify-center p-4 bg-gray-50">
      <AuthForm />
      
      <div className="mt-8 text-center">
        <Link 
          to="/employee-login" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-blue transition-colors"
        >
          <Building2 className="h-4 w-4" />
          Employee Login
        </Link>
      </div>
    </div>
  );
};

export default AuthPage;
