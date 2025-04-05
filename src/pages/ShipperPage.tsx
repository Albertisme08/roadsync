
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShipperForm from "@/components/shipper/ShipperForm";
import ShipperLoads from "@/components/shipper/ShipperLoads";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ShipperPage = () => {
  const { user, isAuthenticated } = useAuth();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth?mode=login&redirect=/post-load" replace />;
  }
  
  // If not a shipper, show an error
  if (user && user.role !== "shipper") {
    return (
      <div className="container mx-auto py-16 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            This page is only accessible to shippers. Your account is registered as {user.role}.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold tracking-tight">Shipper Dashboard</h1>
      <p className="text-muted-foreground mb-6">Post and manage your load postings</p>

      <Tabs defaultValue="post-load" className="space-y-6">
        <TabsList>
          <TabsTrigger value="post-load">Post New Load</TabsTrigger>
          <TabsTrigger value="my-loads">My Load Postings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="post-load" className="py-4">
          <ShipperForm />
        </TabsContent>
        
        <TabsContent value="my-loads" className="py-4">
          <ShipperLoads />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShipperPage;
