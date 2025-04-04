
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TruckIcon, Calendar, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Sample load data
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
  {
    id: "load5",
    pickup: "Boston, MA",
    delivery: "Washington, DC",
    pickupDate: "2023-05-13",
    deliveryDate: "2023-05-14",
    freightType: "Medical Supplies",
    weight: "3,200 lbs",
    price: 950,
  },
  {
    id: "load6",
    pickup: "Denver, CO",
    delivery: "Salt Lake City, UT",
    pickupDate: "2023-05-15",
    deliveryDate: "2023-05-16",
    freightType: "Construction Materials",
    weight: "22,000 lbs",
    price: 1600,
  },
  {
    id: "load7",
    pickup: "New York, NY",
    delivery: "Philadelphia, PA",
    pickupDate: "2023-05-12",
    deliveryDate: "2023-05-13",
    freightType: "Retail Goods",
    weight: "6,500 lbs",
    price: 750,
  },
];

const LoadBoardPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [viewedLoads, setViewedLoads] = useState<string[]>([]);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleViewLoad = (loadId: string) => {
    if (!isAuthenticated && viewedLoads.length >= 2 && !viewedLoads.includes(loadId)) {
      setShowLoginDialog(true);
      return;
    }
    
    if (!viewedLoads.includes(loadId)) {
      setViewedLoads([...viewedLoads, loadId]);
    }
  };

  const handleAcceptLoad = (loadId: string) => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }
    
    // In a real application, this would make an API call to accept the load
    alert(`Load ${loadId} accepted successfully!`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Load Board</h1>
      <p className="text-gray-600 mb-6">
        Browse available loads and find your next shipment
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleLoads.map((load) => {
          const isViewed = viewedLoads.includes(load.id) || isAuthenticated;
          const shouldBlur = !isViewed && viewedLoads.length >= 2;
          
          return (
            <Card 
              key={load.id} 
              className={`overflow-hidden h-full flex flex-col transition-all hover:shadow-md ${
                shouldBlur ? "opacity-70" : ""
              }`}
              onClick={() => handleViewLoad(load.id)}
            >
              <CardContent className="p-5 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1 flex items-center">
                      <MapPin size={16} className="mr-1 text-brand-blue" />
                      {load.pickup}
                    </h3>
                    <h3 className="font-semibold text-lg flex items-center">
                      <MapPin size={16} className="mr-1 text-brand-green" />
                      {load.delivery}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-brand-blue">
                      ${load.price}
                    </div>
                  </div>
                </div>
                
                <div className={`space-y-2 ${shouldBlur ? "blur-md" : ""}`}>
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
                    <TruckIcon size={14} className="mr-2 text-gray-500" />
                    <div>
                      <span className="text-gray-600">Freight: </span>
                      <span>{load.freightType}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <span className="mr-2">📦</span>
                    <div>
                      <span className="text-gray-600">Weight: </span>
                      <span>{load.weight}</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className={`mt-4 w-full ${shouldBlur ? "blur-md" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAcceptLoad(load.id);
                  }}
                >
                  Accept Shipment
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create account dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Create an Account to Book Loads</DialogTitle>
            <DialogDescription>
              Get full access to all loads and start booking shipments today.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <p className="text-gray-600">
              Creating an account allows you to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>View all available loads</li>
              <li>Book shipments directly on the platform</li>
              <li>Track your shipments in real-time</li>
              <li>Get paid faster with our secure payment system</li>
            </ul>
            <div className="flex gap-3 mt-2">
              <Button 
                className="flex-1" 
                onClick={() => {
                  setShowLoginDialog(false);
                  navigate("/auth?mode=register");
                }}
              >
                Sign Up
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setShowLoginDialog(false);
                  navigate("/auth?mode=login");
                }}
              >
                Log In
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoadBoardPage;
