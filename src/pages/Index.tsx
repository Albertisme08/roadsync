
import React, { useState } from "react";
import { Link } from "react-router-dom";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  const [userType, setUserType] = useState<"shipper" | "driver">("shipper");

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection userType={userType} setUserType={setUserType} />
      
      <div className="bg-white py-8 text-center flex gap-4 justify-center">
        <Link to="/shipments">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md transition duration-300">
            Post a Load
          </button>
        </Link>
        <Link to="/carriers">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md transition duration-300">
            Carriers
          </button>
        </Link>
      </div>
      
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection userType={userType} setUserType={setUserType} />
    </div>
  );
};

export default Index;
