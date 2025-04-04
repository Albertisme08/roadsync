
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
import { CheckCircle, XCircle, RefreshCw, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminPage = () => {
  const { user, isAdmin, getPendingUsers, approveUser, rejectUser, logout } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
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
    approveUser(userId);
    setPendingUsers(getPendingUsers());
    
    toast({
      title: "User Approved",
      description: `${userName} has been approved and notified.`,
      variant: "default",
    });
  };
  
  const handleReject = (userId: string, userName: string) => {
    rejectUser(userId);
    setPendingUsers(getPendingUsers());
    
    toast({
      title: "User Rejected",
      description: `${userName} has been rejected and notified.`,
      variant: "default",
    });
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setPendingUsers(getPendingUsers());
    
    toast({
      title: "Refreshed",
      description: "User list has been refreshed.",
      variant: "default",
    });
    
    setTimeout(() => setIsRefreshing(false), 500);
  };
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
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
                    <TableHead>DOT/MC</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingUsers.map((user) => (
                    <TableRow key={user.id} className="group">
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="capitalize">{user.role}</TableCell>
                      <TableCell>{user.businessName || "N/A"}</TableCell>
                      <TableCell>{user.dotNumber || user.mcNumber || "N/A"}</TableCell>
                      <TableCell>{user.phone || "N/A"}</TableCell>
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
