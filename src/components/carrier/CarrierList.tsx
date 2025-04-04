
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const CarrierList = () => {
  const navigate = useNavigate();
  const [showBlur, setShowBlur] = useState(false);

  const carriers = [
    { name: "Never Late Express", city: "Bakersfield, CA", dot: "3522606", status: "Active" },
    { name: "Alias Trucking Company", city: "Azusa, CA", dot: "1234567", status: "Active" },
    { name: "A Rivas Trucking", city: "Madera, CA", dot: "1635351", status: "Active" }
  ];

  const handleViewCarrier = () => {
    setShowBlur(true);
  };

  const handleCreateAccount = () => {
    navigate("/auth?mode=register");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Carrier Directory</h1>
      
      <div className="overflow-x-auto">
        <Table className="min-w-full bg-[#132947] rounded-lg">
          <TableHeader>
            <TableRow className="border-gray-800 hover:bg-[#1a2334]">
              <TableHead className="text-gray-300">Company</TableHead>
              <TableHead className="text-gray-300">City, State</TableHead>
              <TableHead className="text-gray-300">DOT Number</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carriers.map((carrier, index) => (
              <TableRow 
                key={index} 
                className="border-gray-800 hover:bg-[#1B3252]"
              >
                <TableCell className="font-medium">{carrier.name}</TableCell>
                <TableCell>{carrier.city}</TableCell>
                <TableCell>{carrier.dot}</TableCell>
                <TableCell>
                  <span className="bg-green-500 px-2 py-1 rounded-full text-xs">{carrier.status}</span>
                </TableCell>
                <TableCell>
                  <Button 
                    onClick={handleViewCarrier}
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

      {showBlur && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-black text-center">
            <h2 className="text-2xl font-bold mb-4">Create an Account</h2>
            <p className="mb-6">Unlock full carrier details like phone, MC#, and address.</p>
            <Button
              onClick={handleCreateAccount}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
            >
              Create Account
            </Button>
            <button
              onClick={() => setShowBlur(false)}
              className="mt-4 text-gray-600 hover:underline text-sm"
            >
              Browse More
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarrierList;
