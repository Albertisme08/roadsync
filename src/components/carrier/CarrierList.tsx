
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Building2, MapPin, Phone, Check } from "lucide-react";

interface Carrier {
  name: string;
  location: string;
  dotNumber: string;
  status: "Active" | "Inactive";
  mcNumber: string;
  address: string;
  phone: string;
  cargo?: string;
}

const CarrierList = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const carriers: Carrier[] = [
    { 
      name: "Never Late Express Inc", 
      location: "Bakersfield, CA", 
      dotNumber: "3522606", 
      status: "Active",
      mcNumber: "1169793",
      address: "123 Logistics Way, Bakersfield, CA",
      phone: "(626) 488-3309",
      cargo: "General Freight"
    },
    { 
      name: "Alias Trucking Company", 
      location: "Azusa, CA", 
      dotNumber: "", 
      status: "Active",
      mcNumber: "987654",
      address: "456 Transport Ave, Azusa, CA",
      phone: "(626) 555-1234",
      cargo: "General Freight"
    },
    { 
      name: "A Rivas Trucking LLC", 
      location: "Madera, CA", 
      dotNumber: "1635351", 
      status: "Active",
      mcNumber: "602898",
      address: "789 Hauler Blvd, Madera, CA",
      phone: "(559) 870-8606",
      cargo: "Refrigerated"
    },
    { 
      name: "Pacific Coast Transport", 
      location: "San Diego, CA", 
      dotNumber: "2458723", 
      status: "Active",
      mcNumber: "874231",
      address: "321 Harbor Drive, San Diego, CA",
      phone: "(619) 555-9876",
      cargo: "Flatbed"
    },
    { 
      name: "Mountain Express Logistics", 
      location: "Denver, CO", 
      dotNumber: "1987245", 
      status: "Active",
      mcNumber: "765432",
      address: "555 Summit Road, Denver, CO",
      phone: "(303) 555-4321",
      cargo: "General Freight"
    },
    { 
      name: "Reliable Transit Solutions", 
      location: "Phoenix, AZ", 
      dotNumber: "2103457", 
      status: "Active",
      mcNumber: "543210",
      address: "777 Desert Way, Phoenix, AZ",
      phone: "(602) 555-7890",
      cargo: "Specialized"
    },
  ];

  const handleViewCarrier = (carrier: Carrier) => {
    setSelectedCarrier(carrier);
    setShowDialog(true);
  };

  const handleCreateAccount = () => {
    setShowDialog(false);
    navigate("/auth?mode=register&from=/carriers");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-2 text-white">Carrier Directory</h1>
      <p className="text-gray-400 mb-8 max-w-3xl">
        Quickly view and connect with FMCSA-certified carriers ready to move your freight. Only basic 
        company information is shown. Full contact details are revealed after account creation.
      </p>
      
      {/* Desktop View - Table */}
      <div className="hidden md:block overflow-hidden rounded-lg border border-gray-800">
        <Table className="bg-[#131b2a]">
          <TableHeader className="bg-[#0d1420]">
            <TableRow className="border-gray-800 hover:bg-[#1a2334]">
              <TableHead className="text-gray-300">Carrier Name</TableHead>
              <TableHead className="text-gray-300">Home Base</TableHead>
              <TableHead className="text-gray-300">DOT Number</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carriers.map((carrier, index) => (
              <TableRow 
                key={index} 
                className="border-gray-800 hover:bg-[#1a2334]"
              >
                <TableCell className="font-medium">{carrier.name}</TableCell>
                <TableCell>{carrier.location}</TableCell>
                <TableCell>{carrier.dotNumber || "—"}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className={`h-2 w-2 rounded-full mr-2 ${carrier.status === "Active" ? "bg-green-500" : "bg-red-500"}`}></span>
                    {carrier.status}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    onClick={() => handleViewCarrier(carrier)}
                    variant="outline"
                    className="border-gray-700 hover:bg-blue-900 hover:text-white text-gray-300"
                  >
                    View Carrier
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View - Card layout */}
      <div className="md:hidden space-y-4">
        {carriers.map((carrier, index) => (
          <div 
            key={index} 
            className="bg-[#131b2a] p-4 rounded-lg border border-gray-800"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-white">{carrier.name}</h3>
              <div className="flex items-center">
                <span className={`h-2 w-2 rounded-full mr-2 ${carrier.status === "Active" ? "bg-green-500" : "bg-red-500"}`}></span>
                <span className="text-sm">{carrier.status}</span>
              </div>
            </div>
            <div className="space-y-1 mb-4">
              <p className="text-sm flex items-center">
                <MapPin size={14} className="mr-2 text-gray-400" />
                {carrier.location}
              </p>
              <p className="text-sm">DOT: {carrier.dotNumber || "—"}</p>
            </div>
            <Button 
              onClick={() => handleViewCarrier(carrier)}
              className="w-full"
            >
              View Full Profile
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-12 mb-6 max-w-3xl">
        <p className="text-gray-400">
          Want to see full company details like MC Number, address, and driver count?
        </p>
        <Button 
          onClick={() => navigate("/auth?mode=register")}
          className="mt-4 bg-blue-700 hover:bg-blue-800 text-white px-6 py-6 text-lg"
          size="lg"
        >
          Create Free Account
        </Button>
      </div>

      {selectedCarrier && (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="bg-[#171f2e] text-gray-200 border-gray-800 sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl text-white">{selectedCarrier.name}</DialogTitle>
              <DialogDescription className="text-gray-400">
                {selectedCarrier.location}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3 py-4">
              <div className="flex justify-between">
                <span className="text-gray-400">DOT Number</span>
                <span className="font-medium">{selectedCarrier.dotNumber || "—"}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">MC Number</span>
                <span className="filter blur-sm">
                  {isAuthenticated ? selectedCarrier.mcNumber : "XXXXXXX"}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Address</span>
                <span className="filter blur-sm">
                  {isAuthenticated ? selectedCarrier.address : "XXXXXXX XXXXX"}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Phone</span>
                <span className="filter blur-sm">
                  {isAuthenticated ? selectedCarrier.phone : "XXX-XXX-XXXX"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Cargo</span>
                <span>{selectedCarrier.cargo || "General Freight"}</span>
              </div>
            </div>

            {!isAuthenticated && (
              <div className="bg-blue-900/40 p-4 rounded-lg my-4">
                <p className="text-center mb-4">Create an account to unlock full carrier profile</p>
                <Button 
                  onClick={handleCreateAccount}
                  className="w-full bg-blue-700 hover:bg-blue-800"
                >
                  Create Account to Unlock Full Carrier Profile
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CarrierList;
