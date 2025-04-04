
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ShipmentList from "@/components/shipments/ShipmentList";
import CreateShipmentForm from "@/components/shipments/CreateShipmentForm";
import { Shipment } from "@/components/shipments/ShipmentCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample shipment data (same as in Dashboard)
const sampleShipments: Shipment[] = [
  {
    id: "ship1",
    origin: "New York, NY",
    destination: "Boston, MA",
    date: "2023-04-15",
    deliveryDate: "2023-04-17",
    freight: "Electronics",
    weight: "5,000 lbs",
    price: 1200,
    status: "pending",
  },
  {
    id: "ship2",
    origin: "Chicago, IL",
    destination: "Detroit, MI",
    date: "2023-04-17",
    deliveryDate: "2023-04-19",
    freight: "Automotive Parts",
    weight: "8,500 lbs",
    price: 1850,
    status: "pending",
  },
  {
    id: "ship3",
    origin: "Seattle, WA",
    destination: "Portland, OR",
    date: "2023-04-20",
    deliveryDate: "2023-04-22",
    freight: "Furniture",
    weight: "6,200 lbs",
    price: 950,
    status: "in_transit",
  },
  {
    id: "ship4",
    origin: "Los Angeles, CA",
    destination: "San Francisco, CA",
    date: "2023-04-22",
    deliveryDate: "2023-04-24",
    freight: "Fresh Produce",
    weight: "4,800 lbs",
    price: 1100,
    status: "delivered",
  },
  {
    id: "ship5",
    origin: "Miami, FL",
    destination: "Orlando, FL",
    date: "2023-04-18",
    deliveryDate: "2023-04-20",
    freight: "Retail Goods",
    weight: "3,500 lbs",
    price: 750,
    status: "accepted",
  }
];

const Shipments: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>(sampleShipments);
  const isShipper = user?.role === "shipper";

  // In a real app, you would fetch data from your API
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      // If user is a driver, randomly assign some shipments to this driver
      if (user?.role === "driver" && user?.id) {
        const updatedShipments = shipments.map(shipment => {
          // Randomly assign some shipments to this driver (for demo purposes)
          if (["accepted", "in_transit", "delivered"].includes(shipment.status) && Math.random() > 0.5) {
            return { ...shipment, driverId: user.id };
          }
          return shipment;
        });
        setShipments(updatedShipments);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [user]);

  const handleShipmentCreated = (newShipment: Shipment) => {
    setShipments(prev => [newShipment, ...prev]);
  };

  const handleShipmentUpdate = (updatedShipment: Shipment) => {
    setShipments(prev => 
      prev.map(shipment => 
        shipment.id === updatedShipment.id ? updatedShipment : shipment
      )
    );
  };

  if (!isAuthenticated) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-2">
          {isShipper ? "Manage Your Shipments" : "Available Loads"}
        </h1>
        <p className="text-muted-foreground">
          {isShipper 
            ? "Create and track shipments for your freight" 
            : "Browse available loads and accept shipments"}
        </p>
      </div>

      {isShipper ? (
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">My Shipments</TabsTrigger>
            <TabsTrigger value="create">Create New Shipment</TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <ShipmentList 
              shipments={shipments} 
              onShipmentUpdate={handleShipmentUpdate} 
            />
          </TabsContent>
          <TabsContent value="create">
            <CreateShipmentForm onShipmentCreated={handleShipmentCreated} />
          </TabsContent>
        </Tabs>
      ) : (
        <ShipmentList 
          shipments={shipments} 
          onShipmentUpdate={handleShipmentUpdate} 
        />
      )}
    </div>
  );
};

export default Shipments;
