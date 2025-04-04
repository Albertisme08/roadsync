
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ShipmentList from "@/components/shipments/ShipmentList";
import CreateShipmentForm from "@/components/shipments/CreateShipmentForm";
import { Shipment } from "@/components/shipments/ShipmentCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";
import { useLoad } from "@/contexts/LoadContext";

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
  const { user, isAuthenticated, isApproved } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]); // Properly typed shipments state
  const isShipper = user?.role === "shipper";
  const { loadInitialData } = useLoad();

  // Determine if this is a new user (has no shipments)
  const isNewUser = user?.isFirstVisit === true;

  // In a real app, you would fetch data from your API
  useEffect(() => {
    // If this is a new user, we show an empty state
    // otherwise, we show sample data for demonstration
    if (isNewUser) {
      setShipments([]);
    } else {
      // Simulate loading data with sample shipments
      const timer = setTimeout(() => {
        // If user is a carrier, randomly assign some shipments to this carrier
        if (user?.role === "carrier" && user?.id) {
          const updatedShipments = sampleShipments.map(shipment => {
            // Randomly assign some shipments to this carrier (for demo purposes)
            if (["accepted", "in_transit", "delivered"].includes(shipment.status) && Math.random() > 0.5) {
              return { ...shipment, driverId: user.id };
            }
            return shipment;
          });
          setShipments(updatedShipments);
        } else {
          setShipments(sampleShipments);
        }
        
        // After first successful data load, update user's first visit flag
        if (user?.isFirstVisit === true) {
          // In a real app, you would update this in the database
          console.log("User completed first visit to shipments page");
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleShipmentCreated = (newShipment: Shipment) => {
    // Reset first visit flag when a user creates their first shipment
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

      {!isApproved && (
        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
          <ShieldAlert className="h-5 w-5 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Account Pending Approval</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Your account is currently pending review by an administrator. 
            You will be able to {isShipper ? "create shipments" : "accept loads"} once your account has been approved.
            In the meantime, you can view available shipments but cannot interact with them.
          </AlertDescription>
        </Alert>
      )}

      {isShipper ? (
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">My Shipments</TabsTrigger>
            <TabsTrigger value="create" disabled={!isApproved}>Create New Shipment</TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <ShipmentList 
              shipments={shipments} 
              onShipmentUpdate={handleShipmentUpdate} 
              disableActions={!isApproved}
              emptyStateMessage="You have no shipments yet. Create your first shipment to get started."
            />
          </TabsContent>
          <TabsContent value="create">
            <CreateShipmentForm onShipmentCreated={handleShipmentCreated} />
          </TabsContent>
        </Tabs>
      ) : (
        <>
          <ShipmentList 
            shipments={shipments} 
            onShipmentUpdate={handleShipmentUpdate} 
            disableActions={!isApproved}
            emptyStateMessage={isNewUser ? "No available loads found. Check back soon for new opportunities." : "No loads match your current filters."}
          />
        </>
      )}
    </div>
  );
};

export default Shipments;
