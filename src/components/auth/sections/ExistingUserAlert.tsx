
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ShieldAlert } from "lucide-react";

interface ExistingUserAlertProps {
  show: boolean;
  status: string;
}

const ExistingUserAlert: React.FC<ExistingUserAlertProps> = ({ show, status }) => {
  if (!show) return null;

  return (
    <Alert 
      variant={status === "approved" ? "destructive" : status === "rejected" ? "destructive" : "default"} 
      className={`mb-4 ${status === "pending" ? "bg-yellow-50 border-yellow-200" : ""}`}
    >
      {status === "pending" ? (
        <ShieldAlert className="h-4 w-4 text-yellow-600" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      <AlertTitle>
        {status === "pending" 
          ? "Account Pending Approval" 
          : status === "approved" 
            ? "Account Already Exists" 
            : "Account Previously Rejected"}
      </AlertTitle>
      <AlertDescription className={status === "pending" ? "text-yellow-700" : ""}>
        {status === "pending" 
          ? "Your account is still pending approval. You will receive a notification once your account has been reviewed by an administrator."
          : status === "approved" 
            ? "An account with this email already exists. Please log in instead."
            : "Your account was previously rejected by an administrator. Please contact support or try with a different email."}
      </AlertDescription>
    </Alert>
  );
};

export default ExistingUserAlert;
