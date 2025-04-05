
import React, { useState } from "react";
import { useLoad } from "@/contexts/LoadContext";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { 
  Card,
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ShipperLoads: React.FC = () => {
  const { userLoads, deleteLoad } = useLoad();
  const { isApproved } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewLoadId, setViewLoadId] = useState<string | null>(null);
  
  const viewedLoad = viewLoadId ? userLoads.find(load => load.id === viewLoadId) : null;
  
  const filteredLoads = userLoads.filter(load => 
    load.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    load.deliveryLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    load.equipmentType.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };
  
  const handleDelete = (loadId: string) => {
    if (confirm("Are you sure you want to delete this load?")) {
      deleteLoad(loadId);
    }
  };
  
  const formatDate = (date: Date | string | number) => {
    if (date instanceof Date) {
      return format(date, 'MMM dd, yyyy');
    }
    return format(new Date(date), 'MMM dd, yyyy');
  };
  
  if (!isApproved) {
    return (
      <Alert className="mb-6 bg-yellow-50 border-yellow-200">
        <AlertCircle className="h-5 w-5 text-yellow-600" />
        <AlertTitle className="text-yellow-800">Account Pending Approval</AlertTitle>
        <AlertDescription className="text-yellow-700">
          Your account is currently pending review by an administrator. 
          You will be able to view your loads once your account has been approved.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">My Loads</h2>
        <p className="text-muted-foreground">View and manage your submitted loads</p>
      </div>
      
      <div className="my-4">
        <Input
          placeholder="Search by origin, destination, or equipment type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      {filteredLoads.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-gray-50">
          <p className="text-gray-500">No loads found</p>
          <p className="text-sm text-gray-400 mt-1">Post loads using the form to see them here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLoads.map(load => (
            <Card key={load.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>{load.pickupLocation} → {load.deliveryLocation}</CardTitle>
                  <Badge 
                    variant={getStatusBadgeVariant(load.approvalStatus)}
                    className="capitalize"
                  >
                    {load.approvalStatus}
                  </Badge>
                </div>
                <CardDescription>
                  Posted on {formatDate(load.submissionDate)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
                  <div>
                    <span className="text-muted-foreground">Equipment:</span> {load.equipmentType}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Weight:</span> {load.weight} lbs
                  </div>
                  <div>
                    <span className="text-muted-foreground">Rate:</span> ${load.rate}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Available:</span> {formatDate(load.availableDate)}
                  </div>
                </div>
                
                {load.approvalStatus === "rejected" && load.rejectionReason && (
                  <Alert variant="destructive" className="mb-4 py-2">
                    <AlertTitle className="text-sm">Rejection Reason</AlertTitle>
                    <AlertDescription className="text-xs">
                      {load.rejectionReason}
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setViewLoadId(load.id)}
                  >
                    View Details
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleDelete(load.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Load Details Dialog */}
      <Dialog open={!!viewLoadId} onOpenChange={(open) => !open && setViewLoadId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Load Details</DialogTitle>
            <DialogDescription>
              Complete information about your load posting
            </DialogDescription>
          </DialogHeader>
          
          {viewedLoad && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Origin</p>
                  <p className="font-medium">{viewedLoad.pickupLocation}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Destination</p>
                  <p className="font-medium">{viewedLoad.deliveryLocation}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Equipment Type</p>
                  <p>{viewedLoad.equipmentType}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Weight</p>
                  <p>{viewedLoad.weight} lbs</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Rate</p>
                  <p>${viewedLoad.rate}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Available Date</p>
                  <p>{formatDate(viewedLoad.availableDate)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Contact Info</p>
                  <p>{viewedLoad.contactInfo}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Status</p>
                  <Badge 
                    variant={getStatusBadgeVariant(viewedLoad.approvalStatus)}
                    className="capitalize"
                  >
                    {viewedLoad.approvalStatus}
                  </Badge>
                </div>
              </div>
              
              {viewedLoad.notes && (
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Notes</p>
                  <p className="text-sm">{viewedLoad.notes}</p>
                </div>
              )}
              
              {viewedLoad.approvalStatus === "rejected" && viewedLoad.rejectionReason && (
                <Alert variant="destructive" className="mt-2">
                  <AlertTitle>Rejection Reason</AlertTitle>
                  <AlertDescription>
                    {viewedLoad.rejectionReason}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="pt-2 text-xs text-muted-foreground">
                <p>Submitted on {formatDate(viewedLoad.submissionDate)}</p>
                {viewedLoad.approvalDate && (
                  <p>{viewedLoad.approvalStatus === "approved" ? "Approved" : "Rejected"} on {formatDate(viewedLoad.approvalDate)}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShipperLoads;
