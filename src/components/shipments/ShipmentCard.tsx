
import React, { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ArrowRightIcon, MapPinIcon, CalendarIcon, TruckIcon, BoxIcon, LockIcon } from "lucide-react";
import { toast } from "@/lib/sonner";
import { useAuth } from "@/contexts/AuthContext";

export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  date: string;
  deliveryDate: string;
  freight: string;
  weight: string;
  price: number;
  status: "pending" | "accepted" | "in_transit" | "delivered" | "cancelled";
  driverId?: string;
}

interface ShipmentCardProps {
  shipment: Shipment;
  onUpdate: (updatedShipment: Shipment) => void;
  isDriver?: boolean;
  disableActions?: boolean;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  accepted: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  in_transit: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  delivered: "bg-green-100 text-green-800 hover:bg-green-100",
  cancelled: "bg-red-100 text-red-800 hover:bg-red-100",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  accepted: "Accepted",
  in_transit: "In Transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const ShipmentCard: React.FC<ShipmentCardProps> = ({ 
  shipment, 
  onUpdate, 
  isDriver = false,
  disableActions = false
}) => {
  const { isApproved } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const handleStatusChange = async (newStatus: Shipment["status"]) => {
    setSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedShipment = {
        ...shipment,
        status: newStatus,
      };
      
      onUpdate(updatedShipment);
      
      const actionMap = {
        accepted: "accepted",
        in_transit: "marked as in transit",
        delivered: "marked as delivered",
        cancelled: "cancelled",
      };
      
      toast.success(`Shipment ${actionMap[newStatus] || "updated"} successfully`);
      setShowDialog(false);
    } catch (error) {
      toast.error("Failed to update shipment status");
    } finally {
      setSubmitting(false);
    }
  };

  const isAssignedToMe = isDriver && shipment.driverId;
  const isPending = shipment.status === "pending";
  const isAccepted = shipment.status === "accepted";
  const isInTransit = shipment.status === "in_transit";

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardContent className="pt-6 pb-2 flex-grow">
          <div className="flex justify-between items-start mb-3">
            <Badge variant="outline" className={`${statusColors[shipment.status]}`}>
              {statusLabels[shipment.status]}
            </Badge>
            <div className={`font-semibold text-lg ${!isApproved ? "blur-sm" : ""}`}>
              ${shipment.price}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <MapPinIcon className="h-4 w-4 text-blue-500 mt-1 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Origin</p>
                <p className="font-medium">{shipment.origin}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <MapPinIcon className="h-4 w-4 text-green-500 mt-1 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Destination</p>
                <p className="font-medium">{shipment.destination}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CalendarIcon className="h-4 w-4 text-gray-400 mt-1 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Pickup Date</p>
                <p className="font-medium">{shipment.date}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <BoxIcon className="h-4 w-4 text-gray-400 mr-2" />
              <div className={`flex gap-1 items-center ${!isApproved ? "blur-sm" : ""}`}>
                <span className="text-gray-500">Type:</span> 
                <span>{shipment.freight}</span>
                {!isApproved && <LockIcon className="h-3 w-3 text-gray-400" />}
              </div>
            </div>
            
            <div className="flex items-center">
              <TruckIcon className="h-4 w-4 text-gray-400 mr-2" />
              <div className={`flex gap-1 items-center ${!isApproved ? "blur-sm" : ""}`}>
                <span className="text-gray-500">Weight:</span>
                <span>{shipment.weight}</span>
                {!isApproved && <LockIcon className="h-3 w-3 text-gray-400" />}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2 pb-6">
          {isDriver ? (
            // Driver actions
            isAssignedToMe || isPending ? (
              <Button 
                onClick={() => !disableActions && setShowDialog(true)}
                disabled={disableActions}
                className="w-full"
                variant={disableActions ? "outline" : "default"}
              >
                {isPending ? (
                  "Accept Shipment"
                ) : isAccepted ? (
                  "Mark as In Transit"
                ) : isInTransit ? (
                  "Mark as Delivered"
                ) : (
                  "View Details"
                )}
              </Button>
            ) : (
              <Button disabled className="w-full" variant="outline">
                Already Assigned
              </Button>
            )
          ) : (
            // Shipper actions
            <Button 
              onClick={() => !disableActions && setShowDialog(true)}
              className="w-full"
              variant={disableActions ? "outline" : "default"}
              disabled={disableActions}
            >
              {disableActions ? "Approval Required" : "Manage Shipment"}
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isDriver ? "Shipment Details" : "Manage Shipment"}</DialogTitle>
            <DialogDescription>
              {isDriver 
                ? "View details and update the status of this shipment" 
                : "View and manage your shipment details"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-1">Origin</p>
                <p>{shipment.origin}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Destination</p>
                <p>{shipment.destination}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Pickup Date</p>
                <p>{shipment.date}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Delivery Date</p>
                <p>{shipment.deliveryDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Freight Type</p>
                <p>{shipment.freight}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Weight</p>
                <p>{shipment.weight}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-1">Price</p>
              <p className="font-semibold text-lg">${shipment.price}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-1">Current Status</p>
              <Badge className={`${statusColors[shipment.status]}`}>
                {statusLabels[shipment.status]}
              </Badge>
            </div>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            {isDriver ? (
              <>
                {isPending && (
                  <Button 
                    onClick={() => handleStatusChange("accepted")} 
                    disabled={submitting}
                    className="w-full sm:w-auto"
                  >
                    Accept Shipment
                  </Button>
                )}
                
                {isAccepted && (
                  <Button 
                    onClick={() => handleStatusChange("in_transit")} 
                    disabled={submitting}
                    className="w-full sm:w-auto"
                  >
                    Start Transit
                  </Button>
                )}
                
                {isInTransit && (
                  <Button 
                    onClick={() => handleStatusChange("delivered")} 
                    disabled={submitting}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                  >
                    Mark as Delivered
                  </Button>
                )}
                
                {(isPending || isAccepted) && (
                  <Button 
                    variant="destructive" 
                    onClick={() => handleStatusChange("cancelled")} 
                    disabled={submitting}
                    className="w-full sm:w-auto"
                  >
                    Cancel Shipment
                  </Button>
                )}
              </>
            ) : (
              <>
                {isPending && (
                  <Button 
                    variant="destructive" 
                    onClick={() => handleStatusChange("cancelled")} 
                    disabled={submitting}
                    className="w-full sm:w-auto"
                  >
                    Cancel Shipment
                  </Button>
                )}
              </>
            )}
            
            <Button 
              variant="outline" 
              onClick={() => setShowDialog(false)} 
              disabled={submitting}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShipmentCard;
