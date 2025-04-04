
import React, { useState } from "react";
import { Link } from "react-router-dom";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CTASection from "@/components/home/CTASection";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [userType, setUserType] = useState<"shipper" | "driver">("shipper");

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection userType={userType} setUserType={setUserType} />
      
      <div className="bg-white py-8 text-center">
        <Link to="/post-load">
          <Button 
            variant="outline" 
            className="bg-blue-700 text-white hover:bg-blue-800 border-0 px-6 py-2"
          >
            Post a Load
          </Button>
        </Link>
      </div>
      
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection userType={userType} setUserType={setUserType} />
    </div>
  );
};

export default Index;
