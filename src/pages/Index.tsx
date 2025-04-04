
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
        <Link to="/carriers">
          <Button 
            variant="outline" 
            className="bg-[#1f2937] text-white hover:bg-[#374151] border-0 px-6 py-6 text-lg font-bold"
            size="lg"
          >
            Browse Carriers
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
