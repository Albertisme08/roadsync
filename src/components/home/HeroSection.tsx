
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, Truck, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type UserType = "shipper" | "driver";

interface HeroSectionProps {
  userType: UserType;
  setUserType: (type: UserType) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ userType, setUserType }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleExploreClick = () => {
    // Just navigate to shipments - signup will happen when they try to book
    navigate("/shipments");
  };

  return (
    <section className="hero-gradient text-white py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Connect Shippers with Drivers for Seamless Freight Transport
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              RoadSync is a modern platform that streamlines the logistics process, 
              helping shippers find reliable drivers and enabling drivers to find 
              consistent, well-paying loads.
            </p>
            <div className="flex flex-col space-y-4 pt-4">
              <div className="flex justify-center sm:justify-start">
                <div className="bg-white/10 p-1 rounded-lg inline-flex">
                  <Button 
                    variant={userType === "shipper" ? "default" : "ghost"} 
                    className={userType === "shipper" ? "bg-white text-brand-blue" : "text-white hover:bg-white/20"}
                    onClick={() => setUserType("shipper")}
                  >
                    <Package className="mr-2 h-5 w-5" />
                    I'm a Shipper
                  </Button>
                  <Button 
                    variant={userType === "driver" ? "default" : "ghost"} 
                    className={userType === "driver" ? "bg-white text-brand-blue" : "text-white hover:bg-white/20"}
                    onClick={() => setUserType("driver")}
                  >
                    <Truck className="mr-2 h-5 w-5" />
                    I'm a Carrier
                  </Button>
                </div>
              </div>
              <Button 
                size="lg" 
                className="bg-brand-blue text-white hover:bg-brand-blue/90 border border-white/20"
                onClick={isAuthenticated ? () => navigate("/dashboard") : handleExploreClick}
              >
                {isAuthenticated ? "Go to Dashboard" : `Sign Up`}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative">
              <div className="w-full h-full max-w-md bg-white/10 backdrop-blur-sm rounded-lg p-8 flex items-center justify-center">
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" style={{ animationDuration: '3s', animationIterationCount: 'infinite' }}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Truck className="h-32 w-32 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
