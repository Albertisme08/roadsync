
import React, { useState } from "react";
import { useLoad } from "@/contexts/LoadContext";
import { useAuth } from "@/contexts/AuthContext";
import { Load } from "@/types/load.types";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Calendar, Check, X, MapPin, Truck, DollarSign, Clock, Info } from "lucide-react";

export const LoadApprovalDashboard: React.FC = () => {
  const { pendingLoads, approvedLoads, rejectedLoads, approveLoad, rejectLoad } = useLoad();
  const { user } = useAuth();
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedLoadId, setSelectedLoadId] = useState<string | null>(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const handleApprove = (loadId: string) => {
    if (!user) return;
    approveLoad(loadId, user.id);
  };

  const openRejectDialog = (loadId: string) => {
    setSelectedLoadId(loadId);
    setRejectionReason("");
    setIsRejectDialogOpen(true);
  };

  const handleReject = () => {
    if (!user || !selectedLoadId) return;
    rejectLoad(selectedLoadId, user.id, rejectionReason);
    setIsRejectDialogOpen(false);
    setSelectedLoadId(null);
  };

  const LoadCard: React.FC<{ load: Load }> = ({ load }) => {
    const { pickupLocation, deliveryLocation, equipmentType, weight, rate, availableDate } = load;
    
    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-bold flex items-center">
                <MapPin className="mr-1 h-4 w-4 text-brand-blue" />
                {pickupLocation} 
                <span className="mx-2">→</span>
                <MapPin className="mr-1 h-4 w-4 text-brand-green" />
                {deliveryLocation}
              </CardTitle>
              <CardDescription>
                Submitted by {load.shipperName || "Unknown"} on {format(new Date(load.submissionDate), 'MMM dd, yyyy')}
              </CardDescription>
            </div>
            <Badge 
              variant={load.approvalStatus === "pending" ? "outline" : 
                load.approvalStatus === "approved" ? "success" : "destructive"}
            >
              {load.approvalStatus.charAt(0).toUpperCase() + load.approvalStatus.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="flex items-center">
              <Truck className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm">{equipmentType} - {weight} lbs</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm">${rate}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm">
                {availableDate instanceof Date 
                  ? format(availableDate, 'MMM dd, yyyy')
                  : format(new Date(availableDate), 'MMM dd, yyyy')}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm">Pending for {Math.floor((Date.now() - load.submissionDate) / (1000 * 60 * 60 * 24))} days</span>
            </div>
          </div>
          
          {load.notes && (
            <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded-md">
              <p className="font-medium">Notes:</p>
              <p>{load.notes}</p>
            </div>
          )}
        </CardContent>
        
        {load.approvalStatus === "pending" && (
          <CardFooter className="flex justify-end pt-0 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="border-red-300 hover:bg-red-50 text-red-600"
              onClick={() => openRejectDialog(load.id)}
            >
              <X className="mr-1 h-4 w-4" /> Reject
            </Button>
            <Button 
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleApprove(load.id)}
            >
              <Check className="mr-1 h-4 w-4" /> Approve
            </Button>
          </CardFooter>
        )}
        
        {load.approvalStatus === "rejected" && load.rejectionReason && (
          <CardFooter className="pt-0">
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md w-full">
              <p className="font-medium">Rejection reason:</p>
              <p>{load.rejectionReason}</p>
            </div>
          </CardFooter>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Load Approval Dashboard</h2>
      <p className="text-muted-foreground mb-6">Manage and review shipper load postings</p>
      
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="relative">
            Pending Approval
            {pendingLoads.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {pendingLoads.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved Loads
            <Badge variant="secondary" className="ml-2">
              {approvedLoads.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected Loads
            <Badge variant="secondary" className="ml-2">
              {rejectedLoads.length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="pt-4">
          {pendingLoads.length === 0 ? (
            <div className="text-center py-10">
              <Info size={36} className="mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500">No pending loads to review</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingLoads.map(load => (
                <LoadCard key={load.id} load={load} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="approved" className="pt-4">
          {approvedLoads.length === 0 ? (
            <div className="text-center py-10">
              <Info size={36} className="mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500">No approved loads</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Origin</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Shipper</TableHead>
                    <TableHead>Approved By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedLoads.map(load => (
                    <TableRow key={load.id}>
                      <TableCell>
                        {format(new Date(load.submissionDate), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>{load.pickupLocation}</TableCell>
                      <TableCell>{load.deliveryLocation}</TableCell>
                      <TableCell>{load.equipmentType}</TableCell>
                      <TableCell>${load.rate}</TableCell>
                      <TableCell>{load.shipperName || load.shipperEmail}</TableCell>
                      <TableCell>Admin</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="rejected" className="pt-4">
          {rejectedLoads.length === 0 ? (
            <div className="text-center py-10">
              <Info size={36} className="mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500">No rejected loads</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {rejectedLoads.map(load => (
                <LoadCard key={load.id} load={load} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Rejection Reason Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Load</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this load. This information will be shared with the shipper.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-2">
            <Textarea
              id="rejectionReason"
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full"
            />
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
            >
              Reject Load
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
