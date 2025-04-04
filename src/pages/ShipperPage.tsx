
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ShipperForm from "@/components/shipper/ShipperForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShieldCheck } from "lucide-react";

// Sample carrier data
const sampleCarriers = [
  { id: 1, name: "FastTruck Logistics", mcNumber: "MC-123456", dotNumber: "DOT-789101", equipment: "Flatbed, Van", states: "CA, NV, AZ, TX" },
  { id: 2, name: "Eagle Express", mcNumber: "MC-234567", dotNumber: "DOT-891012", equipment: "Reefer, Van", states: "FL, GA, SC, NC" },
  { id: 3, name: "Reliable Transport", mcNumber: "MC-345678", dotNumber: "DOT-901234", equipment: "Van, Specialized", states: "NY, NJ, PA, CT" },
  { id: 4, name: "Horizon Carriers", mcNumber: "MC-456789", dotNumber: "DOT-123456", equipment: "Flatbed, Specialized", states: "IL, IN, OH, MI" },
  { id: 5, name: "Pacific Routes", mcNumber: "MC-567890", dotNumber: "DOT-234567", equipment: "Reefer, Flatbed", states: "WA, OR, CA, ID" },
];

const ShipperPage = () => {
  const { isAuthenticated } = useAuth();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRequestAccess = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your interest. Our team will review your request and contact you shortly.");
    setShowRequestForm(false);
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Shipper Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Access our exclusive network of verified carriers or post loads directly to our platform
      </p>

      {isAuthenticated ? (
        <div className="space-y-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Verified Carrier Network</h2>
                  <p className="text-sm text-gray-500">
                    Access to pre-vetted, reliable carriers with proven track records
                  </p>
                </div>
                <div className="flex items-center text-green-700 bg-green-50 px-3 py-1 rounded-full">
                  <ShieldCheck className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Verified Shippers Only</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Carrier Name</TableHead>
                      <TableHead>MC Number</TableHead>
                      <TableHead>DOT Number</TableHead>
                      <TableHead>Equipment</TableHead>
                      <TableHead>States Covered</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleCarriers.map((carrier) => (
                      <TableRow key={carrier.id}>
                        <TableCell>{carrier.name}</TableCell>
                        <TableCell className="blur-sm hover:blur-none transition-all">
                          {carrier.mcNumber}
                        </TableCell>
                        <TableCell className="blur-sm hover:blur-none transition-all">
                          {carrier.dotNumber}
                        </TableCell>
                        <TableCell className="blur-sm hover:blur-none transition-all">
                          {carrier.equipment}
                        </TableCell>
                        <TableCell className="blur-sm hover:blur-none transition-all">
                          {carrier.states}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Hover over blurred information for a preview. Full access requires verification.
              </p>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Post a Load</h2>
          <ShipperForm />
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Carrier Network Preview</h2>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Carrier Name</TableHead>
                      <TableHead>MC Number</TableHead>
                      <TableHead>DOT Number</TableHead>
                      <TableHead>Equipment</TableHead>
                      <TableHead>States Covered</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleCarriers.slice(0, 3).map((carrier) => (
                      <TableRow key={carrier.id}>
                        <TableCell>{carrier.name}</TableCell>
                        <TableCell className="blur-md">{carrier.mcNumber}</TableCell>
                        <TableCell className="blur-md">{carrier.dotNumber}</TableCell>
                        <TableCell className="blur-md">{carrier.equipment}</TableCell>
                        <TableCell className="blur-md">{carrier.states}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-center mt-8">
                {!showRequestForm ? (
                  <Button 
                    className="px-8 py-6 text-lg bg-brand-blue hover:bg-brand-blue/90"
                    onClick={() => setShowRequestForm(true)}
                  >
                    Request Access to Carrier Network
                  </Button>
                ) : (
                  <form onSubmit={handleRequestAccess} className="w-full max-w-lg space-y-4">
                    <h3 className="text-lg font-medium mb-4">Request Shipper Access</h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label htmlFor="companyName" className="block text-sm font-medium mb-1">
                          Company Name
                        </label>
                        <input 
                          type="text" 
                          id="companyName" 
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          required
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="contactName" className="block text-sm font-medium mb-1">
                          Contact Name
                        </label>
                        <input 
                          type="text" 
                          id="contactName" 
                          name="contactName"
                          value={formData.contactName}
                          onChange={handleInputChange}
                          required
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                          Email
                        </label>
                        <input 
                          type="email" 
                          id="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-1">
                          Phone
                        </label>
                        <input 
                          type="tel" 
                          id="phone" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center bg-blue-50 p-3 rounded-md mb-4">
                      <ShieldCheck className="h-5 w-5 text-blue-600 mr-2" />
                      <p className="text-sm text-blue-700">
                        Only verified shippers are granted access to our carrier network.
                      </p>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90">
                        Submit Request
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setShowRequestForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ShipperPage;
