
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Lock } from "lucide-react";
import CarrierDetailModal from "@/components/carrier/CarrierDetailModal";
import CreateAccountModal from "@/components/carrier/CreateAccountModal";

interface HomeCarrierListProps {
  isAuthenticated: boolean;
}

const HomeCarrierList: React.FC<HomeCarrierListProps> = ({ isAuthenticated }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<any>(null);
  const [showCarrierModal, setShowCarrierModal] = useState(false);

  const carriers = [
    { name: "Never Late Express Inc", city: "Bakersfield, CA", dot: "3522606", equipment: "Refrigerated", status: "Active" },
    { name: "Alias Trucking Company", city: "Azusa, CA", dot: "—", equipment: "General Freight", status: "Active" },
    { name: "Rivas Trucking LLC", city: "Madera, CA", dot: "1635351", equipment: "General Freight", status: "Active" },
    { name: "FastTruck", city: "Atlanta, GA", dot: "1234567", equipment: "General Freight", status: "Active" },
    { name: "Eagle", city: "Mesa, AZ", dot: "9132736", equipment: "General Freight", status: "Active" },
  ];

  const handleViewCarrier = (carrier: any) => {
    setSelectedCarrier(carrier);
    if (isAuthenticated) {
      setShowCarrierModal(true);
    } else {
      setShowAuthModal(true);
    }
  };

  // Auto-refresh for real-time feel
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Refreshing carrier data...");
      // In a real app, you would fetch new data here
    }, 60000); // 1 minute refresh interval

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="overflow-x-auto border rounded-lg">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="hover:bg-gray-50">
              <TableHead>Carrier Name</TableHead>
              <TableHead>
                <div className="flex items-center">
                  <Lock size={12} className="mr-1 text-gray-500" />
                  <span className="blur-sm opacity-50">DOT Number</span>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  <Lock size={12} className="mr-1 text-gray-500" />
                  <span className="blur-sm opacity-50">Equipment</span>
                </div>
              </TableHead>
              <TableHead>City, State</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carriers.map((carrier, index) => (
              <TableRow 
                key={index} 
                className="hover:bg-gray-50"
              >
                <TableCell className="font-medium">{carrier.name}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Lock size={12} className="mr-1 text-gray-500" />
                    <span className="blur-sm opacity-50">{carrier.dot}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Lock size={12} className="mr-1 text-gray-500" />
                    <span className="blur-sm opacity-50">{carrier.equipment}</span>
                  </div>
                </TableCell>
                <TableCell>{carrier.city}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    onClick={() => handleViewCarrier(carrier)}
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    View Carrier
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CarrierDetailModal
        isOpen={showCarrierModal}
        onClose={() => setShowCarrierModal(false)}
        carrier={selectedCarrier}
      />

      <CreateAccountModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default HomeCarrierList;
