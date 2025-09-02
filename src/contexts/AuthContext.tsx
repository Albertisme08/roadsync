
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType } from "../types/auth.types";
import { supabase } from "@/integrations/supabase/client";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { User } from "@/types/auth.types";
import { useSupabaseUsers } from "@/hooks/auth/useSupabaseUsers";

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Make sure the AuthProvider is defined as a proper React functional component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    users: allUsers,
    isLoading: usersLoading,
    fetchUsers: loadInitialData,
    approveUser,
    rejectUser,
    restoreUser,
    getPendingUsers
  } = useSupabaseUsers();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session?.user) {
          // Defer any Supabase calls to avoid deadlocks in the auth callback
          setTimeout(() => {
            supabase
              .from('profiles')
              .select('*')
              .eq('user_id', session.user!.id)
              .maybeSingle()
              .then(({ data: profile }) => {
                if (profile) {
                  setUser({
                    id: profile.id,
                    email: profile.email,
                    name: profile.name || '',
                    role: profile.role === 'admin' ? 'admin' : profile.role === 'carrier' ? 'carrier' : 'shipper',
                    approvalStatus: profile.approval_status as User['approvalStatus'],
                    verificationStatus: profile.verification_status as User['verificationStatus'],
                    businessName: profile.business_name || '',
                    dotNumber: profile.dot_number || '',
                    mcNumber: profile.mc_number || '',
                    phone: profile.phone || '',
                    city: profile.city || '',
                    address: profile.address || '',
                    equipmentType: profile.equipment_type || '',
                    maxWeight: profile.max_weight || '',
                    description: profile.description || '',
                  });
                }
                setIsLoading(false);
              });
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // This will trigger the auth state change listener above
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auth functions
  const login = async (email: string, password: string, role: any) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const register = async (
    name: string,
    email: string, 
    password: string,
    role: any,
    businessName: string,
    dotNumber: string,
    mcNumber: string,
    phone: string,
    description: string,
    city?: string,
    address?: string,
    equipmentType?: string,
    maxWeight?: string
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          name,
          role, // Include role in metadata
          business_name: businessName,
          dot_number: dotNumber,
          mc_number: mcNumber,
          phone,
          description,
          city,
          address,
          equipment_type: equipmentType,
          max_weight: maxWeight
        }
      }
    });
    if (error) throw error;

    // Notify admin about new registration (non-blocking)
    try {
      await supabase.functions.invoke('notify-admin', {
        body: { email, name, role }
      });
    } catch (e) {
      console.warn('Failed to notify admin of signup', e);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  // Determine if user is an admin
  const isAdmin = !!user && user.role === "admin";
  
  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Create the context value object
  const value: AuthContextType = {
    user,
    allUsers,
    isAuthenticated,
    isApproved: !!user && user.approvalStatus === "approved",
    isAdmin,
    isLoading: isLoading || usersLoading,
    setUser,
    setAllUsers: () => {}, // Not needed with Supabase
    setIsLoading,
    login,
    register,
    logout,
    approveUser,
    rejectUser,
    restoreUser,
    removeUser: async () => {}, // Placeholder
    restoreRemovedUser: async () => {}, // Placeholder
    getPendingUsers,
    loadInitialData,
    checkExistingUser: () => ({ exists: false, user: null }),
    verifyEmail: () => true,
    resendVerification: async () => "success"
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
