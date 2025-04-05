
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Package, Truck, Clock, CheckCircle, DollarSign, BarChart3, Calendar, AlertCircle } from "lucide-react";
import { Shipment } from "@/components/shipments/ShipmentCard";
import { useAuth } from "@/contexts/AuthContext";

interface ShipperDashboardProps {
  shipments: Shipment[];
}

const ShipperDashboard: React.FC<ShipperDashboardProps> = ({ shipments }) => {
  const navigate = useNavigate();
  const { isApproved } = useAuth();

  // Calculate shipment statistics
  const pendingShipments = shipments.filter(s => s.status === "pending").length;
  const inProgressShipments = shipments.filter(s => 
    s.status === "accepted" || s.status === "in_transit"
  ).length;
  const completedShipments = shipments.filter(s => s.status === "delivered").length;
  const totalSpent = shipments
    .filter(s => s.status === "delivered")
    .reduce((sum, shipment) => sum + shipment.price, 0);

  // Get recent shipments
  const recentShipments = [...shipments]
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Shipper Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your shipments and track cargo in real-time
          </p>
        </div>
        {isApproved ? (
          <Button onClick={() => navigate("/shipments")}>
            Create New Shipment
          </Button>
        ) : (
          <Button onClick={() => navigate("/shipments")} disabled 
            title="Your account is pending approval"
            className="cursor-not-allowed opacity-60">
            <AlertCircle className="h-4 w-4 mr-2" />
            Create New Shipment
          </Button>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Shipments</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingShipments}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting driver acceptance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Truck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressShipments}</div>
            <p className="text-xs text-muted-foreground">
              Shipments currently in transit
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
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all completed shipments
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Shipments</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="space-y-4">
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
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Pickup: {shipment.date}</span>
                            <span>|</span>
                            <span>Delivery: {shipment.deliveryDate || "Not specified"}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {shipment.freight}
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
                <p className="text-gray-500">No recent shipments found.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate("/shipments")}
                >
                  Create Your First Shipment
                </Button>
              </div>
            )}
            {recentShipments.length > 0 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/shipments")}
              >
                View All Shipments
              </Button>
            )}
          </div>
        </TabsContent>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Shipment Activity</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="flex h-[200px] items-center justify-center">
                <div className="flex flex-col items-center text-center">
                  <BarChart3 className="h-12 w-12 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">
                    Shipment analytics will be available once you have more activity
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

export default ShipperDashboard;
