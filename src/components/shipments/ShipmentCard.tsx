
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Calendar, TruckIcon, Package, DollarSign, Clock } from "lucide-react";

export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  date: string;
  deliveryDate: string;
  freight: string;
  weight: string;
  price: number;
  driverId?: string;
  status: "pending" | "accepted" | "in_transit" | "delivered";
}

interface ShipmentCardProps {
  shipment: Shipment;
  onAccept?: (id: string) => void;
}

const ShipmentCard: React.FC<ShipmentCardProps> = ({ shipment, onAccept }) => {
  const { user } = useAuth();
  const isDriver = user?.role === "driver";
  const canAccept = isDriver && shipment.status === "pending";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "accepted":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in_transit":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "accepted":
        return "Accepted";
      case "in_transit":
        return "In Transit";
      case "delivered":
        return "Delivered";
      default:
        return status;
    }
  };

  const handleAccept = () => {
    if (onAccept) {
      onAccept(shipment.id);
    }
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{shipment.origin} to {shipment.destination}</CardTitle>
          <Badge className={getStatusColor(shipment.status)}>
            {formatStatus(shipment.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-brand-blue" />
            <span className="text-gray-600">Origin:</span>
            <span className="font-medium">{shipment.origin}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-brand-green" />
            <span className="text-gray-600">Destination:</span>
            <span className="font-medium">{shipment.destination}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Pickup:</span>
            <span className="font-medium">{shipment.date}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-green-500" />
            <span className="text-gray-600">Delivery:</span>
            <span className="font-medium">{shipment.deliveryDate || "Not specified"}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Package className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Freight:</span>
            <span className="font-medium">{shipment.freight}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <TruckIcon className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Weight:</span>
            <span className="font-medium">{shipment.weight}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Price:</span>
            <span className="font-medium">${shipment.price.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        {canAccept && (
          <Button 
            onClick={handleAccept} 
            className="w-full"
          >
            Accept Shipment
          </Button>
        )}
        {!canAccept && isDriver && (
          <div className="flex items-center justify-center w-full text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {shipment.status === "accepted" ? "You accepted this shipment" : "This shipment is not available"}
          </div>
        )}
        {!isDriver && (
          <Button 
            variant="outline" 
            className="w-full"
          >
            View Details
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ShipmentCard;
