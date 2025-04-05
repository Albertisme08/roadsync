
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ShipperDashboard from "@/components/dashboard/ShipperDashboard";
import DriverDashboard from "@/components/dashboard/DriverDashboard";
import { Shipment } from "@/components/shipments/ShipmentCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, Clock } from "lucide-react";

// Sample shipment data
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

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, isApproved } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>(sampleShipments);

  // In a real app, you would fetch data from your API
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      // If user is a carrier, randomly assign some shipments to this carrier
      if (user?.role === "carrier" && user?.id) {
        const updatedShipments = shipments.map(shipment => {
          // Randomly assign some shipments to this carrier (for demo purposes)
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

  if (!isAuthenticated) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {!isApproved && user?.role !== "admin" && (
        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
          <ShieldAlert className="h-5 w-5 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Account Pending Approval</AlertTitle>
          <AlertDescription className="text-yellow-700">
            <div className="space-y-2">
              <p>
                Your account is pending approval by our administrators. This process typically takes 1-2 business days.
              </p>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-1 text-yellow-600" />
                <span>Expected approval time: 24-48 hours</span>
              </div>
              <p>
                You will receive an email notification once your account has been approved. If you have any questions,
                please contact our support team at support@roadsync.com
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {user?.role === "shipper" ? (
        <ShipperDashboard shipments={shipments} />
      ) : (
        <DriverDashboard shipments={shipments} />
      )}
    </div>
  );
};

export default Dashboard;
