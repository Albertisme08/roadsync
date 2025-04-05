
import React, { useState, useEffect } from "react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

const AuthPage: React.FC = () => {
  const { isAuthenticated, user, verifyEmail, resendVerification } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from") || "/dashboard";
  
  // Check if the user is trying to access the admin page
  const isAdminLogin = from === "/admin";

  // Get registration flow step from query params if available
  const stepParam = searchParams.get("step") as RegistrationStep | null;
  const emailParam = searchParams.get("email");
  const tokenParam = searchParams.get("token");
  const [verificationResult, setVerificationResult] = useState<{success: boolean, message: string} | null>(null);

  // Initialize registration flow
  const {
    flowState,
    initiateRegistration,
    setUserInfo,
    sendVerificationEmail,
    verifyEmail: verifyEmailInFlow,
    resetFlow
  } = useRegistrationFlow();

  // Check URL for verification request
  useEffect(() => {
    // Handle verification link from email
    if (tokenParam && emailParam && !stepParam) {
      try {
        const success = verifyEmail(tokenParam, emailParam);
        if (success) {
          setVerificationResult({
            success: true,
            message: "Your email has been verified successfully! You can now log in."
          });
        } else {
          setVerificationResult({
            success: false,
            message: "Invalid or expired verification link. Please request a new one."
          });
        }
      } catch (error) {
        console.error("Verification error:", error);
        setVerificationResult({
          success: false,
          message: "An error occurred during verification. Please try again later."
        });
      }
    }
    // Handle registration flow steps
    else if (stepParam === "email-verification" && emailParam) {
      setUserInfo(emailParam, "", "");
    }
  }, [stepParam, emailParam, tokenParam, verifyEmail]);
  
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

  // If user is registered but not verified, show verification needed message
  const isUnverifiedUser = user && user.verificationStatus === "unverified";

  // Determine which component to render based on step or admin login
  const renderAuthComponent = () => {
    // Display verification result if we just processed a verification link
    if (verificationResult !== null) {
      return (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Email Verification</CardTitle>
            <CardDescription>
              {verificationResult.success 
                ? "Your email has been successfully verified" 
                : "Email verification failed"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant={verificationResult.success ? "default" : "destructive"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>
                {verificationResult.success ? "Success!" : "Verification Failed"}
              </AlertTitle>
              <AlertDescription>
                {verificationResult.message}
              </AlertDescription>
            </Alert>
            
            {verificationResult.success ? (
              <p className="mt-4 text-center">
                <a href="/auth?mode=login" className="text-primary hover:underline">
                  Click here to log in
                </a>
              </p>
            ) : (
              <p className="mt-4 text-center">
                <a href="/auth?mode=login" className="text-primary hover:underline">
                  Return to login
                </a>
              </p>
            )}
          </CardContent>
        </Card>
      );
    }

    // Show verification notice for unverified users
    if (isUnverifiedUser) {
      return (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Email Verification Required</CardTitle>
            <CardDescription>
              Please verify your email address to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="default">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Verification Required</AlertTitle>
              <AlertDescription>
                We've sent a verification link to <strong>{user.email}</strong>. 
                Please check your inbox and click the link to verify your email address.
              </AlertDescription>
            </Alert>
            <div className="flex justify-center mt-4">
              <button 
                className="text-primary hover:underline"
                onClick={async () => {
                  if (user) {
                    toast.info("Sending verification email...");
                    try {
                      // Using resendVerification correctly as an async function
                      const token = await resendVerification(user.id);
                      toast.success("Verification email sent! Please check your inbox.");
                    } catch (error) {
                      console.error("Failed to resend verification:", error);
                      toast.error("Failed to resend verification email. Please try again.");
                    }
                  }
                }}
              >
                Resend verification email
              </button>
            </div>
          </CardContent>
        </Card>
      );
    }

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
            onVerify={verifyEmailInFlow}
            onResendVerification={() => sendVerificationEmail()}
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
