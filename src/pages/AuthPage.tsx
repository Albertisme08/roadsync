
import React, { useState } from "react";
import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import AdminLoginForm from "@/components/auth/AdminLoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { useRegistrationFlow, RegistrationStep } from "@/hooks/auth/useRegistrationFlow";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AuthPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from") || "/dashboard";
  
  const isAdminLogin = from === "/admin";

  const {
    flowState,
    initiateRegistration,
    setUserInfo,
    sendVerificationEmail,
    verifyEmail: verifyEmailInFlow,
    resetFlow
  } = useRegistrationFlow();

  if (isAuthenticated) {
    // User is authenticated, redirect them based on their role
    if (user?.role === "shipper") {
      return <Navigate to="/shipments" replace />;
    } else if (user?.role === "carrier") {
      return <Navigate to="/loads" replace />;
    }
    return <Navigate to={from} replace />;
  }

  // VERIFICATION BYPASS: All users are considered verified now
  const isUnverifiedUser = false;

  const renderAuthComponent = () => {
    if (isAdminLogin) {
      return (
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
      );
    }

    // Default case - show the auth form
    return <AuthForm />;
  };

  return (
    <div className="flex flex-col min-h-[80vh] items-center justify-center p-4 bg-gray-50">
      {renderAuthComponent()}
    </div>
  );
};

export default AuthPage;
