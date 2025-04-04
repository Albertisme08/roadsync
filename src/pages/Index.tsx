
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CTASection from "@/components/home/CTASection";
import { useAuth } from "@/contexts/AuthContext";
import HomeLoadBoard from "@/components/home/HomeLoadBoard";
import HomeCarrierList from "@/components/home/HomeCarrierList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [userType, setUserType] = useState<"shipper" | "driver">("shipper");
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("loads");

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection userType={userType} setUserType={setUserType} />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Transport Marketplace</h2>
          <p className="text-gray-600">Browse available loads and carriers in our network</p>
        </div>
        
        <Tabs defaultValue="loads" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="loads">Available Loads</TabsTrigger>
            <TabsTrigger value="carriers">Carrier Network</TabsTrigger>
          </TabsList>
          <TabsContent value="loads" className="mt-2">
            <HomeLoadBoard isAuthenticated={isAuthenticated} />
          </TabsContent>
          <TabsContent value="carriers" className="mt-2">
            <HomeCarrierList isAuthenticated={isAuthenticated} />
          </TabsContent>
        </Tabs>
      </div>
      
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection userType={userType} setUserType={setUserType} />
    </div>
  );
};

export default Index;
