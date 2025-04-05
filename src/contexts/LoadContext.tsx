
import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Load, LoadContextType } from "@/types/load.types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/lib/sonner";

// Create context
const LoadContext = createContext<LoadContextType | undefined>(undefined);

// Storage utility functions
const getLoadsFromStorage = (): Load[] => {
  try {
    const storedLoads = localStorage.getItem("loads");
    return storedLoads ? JSON.parse(storedLoads) : [];
  } catch (error) {
    console.error("Error getting loads from storage:", error);
    return [];
  }
};

const saveLoadsToStorage = (loads: Load[]): void => {
  try {
    localStorage.setItem("loads", JSON.stringify(loads));
  } catch (error) {
    console.error("Error saving loads to storage:", error);
  }
};

export const LoadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loads, setLoads] = useState<Load[]>([]);
  const { user } = useAuth();

  // Load initial data from storage
  const loadInitialData = () => {
    const storedLoads = getLoadsFromStorage();
    setLoads(storedLoads);
    console.log("Loaded loads from storage:", storedLoads.length);
  };

  // Initialize on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Save to storage whenever loads change
  useEffect(() => {
    saveLoadsToStorage(loads);
  }, [loads]);

  // Filter loads based on current user
  const userLoads = user ? loads.filter(load => load.shipperId === user.id) : [];
  const pendingLoads = loads.filter(load => load.approvalStatus === "pending");
  const approvedLoads = loads.filter(load => load.approvalStatus === "approved");
  const rejectedLoads = loads.filter(load => load.approvalStatus === "rejected");

  // Add a new load
  const addLoad = (loadData: Omit<Load, "id" | "submissionDate" | "approvalStatus">) => {
    if (!user) {
      toast("Error", {
        description: "You must be logged in to post loads",
      });
      return "";
    }

    const newLoad: Load = {
      id: uuidv4(),
      ...loadData,
      shipperId: user.id,
      shipperName: user.name,
      shipperEmail: user.email,
      submissionDate: Date.now(),
      approvalStatus: "pending",
    };

    setLoads(prev => [...prev, newLoad]);
    toast("Load Submitted", {
      description: "Your load has been submitted for admin approval",
    });

    return newLoad.id;
  };

  // Update an existing load
  const updateLoad = (loadId: string, updates: Partial<Load>) => {
    setLoads(prev => 
      prev.map(load => 
        load.id === loadId ? { ...load, ...updates } : load
      )
    );
  };

  // Delete a load
  const deleteLoad = (loadId: string) => {
    setLoads(prev => prev.filter(load => load.id !== loadId));
  };

  // Approve a load
  const approveLoad = (loadId: string, adminId: string) => {
    setLoads(prev => 
      prev.map(load => 
        load.id === loadId 
          ? { 
              ...load, 
              approvalStatus: "approved", 
              approvalDate: Date.now(),
              reviewedBy: adminId
            } 
          : load
      )
    );

    // Find the load to get shipper email for notification
    const load = loads.find(l => l.id === loadId);
    if (load && load.shipperEmail) {
      // In a real app, this would send an actual email
      console.log(`Email notification sent to ${load.shipperEmail}: Your load posting has been approved`);
      toast("Load Approved", {
        description: `Load from ${load.pickupLocation} to ${load.deliveryLocation} has been approved. Shipper notified.`,
      });
    }
  };

  // Reject a load
  const rejectLoad = (loadId: string, adminId: string, reason?: string) => {
    setLoads(prev => 
      prev.map(load => 
        load.id === loadId 
          ? { 
              ...load, 
              approvalStatus: "rejected", 
              approvalDate: Date.now(),
              reviewedBy: adminId,
              rejectionReason: reason
            } 
          : load
      )
    );

    // Find the load to get shipper email for notification
    const load = loads.find(l => l.id === loadId);
    if (load && load.shipperEmail) {
      // In a real app, this would send an actual email
      console.log(`Email notification sent to ${load.shipperEmail}: Your load posting has been rejected${reason ? `: ${reason}` : ''}`);
      toast("Load Rejected", {
        description: `Load from ${load.pickupLocation} to ${load.deliveryLocation} has been rejected. Shipper notified.`,
      });
    }
  };

  // Get load by ID
  const getLoadById = (loadId: string) => {
    return loads.find(load => load.id === loadId);
  };

  // Context value
  const value: LoadContextType = {
    loads,
    userLoads,
    pendingLoads,
    approvedLoads,
    rejectedLoads,
    addLoad,
    updateLoad,
    deleteLoad,
    approveLoad,
    rejectLoad,
    getLoadById,
    loadInitialData
  };

  return (
    <LoadContext.Provider value={value}>
      {children}
    </LoadContext.Provider>
  );
};

// Custom hook to use the load context
export const useLoad = (): LoadContextType => {
  const context = useContext(LoadContext);
  if (context === undefined) {
    throw new Error("useLoad must be used within a LoadProvider");
  }
  return context;
};
