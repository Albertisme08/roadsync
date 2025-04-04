
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import CreateAccountModal from "./CreateAccountModal";
import CarrierDetailModal from "./CarrierDetailModal";

const CarrierList = () => {
  const [showRequestAccessModal, setShowRequestAccessModal] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCarrier, setSelectedCarrier] = useState<any>(null);
  const [showCarrierModal, setShowCarrierModal] = useState(false);

  const carriers = [
    { name: "Never Late Express Inc", city: "Bakersfield, CA", dot: "3522606", equipment: "Refrigerated", status: "Active" },
    { name: "Alias Trucking Company", city: "Azusa, CA", dot: "—", equipment: "General Freight", status: "Active" },
    { name: "Rivas Trucking LLC", city: "Madera, CA", dot: "1635351", equipment: "General Freight", status: "Active" },
    { name: "FastTruck", city: "Atlanta, GA", dot: "1234567", equipment: "General Freight", status: "Active" },
    { name: "Eagle", city: "Mesa, AZ", dot: "9132736", equipment: "General Freight", status: "Active" },
    { name: "Speedy", city: "Columbus, OH", dot: "—", equipment: "General Freight", status: "Active" },
    { name: "Railable", city: "Springfield, MO", dot: "—", equipment: "Refrigerated", status: "Active" },
    { name: "Transport", city: "Jackson, MS", dot: "—", equipment: "Flatbed", status: "Active" }
  ];

  const filteredCarriers = carriers.filter(carrier =>
    carrier.name.toLowerCase().includes(search.toLowerCase()) ||
    carrier.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewCarrier = (carrier: any) => {
    setSelectedCarrier(carrier);
    setShowCarrierModal(true);
  };

  return (
    <div className="container mx-auto py-8 px-4 bg-[#132947] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Carrier Network</h1>
      
      <div className="relative mb-6 w-full md:w-1/2">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by Carrier or City"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-[#1a2334] border-gray-700 text-white placeholder:text-gray-400 focus-visible:ring-blue-500 w-full"
        />
      </div>
      
      <div className="overflow-x-auto">
        <Table className="min-w-full bg-[#132947] rounded-lg border-collapse">
          <TableHeader>
            <TableRow className="border-b border-gray-800 hover:bg-[#1a2334]">
              <TableHead className="text-gray-300">Carrier Name</TableHead>
              <TableHead className="text-gray-300">DOT Number</TableHead>
              <TableHead className="text-gray-300">Equipment</TableHead>
              <TableHead className="text-gray-300">City, State</TableHead>
              <TableHead className="text-right text-gray-300">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCarriers.map((carrier, index) => (
              <TableRow 
                key={index} 
                className="border-b border-gray-800 hover:bg-[#1B3252]"
              >
                <TableCell className="font-medium text-white">{carrier.name}</TableCell>
                <TableCell className="text-white">{carrier.dot}</TableCell>
                <TableCell className="text-white">{carrier.equipment}</TableCell>
                <TableCell className="text-white">{carrier.city}</TableCell>
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
    </div>
  );
};

export default CarrierList;
