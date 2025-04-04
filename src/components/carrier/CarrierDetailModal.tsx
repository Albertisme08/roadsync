
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";
import CreateAccountModal from './CreateAccountModal';

interface CarrierDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  carrier: {
    name: string;
    city: string;
    dot: string;
    equipment: string;
    status: string;
  } | null;
}

const CarrierDetailModal = ({ isOpen, onClose, carrier }: CarrierDetailModalProps) => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (!carrier) return null;

  const handleViewContact = () => {
    setShowAuthModal(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{carrier.name}</DialogTitle>
            <Badge variant="outline" className="w-fit mt-2 bg-green-600/10 text-green-600 border-green-600/20">
              {carrier.status}
            </Badge>
          </DialogHeader>
          
          <div className="py-4">
            <h3 className="font-semibold text-lg mb-3">Public Information</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground">DOT Number</p>
                <p>{carrier.dot}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Equipment</p>
                <p>{carrier.equipment}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p>{carrier.city}</p>
              </div>
            </div>

            <div className="mt-8 border-t pt-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Private Information
              </h3>
              
              <div className="relative">
                <div className="grid grid-cols-2 gap-4 opacity-50 blur-sm">
                  <div>
                    <p className="text-sm text-muted-foreground">MC Number</p>
                    <p>MC-123456</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p>(555) 123-4567</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p>123 Carrier St, Suite 100</p>
                  </div>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button 
                    onClick={handleViewContact}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    View Contact Info
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CreateAccountModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default CarrierDetailModal;
