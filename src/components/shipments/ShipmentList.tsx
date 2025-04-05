
import React, { useState } from "react";
import ShipmentCard from "./ShipmentCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext"; 
import { Package } from "lucide-react";

export interface ShipmentListProps {
  shipments: any[];
  onShipmentUpdate: (updatedShipment: any) => void;
  disableActions?: boolean;
  emptyStateMessage?: string;
}

const ShipmentList: React.FC<ShipmentListProps> = ({ 
  shipments, 
  onShipmentUpdate,
  disableActions = false,
  emptyStateMessage = "No shipments found matching your criteria." 
}) => {
  const { user, isApproved } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Determine if the user is a carrier or shipper
  const isCarrier = user?.role === "carrier";

  // Filter shipments based on search term and status
  const filteredShipments = shipments.filter(shipment => {
    // For carriers, only show shipments assigned to them or with "pending" status
    if (isCarrier) {
      if (shipment.driverId && shipment.driverId !== user?.id) {
        return false;
      }
    }
    
    // Apply status filter if selected
    if (statusFilter && shipment.status !== statusFilter) {
      return false;
    }
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        shipment.origin.toLowerCase().includes(searchLower) ||
        shipment.destination.toLowerCase().includes(searchLower) ||
        shipment.freight.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // Show search/filter controls only if we have shipments initially
  const showControls = shipments.length > 0;

  // If no shipments after filtering, show a message
  if (filteredShipments.length === 0) {
    return (
      <div>
        {showControls && (
          <div className="mb-4 flex flex-col gap-4">
            <Input
              placeholder="Search by origin, destination, or freight type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={statusFilter || ''} onValueChange={value => setStatusFilter(value || null)}>
              <SelectTrigger className="max-w-sm">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="text-center py-12 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{emptyStateMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-4">
        <Input
          placeholder="Search by origin, destination, or freight type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter || ''} onValueChange={value => setStatusFilter(value || null)}>
          <SelectTrigger className="max-w-sm">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="in_transit">In Transit</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredShipments.map(shipment => (
          <ShipmentCard 
            key={shipment.id} 
            shipment={shipment} 
            onUpdate={onShipmentUpdate}
            isDriver={isCarrier}
            disableActions={disableActions || !isApproved}
          />
        ))}
      </div>
    </div>
  );
};

export default ShipmentList;
