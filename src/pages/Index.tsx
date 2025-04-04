
import React, { useState } from "react";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  const [userType, setUserType] = useState<"shipper" | "driver">("shipper");

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection userType={userType} setUserType={setUserType} />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection userType={userType} setUserType={setUserType} />
    </div>
  );
};

export default Index;
