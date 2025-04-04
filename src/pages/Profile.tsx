
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ProfileForm from "@/components/profile/ProfileForm";

const Profile: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-2">
          Account Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your personal and account information
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <ProfileForm />
      </div>
    </div>
  );
};

export default Profile;
