
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CTASection from "@/components/home/CTASection";
import { useAuth } from "@/contexts/AuthContext";
import HomeLoadBoard from "@/components/home/HomeLoadBoard";
import HomeCarrierList from "@/components/home/HomeCarrierList";

const Index = () => {
  const [userType, setUserType] = useState<"shipper" | "driver">("shipper");
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection userType={userType} setUserType={setUserType} />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Transport Marketplace</h2>
          <p className="text-gray-600">Browse available loads and carriers in our network</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Available Loads</h3>
            <HomeLoadBoard isAuthenticated={isAuthenticated} />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Carrier Network</h3>
            <HomeCarrierList isAuthenticated={isAuthenticated} />
          </div>
        </div>
      </div>
      
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection userType={userType} setUserType={setUserType} />
    </div>
  );
};

export default Index;
