
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ExistingUserAlertProps {
  show: boolean;
  status: string;
}

const ExistingUserAlert: React.FC<ExistingUserAlertProps> = ({ show, status }) => {
  if (!show) return null;

  return (
    <Alert variant={status === "approved" ? "destructive" : "default"} className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>
        {status === "pending" 
          ? "Account Pending Approval" 
          : status === "approved" 
            ? "Account Already Exists" 
            : "Account Previously Rejected"}
      </AlertTitle>
      <AlertDescription>
        {status === "pending" 
          ? "Your account is still pending approval. You will receive an email notification once your account has been reviewed."
          : status === "approved" 
            ? "An account with this email already exists. Please log in instead."
            : "Your account was previously rejected. Please contact support or try with a different email."}
      </AlertDescription>
    </Alert>
  );
};

export default ExistingUserAlert;
