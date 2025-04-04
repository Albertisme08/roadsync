
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Package, Lock } from "lucide-react";
import CreateAccountModal from "@/components/carrier/CreateAccountModal";

interface HomeLoadBoardProps {
  isAuthenticated: boolean;
}

const HomeLoadBoard: React.FC<HomeLoadBoardProps> = ({ isAuthenticated }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedLoadId, setSelectedLoadId] = useState<string | null>(null);
  
  // Sample load data from LoadBoardPage
  const sampleLoads = [
    {
      id: "load1",
      pickup: "Chicago, IL",
      delivery: "Detroit, MI",
      pickupDate: "2023-05-12",
      deliveryDate: "2023-05-13",
      freightType: "Automotive Parts",
      weight: "8,500 lbs",
      price: 1450,
    },
    {
      id: "load2",
      pickup: "Atlanta, GA",
      delivery: "Miami, FL",
      pickupDate: "2023-05-14",
      deliveryDate: "2023-05-16",
      freightType: "General Merchandise",
      weight: "12,000 lbs",
      price: 1850,
    },
    {
      id: "load3",
      pickup: "Dallas, TX",
      delivery: "Phoenix, AZ",
      pickupDate: "2023-05-15",
      deliveryDate: "2023-05-17",
      freightType: "Electronics",
      weight: "5,000 lbs",
      price: 1700,
    },
    {
      id: "load4",
      pickup: "Los Angeles, CA",
      delivery: "Seattle, WA",
      pickupDate: "2023-05-16",
      deliveryDate: "2023-05-19",
      freightType: "Fresh Produce",
      weight: "15,000 lbs",
      price: 2800,
    },
  ];

  const handleViewLoad = (loadId: string) => {
    if (!isAuthenticated) {
      setSelectedLoadId(loadId);
      setShowAuthModal(true);
    } else {
      // Handle authenticated user view
      console.log(`Authenticated user viewing load: ${loadId}`);
    }
  };

  // Auto-refresh simulation (optional)
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Refreshing load data...");
      // In a real app, you would fetch new data here
    }, 60000); // 1 minute

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sampleLoads.map((load) => (
          <Card 
            key={load.id} 
            className="overflow-hidden h-full flex flex-col transition-all hover:shadow-md cursor-pointer"
          >
            <CardContent className="p-5 flex-grow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1 flex items-center">
                    <MapPin size={16} className="mr-1 text-blue-600" />
                    {load.pickup}
                  </h3>
                  <h3 className="font-semibold text-lg flex items-center">
                    <MapPin size={16} className="mr-1 text-green-600" />
                    {load.delivery}
                  </h3>
                </div>
                <div className="text-right relative">
                  <div className="flex items-center">
                    <Lock size={12} className="mr-1 text-gray-500" />
                    <div className="text-xl font-bold text-blue-600 blur-sm opacity-50">
                      ${load.price}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar size={14} className="mr-2 text-gray-500" />
                  <div>
                    <span className="text-gray-600">Pickup: </span>
                    <span>{load.pickupDate}</span>
                  </div>
                </div>
                
                <div className="flex items-center text-sm">
                  <Calendar size={14} className="mr-2 text-gray-500" />
                  <div>
                    <span className="text-gray-600">Delivery: </span>
                    <span>{load.deliveryDate}</span>
                  </div>
                </div>
                
                <div className="flex items-center text-sm">
                  <Package size={14} className="mr-2 text-gray-500" />
                  <div>
                    <span className="text-gray-600">Freight: </span>
                    <span>{load.freightType}</span>
                  </div>
                </div>
                
                <div className="flex items-center text-sm">
                  <span className="mr-2">📦</span>
                  <div className="flex items-center">
                    <Lock size={12} className="mr-1 text-gray-500" />
                    <div className="blur-sm opacity-50">
                      {load.weight}
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                className="mt-4 w-full"
                onClick={() => handleViewLoad(load.id)}
              >
                View Load Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateAccountModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default HomeLoadBoard;
