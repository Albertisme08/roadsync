
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useRegistrationFlow } from "@/hooks/auth/useRegistrationFlow";

const AuthForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  // Force mode to login by default, only show register if explicitly requested
  const mode = searchParams.get("mode") === "register" ? "register" : "login";
  const navigate = useNavigate();
  const { initiateRegistration } = useRegistrationFlow();

  const handleRegisterClick = () => {
    // Initialize registration flow before navigating to register form
    initiateRegistration();
    navigate("/auth?mode=register");
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === "login" ? "Login to RoadSync" : "Create an Account"}
        </CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Enter your credentials to access your account"
            : "Sign up to start using RoadSync"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mode === "login" ? <LoginForm /> : <RegisterForm />}
      </CardContent>
      <CardFooter className="flex justify-center">
        {mode === "login" ? (
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Button
              variant="link"
              className="p-0 text-brand-blue"
              onClick={handleRegisterClick}
            >
              Create an account
            </Button>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Button
              variant="link"
              className="p-0 text-brand-blue"
              onClick={() => navigate("/auth?mode=login")}
            >
              Login
            </Button>
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
