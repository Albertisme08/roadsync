
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function CreateAccountModal({ isOpen, onClose }: CreateAccountModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Create an Account</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex gap-3 mt-2">
            <Button
              className="flex-1"
              onClick={() => {}}
            >
              <Link to="/auth?mode=register" className="w-full">
                Sign Up
              </Link>
            </Button>
            <Button
              variant="outline"
              className="flex-1"
            >
              <Link to="/auth?mode=login" className="w-full">
                Log In
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateAccountModal;
