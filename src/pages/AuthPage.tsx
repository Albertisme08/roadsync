
import React, { useState } from "react";
import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import AdminLoginForm from "@/components/auth/AdminLoginForm";
import EmailVerification from "@/components/auth/EmailVerification";
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
  
  // Check if the user is trying to access the admin page
  const isAdminLogin = from === "/admin";

  // Get registration flow step from query params if available
  const stepParam = searchParams.get("step") as RegistrationStep | null;
  const emailParam = searchParams.get("email");
  const tokenParam = searchParams.get("token");

  // Initialize registration flow
  const {
    flowState,
    initiateRegistration,
    setUserInfo,
    sendVerificationEmail,
    verifyEmail,
    resetFlow
  } = useRegistrationFlow();

  // Check URL for verification request
  React.useEffect(() => {
    if (stepParam === "email-verification" && emailParam && tokenParam) {
      // This would be when user clicks the verification link from their email
      setUserInfo(emailParam, "", "");
      verifyEmail(tokenParam);
    }
  }, [stepParam, emailParam, tokenParam]);
  
  // If user is already logged in, redirect to requested page or dashboard
  if (isAuthenticated) {
    // Redirect based on user role
    if (user?.role === "shipper") {
      return <Navigate to="/shipments" replace />;
    } else if (user?.role === "carrier") {
      return <Navigate to="/loads" replace />;
    }
    return <Navigate to={from} replace />;
  }

  // Determine which component to render based on step or admin login
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

    // Check if we're in a specific step of the registration flow
    switch (flowState.step) {
      case "email-verification":
        return (
          <EmailVerification 
            email={flowState.email}
            onVerify={verifyEmail}
            onResendVerification={sendVerificationEmail}
            onBack={resetFlow}
          />
        );
        
      // We'll implement the rest of the steps in future iterations
      default:
        return <AuthForm />;
    }
  };

  return (
    <div className="flex flex-col min-h-[80vh] items-center justify-center p-4 bg-gray-50">
      {renderAuthComponent()}
    </div>
  );
};

export default AuthPage;
