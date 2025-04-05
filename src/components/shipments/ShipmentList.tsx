
import React, { useState } from "react";
import ShipmentCard from "./ShipmentCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext"; 

export interface ShipmentListProps {
  shipments: any[];
  onShipmentUpdate: (updatedShipment: any) => void;
  disableActions?: boolean;
}

const ShipmentList: React.FC<ShipmentListProps> = ({ 
  shipments, 
  onShipmentUpdate,
  disableActions = false 
}) => {
  const { user, isApproved } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Determine if the user is a driver or shipper
  const isDriver = user?.role === "driver";

  // Filter shipments based on search term and status
  const filteredShipments = shipments.filter(shipment => {
    // For drivers, only show shipments assigned to them or with "pending" status
    if (isDriver) {
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

  // If no shipments after filtering, show a message
  if (filteredShipments.length === 0) {
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
        <div className="text-center py-12">
          <p className="text-gray-500">No shipments found matching your criteria.</p>
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
            isDriver={isDriver}
            disableActions={disableActions || !isApproved}
          />
        ))}
      </div>
    </div>
  );
};

export default ShipmentList;
