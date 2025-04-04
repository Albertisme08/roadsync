
import React, { useState } from "react";
import ShipmentCard, { Shipment } from "@/components/shipments/ShipmentCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ShipmentListProps {
  shipments: Shipment[];
  onShipmentUpdate?: (updatedShipment: Shipment) => void;
}

const ShipmentList: React.FC<ShipmentListProps> = ({ 
  shipments, 
  onShipmentUpdate 
}) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const handleAcceptShipment = (id: string) => {
    if (onShipmentUpdate) {
      const updatedShipment = shipments.find(s => s.id === id);
      if (updatedShipment && user) {
        const updated = { 
          ...updatedShipment, 
          status: "accepted" as const,
          driverId: user.id
        };
        onShipmentUpdate(updated);
        toast.success("Shipment accepted successfully!");
      }
    }
  };

  const filteredShipments = shipments.filter(shipment => {
    // Text search
    const matchesSearch = 
      searchTerm === "" ||
      shipment.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.freight.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = 
      filterStatus === "all" || 
      shipment.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Sort shipments
  const sortedShipments = [...filteredShipments].sort((a, b) => {
    switch (sortOrder) {
      case "price_high":
        return b.price - a.price;
      case "price_low":
        return a.price - b.price;
      // For demo purposes, we'll just use the id as a proxy for creation date
      case "newest":
        return b.id.localeCompare(a.id);
      case "oldest":
        return a.id.localeCompare(b.id);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search by origin, destination, or freight type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-4">
          <div className="w-full md:w-48">
            <Select
              value={filterStatus}
              onValueChange={setFilterStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-48">
            <Select
              value={sortOrder}
              onValueChange={setSortOrder}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {sortedShipments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No shipments found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedShipments.map((shipment) => (
            <ShipmentCard
              key={shipment.id}
              shipment={shipment}
              onAccept={handleAcceptShipment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShipmentList;
