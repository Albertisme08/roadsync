
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent, 
  CardDescription,
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Check, AlertTriangle, Mail } from "lucide-react";
import { toast } from "sonner";

interface EmailVerificationProps {
  email: string;
  onVerify: (token: string, email: string) => boolean;
  onResendVerification: () => Promise<string>;
  onBack: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({
  email,
  onVerify,
  onResendVerification,
  onBack,
}) => {
  const [token, setToken] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState<boolean | null>(null);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleVerify = () => {
    if (!token) return;
    
    setVerifying(true);
    try {
      const success = onVerify(token, email);
      setVerificationSuccess(success);
      if (success) {
        toast.success("Email verified successfully!");
      } else {
        toast.error("Invalid verification code. Please try again.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationSuccess(false);
      toast.error("Verification failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await onResendVerification();
      setResendSuccess(true);
      toast.success("Verification email resent! Please check your inbox.");
      setTimeout(() => {
        setResendSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Failed to resend verification:", error);
      toast.error("Failed to resend verification email. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          We've sent a verification code to {email}. Please enter it below to
          verify your email address.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {verificationSuccess === true && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md text-green-600">
            <Check className="h-5 w-5" />
            <span>Email verified successfully!</span>
          </div>
        )}
        
        {verificationSuccess === false && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span>Invalid verification code. Please try again.</span>
          </div>
        )}
        
        {resendSuccess && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-600">
            <Mail className="h-5 w-5" />
            <span>Verification email resent successfully!</span>
          </div>
        )}
        
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="token">
            Verification Code
          </label>
          <Input
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter verification code"
            disabled={verifying}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            onClick={onBack}
            disabled={verifying} 
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={handleVerify}
            disabled={!token || verifying}
            className="flex-1"
          >
            {verifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </Button>
        </div>
        
        <Button
          variant="ghost"
          onClick={handleResend}
          disabled={resending}
          className="w-full mt-2"
        >
          {resending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resending...
            </>
          ) : (
            "Resend Verification Code"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmailVerification;
