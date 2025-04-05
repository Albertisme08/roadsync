
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
import { AlertCircle, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const AuthPage: React.FC = () => {
  const { isAuthenticated, user, verifyEmail, resendVerification } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from") || "/dashboard";
  
  const isAdminLogin = from === "/admin";

  const stepParam = searchParams.get("step") as RegistrationStep | null;
  const emailParam = searchParams.get("email");
  const tokenParam = searchParams.get("token");
  const [verificationResult, setVerificationResult] = useState<{success: boolean, message: string} | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    flowState,
    initiateRegistration,
    setUserInfo,
    sendVerificationEmail,
    verifyEmail: verifyEmailInFlow,
    resetFlow
  } = useRegistrationFlow();

  useEffect(() => {
    if (tokenParam && emailParam && !stepParam) {
      setLoading(true);
      try {
        const success = verifyEmail(tokenParam, emailParam);
        if (success) {
          setVerificationResult({
            success: true,
            message: "Your email has been verified successfully! You can now log in."
          });
          toast.success("Email verified successfully!");
        } else {
          setVerificationResult({
            success: false,
            message: "Invalid or expired verification link. Please request a new one."
          });
          toast.error("Verification failed. Please request a new verification email.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setVerificationResult({
          success: false,
          message: "An error occurred during verification. Please try again later."
        });
      } finally {
        setLoading(false);
      }
    } else if (stepParam === "email-verification" && emailParam) {
      setUserInfo(emailParam, "", "");
    }
  }, [stepParam, emailParam, tokenParam, verifyEmail]);

  if (isAuthenticated) {
    if (user?.role === "shipper") {
      return <Navigate to="/shipments" replace />;
    } else if (user?.role === "carrier") {
      return <Navigate to="/loads" replace />;
    }
    return <Navigate to={from} replace />;
  }

  const isUnverifiedUser = user && user.verificationStatus === "unverified";

  const handleResendVerification = async (): Promise<string> => {
    if (!user) {
      return Promise.reject("No user found");
    }
    
    toast.info("Sending verification email...");
    try {
      // Pass user.id to resendVerification since it requires an argument
      const token = await resendVerification(user.id);
      toast.success("Verification email sent! Please check your inbox.");
      return token;
    } catch (error) {
      console.error("Failed to resend verification:", error);
      toast.error("Failed to resend verification email. Please try again.");
      throw error;
    }
  };

  const renderAuthComponent = () => {
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
          <CardContent className="space-y-4">
            <Alert variant={verificationResult.success ? "default" : "destructive"}>
              {verificationResult.success ? (
                <Check className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {verificationResult.success ? "Success!" : "Verification Failed"}
              </AlertTitle>
              <AlertDescription>
                {verificationResult.message}
              </AlertDescription>
            </Alert>
            
            {verificationResult.success ? (
              <div className="mt-4 text-center">
                <Button asChild className="w-full">
                  <a href="/auth?mode=login">Log in to your account</a>
                </Button>
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-2">
                <Button asChild variant="outline" className="w-full">
                  <a href="/auth?mode=login">Return to login</a>
                </Button>
                {emailParam && (
                  <Button 
                    onClick={handleResendVerification}
                    className="w-full"
                  >
                    Request new verification email
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      );
    }

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
              <Button 
                onClick={handleResendVerification}
                variant="outline"
                className="w-full"
              >
                Resend verification email
              </Button>
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

    switch (flowState.step) {
      case "email-verification":
        return (
          <EmailVerification 
            email={flowState.email}
            onVerify={verifyEmailInFlow}
            onResendVerification={handleResendVerification}
            onBack={resetFlow}
          />
        );
        
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
