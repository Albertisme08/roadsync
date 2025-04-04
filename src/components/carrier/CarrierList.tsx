
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, MapPin, Phone } from "lucide-react";

interface Carrier {
  name: string;
  city: string;
  blurredPhone: string;
}

const CarrierList = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const carriers = [
    { name: "Never Late Express Inc", city: "Palmdale, CA", blurredPhone: "XXX-XXX-XXXX" },
    { name: "A Rivas Trucking LLC", city: "Madera, CA", blurredPhone: "XXX-XXX-XXXX" },
    { name: "Best Moving Service", city: "Anaheim, CA", blurredPhone: "XXX-XXX-XXXX" },
    { name: "Speedy Freight Carriers", city: "San Diego, CA", blurredPhone: "XXX-XXX-XXXX" },
    { name: "Mountain Express Logistics", city: "Denver, CO", blurredPhone: "XXX-XXX-XXXX" },
    { name: "Reliable Transit Solutions", city: "Phoenix, AZ", blurredPhone: "XXX-XXX-XXXX" },
  ];

  const handleViewDetails = (carrier: Carrier) => {
    if (!isAuthenticated) {
      navigate("/auth?mode=register&from=/carriers");
    } else {
      // In a real application, this would show full carrier details
      // For now, we'll just show an alert with the carrier name
      alert(`Viewing details for ${carrier.name}`);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Find Certified Carriers</h1>
      <p className="text-gray-600 mb-6">
        Browse our network of FMCSA-certified carriers ready to move your freight
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {carriers.map((carrier, index) => (
          <Card key={index} className="overflow-hidden h-full flex flex-col transition-all hover:shadow-md">
            <CardContent className="p-5 flex-grow">
              <div className="mb-4">
                <h2 className="font-semibold text-lg flex items-center">
                  <Building2 size={18} className="mr-2 text-brand-blue" />
                  {carrier.name}
                </h2>
                <p className="text-gray-600 ml-6 flex items-center">
                  <MapPin size={16} className="mr-1 text-gray-500" />
                  {carrier.city}
                </p>
                <p className="text-gray-400 ml-6 flex items-center">
                  <Phone size={16} className="mr-1 text-gray-500" />
                  {isAuthenticated ? "(626) 555-1234" : carrier.blurredPhone}
                </p>
              </div>
              
              <Button 
                className="w-full mt-auto"
                onClick={() => handleViewDetails(carrier)}
              >
                {isAuthenticated ? "View Full Details" : "Unlock Carrier Details"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {!isAuthenticated && (
        <div className="mt-10 p-6 bg-blue-50 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-brand-blue mb-2">
            Create an Account to Access Full Carrier Details
          </h2>
          <p className="text-gray-700 mb-4">
            Join RoadSync to view complete carrier information including DOT numbers, MC numbers, and direct contact details.
          </p>
          <Button 
            onClick={() => navigate("/auth?mode=register")}
            className="px-6"
          >
            Sign Up Now
          </Button>
        </div>
      )}
    </div>
  );
};

export default CarrierList;
