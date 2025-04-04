
import React from "react";
import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import AdminLoginForm from "@/components/auth/AdminLoginForm";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AuthPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from") || "/dashboard";
  
  // Check if the user is trying to access the admin page
  const isAdminLogin = from === "/admin";
  
  // If user is already logged in, redirect to requested page or dashboard
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="flex flex-col min-h-[80vh] items-center justify-center p-4 bg-gray-50">
      {isAdminLogin ? (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Admin Access</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminLoginForm />
          </CardContent>
        </Card>
      ) : (
        <AuthForm />
      )}
    </div>
  );
};

export default AuthPage;
