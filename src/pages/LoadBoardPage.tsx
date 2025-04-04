
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
import { TruckIcon, Calendar, MapPin, Lock, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const { isAuthenticated, isApproved } = useAuth();
  const navigate = useNavigate();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [selectedLoadId, setSelectedLoadId] = useState<string | null>(null);

  const handleViewDetail = (loadId: string) => {
    // Just view the load, no restrictions
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }
    
    if (!isApproved) {
      // Don't allow detailed view for unapproved users
      return;
    }
    
    setSelectedLoadId(loadId);
  };

  const handleAcceptLoad = (loadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setSelectedLoadId(loadId);
      setShowLoginDialog(true);
      return;
    }
    
    if (!isApproved) {
      // Show approval required message
      return;
    }
    
    // Only proceed if user is approved
    setSelectedLoadId(loadId);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Load Board</h1>
      <p className="text-gray-600 mb-6">
        Browse available loads and find your next shipment
      </p>

      {isAuthenticated && !isApproved && (
        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
          <ShieldAlert className="h-5 w-5 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Account Pending Approval</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Your account is currently pending approval by an administrator. 
            You will be able to accept loads and view complete details once your account has been approved.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleLoads.map((load) => (
          <Card 
            key={load.id} 
            className="overflow-hidden h-full flex flex-col transition-all hover:shadow-md"
            onClick={() => handleViewDetail(load.id)}
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
                <div className="text-right relative">
                  <div className="flex items-center">
                    <Lock size={12} className="mr-1 text-gray-500" />
                    <div className="text-xl font-bold text-brand-blue blur-sm opacity-50">
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
                className="mt-4 w-full"
                onClick={(e) => handleAcceptLoad(load.id, e)}
                disabled={isAuthenticated && !isApproved}
              >
                {isAuthenticated && !isApproved 
                  ? "Approval Required" 
                  : "Accept Shipment"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create account dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Create an Account</DialogTitle>
            <DialogDescription>
              Create an account or log in to access this feature.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
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
