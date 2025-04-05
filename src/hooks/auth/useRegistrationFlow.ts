
import { useState } from "react";

export type RegistrationStep = 
  | "initiate" 
  | "collect-info" 
  | "email-verification" 
  | "set-password" 
  | "complete";

export interface RegistrationFlowState {
  flowId: string;
  step: RegistrationStep;
  email: string;
  name: string;
  role: string;
  verificationToken?: string;
  verificationSent: boolean;
  isVerified: boolean;
}

const createFlowId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

const createVerificationToken = () => {
  return Math.random().toString(36).substring(2, 10);
};

export const useRegistrationFlow = () => {
  const [flowState, setFlowState] = useState<RegistrationFlowState>({
    flowId: "",
    step: "initiate",
    email: "",
    name: "",
    role: "",
    verificationSent: false,
    isVerified: false
  });

  // Initialize registration flow
  const initiateRegistration = () => {
    const flowId = createFlowId();
    
    setFlowState({
      flowId,
      step: "collect-info",
      email: "",
      name: "",
      role: "",
      verificationSent: false,
      isVerified: false
    });
    
    console.log("[Registration Flow] Initiated with flowId:", flowId);
    return flowId;
  };

  // Set user information
  const setUserInfo = (email: string, name: string = "", role: string = "") => {
    setFlowState(prev => ({
      ...prev,
      email,
      name,
      role,
      step: "email-verification"
    }));
    console.log("[Registration Flow] User info set:", { email, name, role });
  };

  // Send verification email (simulated)
  const sendVerificationEmail = () => {
    const verificationToken = createVerificationToken();
    
    // In a real app, this would make an API call to send an email
    console.log("[Registration Flow] Sending verification email to:", flowState.email);
    console.log("[Registration Flow] Verification token:", verificationToken);
    
    setFlowState(prev => ({
      ...prev,
      verificationToken,
      verificationSent: true
    }));
    
    return verificationToken;
  };

  // Verify email with token
  const verifyEmail = (token: string) => {
    if (token === flowState.verificationToken) {
      setFlowState(prev => ({
        ...prev,
        isVerified: true,
        step: "set-password"
      }));
      console.log("[Registration Flow] Email verified successfully");
      return true;
    }
    
    console.log("[Registration Flow] Invalid verification token");
    return false;
  };

  // Complete registration
  const completeRegistration = () => {
    setFlowState(prev => ({
      ...prev,
      step: "complete"
    }));
    console.log("[Registration Flow] Registration completed");
  };

  // Reset registration flow
  const resetFlow = () => {
    setFlowState({
      flowId: "",
      step: "initiate",
      email: "",
      name: "",
      role: "",
      verificationSent: false,
      isVerified: false
    });
    console.log("[Registration Flow] Flow reset");
  };

  return {
    flowState,
    initiateRegistration,
    setUserInfo,
    sendVerificationEmail,
    verifyEmail,
    completeRegistration,
    resetFlow
  };
};
