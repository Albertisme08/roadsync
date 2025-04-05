
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLoad } from "@/contexts/LoadContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TruckIcon, Calendar, MapPin, Lock, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";

const LoadBoardPage = () => {
  const { isAuthenticated, isApproved } = useAuth();
  const { approvedLoads } = useLoad(); // Only show approved loads
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

  const formatDateDisplay = (date: Date | string) => {
    if (date instanceof Date) {
      return format(date, 'MMM dd, yyyy');
    }
    return format(new Date(date), 'MMM dd, yyyy');
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
        {approvedLoads.length === 0 ? (
          <div className="col-span-3 text-center py-16 border rounded-md">
            <p className="text-gray-500 mb-2">No approved loads available at this time.</p>
            <p className="text-sm text-gray-400">Please check back later for new opportunities.</p>
          </div>
        ) : (
          approvedLoads.map((load) => (
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
                      {load.pickupLocation}
                    </h3>
                    <h3 className="font-semibold text-lg flex items-center">
                      <MapPin size={16} className="mr-1 text-brand-green" />
                      {load.deliveryLocation}
                    </h3>
                  </div>
                  <div className="text-right relative">
                    <div className="flex items-center">
                      <Lock size={12} className="mr-1 text-gray-500" />
                      <div className="text-xl font-bold text-brand-blue blur-sm opacity-50">
                        ${load.rate}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar size={14} className="mr-2 text-gray-500" />
                    <div>
                      <span className="text-gray-600">Available: </span>
                      <span>{formatDateDisplay(load.availableDate)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <TruckIcon size={14} className="mr-2 text-gray-500" />
                    <div>
                      <span className="text-gray-600">Equipment: </span>
                      <span>{load.equipmentType}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <span className="mr-2">📦</span>
                    <div>
                      <span className="text-gray-600">Weight: </span>
                      <span>{load.weight} lbs</span>
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
          ))
        )}
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
