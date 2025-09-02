import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/auth.types";
import { toast } from "@/lib/sonner";

export const useSupabaseUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users');
        return;
      }

      const mappedUsers: User[] = data.map(profile => ({
        id: profile.id,
        email: profile.email,
        name: profile.name || '',
        role: profile.role as User['role'],
        approvalStatus: profile.approval_status as User['approvalStatus'],
        verificationStatus: profile.verification_status as User['verificationStatus'],
        businessName: profile.business_name || '',
        dotNumber: profile.dot_number || '',
        mcNumber: profile.mc_number || '',
        phone: profile.phone || '',
        approvalDate: profile.approval_date ? new Date(profile.approval_date).getTime() : undefined,
        rejectionDate: profile.rejection_date ? new Date(profile.rejection_date).getTime() : undefined,
        restorationDate: profile.restoration_date ? new Date(profile.restoration_date).getTime() : undefined,
      }));

      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const approveUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          approval_status: 'approved',
          approval_date: new Date().toISOString(),
          rejection_date: null
        })
        .eq('id', userId);

      if (error) {
        console.error('Error approving user:', error);
        toast.error('Failed to approve user');
        return;
      }

      toast.success('User approved successfully');
      await fetchUsers();
    } catch (error) {
      console.error('Error in approveUser:', error);
      toast.error('Failed to approve user');
    }
  };

  const rejectUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          approval_status: 'rejected',
          rejection_date: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error rejecting user:', error);
        toast.error('Failed to reject user');
        return;
      }

      toast.success('User rejected');
      await fetchUsers();
    } catch (error) {
      console.error('Error in rejectUser:', error);
      toast.error('Failed to reject user');
    }
  };

  const restoreUser = async (userId: string, newStatus: User['approvalStatus'] = 'pending') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          approval_status: newStatus,
          restoration_date: new Date().toISOString(),
          rejection_date: null,
          approval_date: newStatus === 'approved' ? new Date().toISOString() : null
        })
        .eq('id', userId);

      if (error) {
        console.error('Error restoring user:', error);
        toast.error('Failed to restore user');
        return;
      }

      toast.success('User restored successfully');
      await fetchUsers();
    } catch (error) {
      console.error('Error in restoreUser:', error);
      toast.error('Failed to restore user');
    }
  };

  const getPendingUsers = () => {
    return users.filter(u => u.approvalStatus === 'pending');
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    isLoading,
    fetchUsers,
    approveUser,
    rejectUser,
    restoreUser,
    getPendingUsers
  };
};