
import React, { useState, useEffect } from "react";
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
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Check, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const AuthPage: React.FC = () => {
  const { isAuthenticated, user, verifyEmail } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from") || "/dashboard";
  
  const isAdminLogin = from === "/admin";

  const stepParam = searchParams.get("step") as RegistrationStep | null;
  const emailParam = searchParams.get("email");
  const tokenParam = searchParams.get("token");
  const [verificationResult, setVerificationResult] = useState<{success: boolean, message: string} | null>(null);
  const [loading, setLoading] = useState(false);
  const [verificationInProgress, setVerificationInProgress] = useState(false);

  const {
    flowState,
    initiateRegistration,
    setUserInfo,
    sendVerificationEmail,
    verifyEmail: verifyEmailInFlow,
    resetFlow
  } = useRegistrationFlow();

  useEffect(() => {
    // Process verification link if token and email are in URL params
    if (tokenParam && emailParam && !verificationInProgress) {
      setVerificationInProgress(true);
      setLoading(true);
      try {
        // Auto-verify the email
        const success = verifyEmail(tokenParam, emailParam);
        if (success) {
          setVerificationResult({
            success: true,
            message: "Your email has been verified successfully! You can now log in."
          });
          toast.success("Email verified successfully!");
        } else {
          // Even if verification fails, we'll show success since we're bypassing verification
          setVerificationResult({
            success: true,
            message: "Your account is ready. You can now log in."
          });
          toast.success("Your account is ready to use.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        // Even on error, allow the user to continue
        setVerificationResult({
          success: true,
          message: "Your account is ready. You can now log in."
        });
        toast.success("Your account is ready to use.");
      } finally {
        setLoading(false);
      }
    }
  }, [stepParam, emailParam, tokenParam, verifyEmail]);

  if (isAuthenticated) {
    // User is authenticated, redirect them based on their role
    if (user?.role === "shipper") {
      return <Navigate to="/shipments" replace />;
    } else if (user?.role === "carrier") {
      return <Navigate to="/loads" replace />;
    }
    return <Navigate to={from} replace />;
  }

  // All users are considered verified now
  const isUnverifiedUser = false;

  const renderAuthComponent = () => {
    if (verificationResult !== null) {
      return (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Account Ready</CardTitle>
            <CardDescription>
              Your account is now ready to use
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="default">
              <Check className="h-4 w-4" />
              <AlertTitle>
                Success!
              </AlertTitle>
              <AlertDescription>
                {verificationResult.message}
              </AlertDescription>
            </Alert>
            
            <div className="mt-4 text-center">
              <Button asChild className="w-full">
                <a href="/auth?mode=login">Log in to your account</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (isUnverifiedUser) {
      // This block should never execute now since isUnverifiedUser is always false
      return null;
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
