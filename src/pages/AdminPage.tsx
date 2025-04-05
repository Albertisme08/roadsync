
import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, RefreshCw, LogOut, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/lib/sonner";

const AdminPage = () => {
  const { user, isAdmin, getPendingUsers, approveUser, rejectUser, logout } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  
  // Fetch pending users on mount and every minute
  useEffect(() => {
    const fetchPendingUsers = () => {
      if (isAdmin) {
        setPendingUsers(getPendingUsers());
      }
    };
    
    fetchPendingUsers(); // Initial fetch
    
    // Set up auto-refresh every minute
    const intervalId = setInterval(() => {
      fetchPendingUsers();
    }, 60000); // 60000 ms = 1 minute
    
    return () => clearInterval(intervalId);
  }, [isAdmin, getPendingUsers]);
  
  const handleApprove = (userId: string, userName: string) => {
    try {
      approveUser(userId);
      setPendingUsers(getPendingUsers());
      
      toast("User Approved", {
        description: `${userName} has been approved and notified.`,
      });
    } catch (error) {
      console.error("Error approving user:", error);
      toast("Error", {
        description: "Failed to approve user. Please try again.",
        style: { backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" },
      });
    }
  };
  
  const handleReject = (userId: string, userName: string) => {
    try {
      rejectUser(userId);
      setPendingUsers(getPendingUsers());
      
      toast("User Rejected", {
        description: `${userName} has been rejected and notified.`,
      });
    } catch (error) {
      console.error("Error rejecting user:", error);
      toast("Error", { 
        description: "Failed to reject user. Please try again.",
        style: { backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" },
      });
    }
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setPendingUsers(getPendingUsers());
    
    toast("Refreshed", {
      description: "User list has been refreshed.",
    });
    
    setTimeout(() => setIsRefreshing(false), 500);
  };
  
  const handleLogout = () => {
    logout();
    navigate("/");
    toast("Logged out", {
      description: "You have been logged out successfully.",
    });
  };
  
  if (!user) {
    // Redirect to login if not logged in
    return <Navigate to="/auth?from=/admin" replace />;
  }
  
  if (!isAdmin) {
    // Show access denied for non-admin users
    return (
      <div className="container mx-auto py-16 px-4 flex flex-col items-center justify-center min-h-[60vh]">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-center mb-2">Access Denied</h1>
        <p className="text-gray-600 text-center mb-6">
          You don't have permission to access the admin dashboard.
        </p>
        <Button onClick={() => navigate("/")} className="mt-4">
          Return to Homepage
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage user approvals and access</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-1"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
      
      <Card className="mb-12">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Pending Approvals</CardTitle>
            <Badge variant="secondary">{pendingUsers.length} Pending</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {pendingUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingUsers.map((user) => (
                    <TableRow key={user.id} className="group">
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="capitalize">
                        <Badge variant={user.role === "shipper" ? "secondary" : "default"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.businessName || "N/A"}</TableCell>
                      <TableCell className="max-w-xs">
                        {user.role === "shipper" ? (
                          <>
                            <div><span className="font-semibold">City:</span> {user.city || "N/A"}</div>
                            {user.address && <div><span className="font-semibold">Address:</span> {user.address}</div>}
                            <div><span className="font-semibold">Phone:</span> {user.phone || "N/A"}</div>
                          </>
                        ) : (
                          <>
                            {(user.dotNumber || user.mcNumber) && (
                              <div>
                                {user.dotNumber && <span><span className="font-semibold">DOT:</span> {user.dotNumber}</span>}
                                {user.dotNumber && user.mcNumber && " | "}
                                {user.mcNumber && <span><span className="font-semibold">MC:</span> {user.mcNumber}</span>}
                              </div>
                            )}
                            {user.equipmentType && <div><span className="font-semibold">Equipment:</span> {user.equipmentType}</div>}
                            {user.maxWeight && <div><span className="font-semibold">Max Weight:</span> {user.maxWeight} lbs</div>}
                            <div><span className="font-semibold">Phone:</span> {user.phone || "N/A"}</div>
                          </>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 invisible group-hover:visible md:visible transition-all"
                            onClick={() => handleApprove(user.id, user.name)}
                          >
                            <CheckCircle className="mr-1 h-4 w-4" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="invisible group-hover:visible md:visible transition-all"
                            onClick={() => handleReject(user.id, user.name)}
                          >
                            <XCircle className="mr-1 h-4 w-4" /> Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-gray-600">No pending approvals at this time.</p>
              <p className="text-sm text-gray-500 mt-2">New registrations will appear here automatically.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
