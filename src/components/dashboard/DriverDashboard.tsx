
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Package, Truck, Clock, CheckCircle, DollarSign, BarChart3, Search } from "lucide-react";
import { Shipment } from "@/components/shipments/ShipmentCard";
import { useAuth } from "@/contexts/AuthContext";

interface DriverDashboardProps {
  shipments: Shipment[];
}

const DriverDashboard: React.FC<DriverDashboardProps> = ({ shipments }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Filter shipments for current driver
  const driverShipments = shipments.filter(s => s.driverId === user?.id);
  
  // Calculate shipment statistics
  const availableShipments = shipments.filter(s => s.status === "pending").length;
  const acceptedShipments = driverShipments.filter(s => 
    s.status === "accepted" || s.status === "in_transit"
  ).length;
  const completedShipments = driverShipments.filter(s => s.status === "delivered").length;
  const totalEarned = driverShipments
    .filter(s => s.status === "delivered")
    .reduce((sum, shipment) => sum + shipment.price, 0);

  // Get recent shipments
  const recentShipments = [...driverShipments]
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Driver Dashboard</h1>
          <p className="text-muted-foreground">
            Find available loads and manage your deliveries
          </p>
        </div>
        <Button onClick={() => navigate("/shipments")}>
          Find Available Loads
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Loads</CardTitle>
            <Search className="h-4 w-4 text-brand-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableShipments}</div>
            <p className="text-xs text-muted-foreground">
              Shipments awaiting drivers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Active Loads</CardTitle>
            <Truck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{acceptedShipments}</div>
            <p className="text-xs text-muted-foreground">
              Shipments you're handling
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedShipments}</div>
            <p className="text-xs text-muted-foreground">
              Successfully delivered shipments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarned.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all completed shipments
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="my-loads" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-loads">My Shipments</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="my-loads" className="space-y-4">
          <div className="grid gap-4">
            {recentShipments.length > 0 ? (
              recentShipments.map((shipment) => (
                <Card key={shipment.id}>
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">
                            {shipment.origin} to {shipment.destination}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {shipment.date} • {shipment.freight}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Package className="h-5 w-5 mr-2 text-brand-blue" />
                          <span className="font-semibold">${shipment.price.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          shipment.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : shipment.status === "accepted"
                            ? "bg-blue-100 text-blue-800"
                            : shipment.status === "in_transit"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}>
                          {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1).replace("_", " ")}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/shipments`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">You haven't accepted any shipments yet.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate("/shipments")}
                >
                  Find Available Loads
                </Button>
              </div>
            )}
            {recentShipments.length > 0 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/shipments")}
              >
                View All My Shipments
              </Button>
            )}
          </div>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Earnings History</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="flex h-[200px] items-center justify-center">
                <div className="flex flex-col items-center text-center">
                  <BarChart3 className="h-12 w-12 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">
                    Earnings analytics will be available once you complete more shipments
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DriverDashboard;
