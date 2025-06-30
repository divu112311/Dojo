import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface BankAccount {
  id: string;
  user_id: string | null;
  plaid_account_id: string;
  plaid_access_token: string;
  name: string;
  type: string;
  account_subtype: string | null; // Updated from subtype
  subtype: string | null; // For backward compatibility
  balance: number | null;
  institution_name: string;
  institution_id: string;
  mask: string | null;
  plaid_item_id: string | null; // New field
  is_active: boolean | null; // New field
  last_synced_at: string | null; // New field
  last_updated: string | null;
  updated_at: string | null; // New field
}

export const useBankAccounts = (user: User | null) => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    if (user && isSupabaseConfigured) {
      console.log('Fetching bank accounts for user:', user.id);
      fetchBankAccounts();
    } else if (user) {
      console.log('Supabase not configured, cannot fetch bank accounts');
      setError('Database connection not available. Please check your configuration.');
    }
  }, [user]);

  const fetchBankAccounts = async () => {
    if (!user || !isSupabaseConfigured) {
      setError('Cannot fetch bank accounts: User not authenticated or database not configured');
      return;
    }

    console.log('=== FETCHING BANK ACCOUNTS ===');
    console.log('User ID:', user.id);

    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true) // Only fetch active accounts
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bank accounts:', error);
        setError(`Failed to fetch bank accounts: ${error.message}`);
        setBankAccounts([]);
        setTotalBalance(0);
        return;
      }

      console.log('Bank accounts fetched:', data?.length || 0);
      
      setBankAccounts(data || []);
      
      // Calculate total balance
      const total = (data || []).reduce((sum, acc) => sum + (acc.balance || 0), 0);
      setTotalBalance(total);
      console.log('Total balance calculated:', total);
    } catch (error: any) {
      console.error('Error fetching bank accounts:', error);
      setError(`An unexpected error occurred: ${error.message}`);
      setBankAccounts([]);
      setTotalBalance(0);
    } finally {
      setLoading(false);
    }
  };

  const addBankAccount = async (accountData: Omit<BankAccount, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user || !isSupabaseConfigured) {
      setError('Cannot add bank account: User not authenticated or database not configured');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('bank_accounts')
        .insert({
          user_id: user.id,
          ...accountData,
          is_active: true,
          last_synced_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding bank account:', error);
        setError(`Failed to add bank account: ${error.message}`);
        return null;
      }

      setBankAccounts(prev => [data, ...prev]);
      setTotalBalance(prev => prev + (data.balance || 0));
      return data;
    } catch (error: any) {
      console.error('Error adding bank account:', error);
      setError(`An unexpected error occurred: ${error.message}`);
      return null;
    }
  };

  const updateBankAccount = async (id: string, updates: Partial<BankAccount>) => {
    if (!user || !isSupabaseConfigured) {
      setError('Cannot update bank account: User not authenticated or database not configured');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('bank_accounts')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating bank account:', error);
        setError(`Failed to update bank account: ${error.message}`);
        return null;
      }

      setBankAccounts(prev => prev.map(account => 
        account.id === id ? data : account
      ));
      
      // Recalculate total balance
      const updatedAccounts = bankAccounts.map(account => 
        account.id === id ? data : account
      );
      const total = updatedAccounts.reduce((sum, account) => sum + (account.balance || 0), 0);
      setTotalBalance(total);
      
      return data;
    } catch (error: any) {
      console.error('Error updating bank account:', error);
      setError(`An unexpected error occurred: ${error.message}`);
      return null;
    }
  };

  const deleteBankAccount = async (id: string) => {
    if (!user || !isSupabaseConfigured) {
      setError('Cannot delete bank account: User not authenticated or database not configured');
      return false;
    }

    try {
      const deletedAccount = bankAccounts.find(account => account.id === id);
      
      // Soft delete by setting is_active to false
      const { error } = await supabase
        .from('bank_accounts')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting bank account:', error);
        setError(`Failed to delete bank account: ${error.message}`);
        return false;
      }

      setBankAccounts(prev => prev.filter(account => account.id !== id));
      setTotalBalance(prev => prev - (deletedAccount?.balance || 0));
      
      return true;
    } catch (error: any) {
      console.error('Error deleting bank account:', error);
      setError(`An unexpected error occurred: ${error.message}`);
      return false;
    }
  };

  const refreshAccounts = async () => {
    console.log('Refreshing bank accounts...');
    setError(null);
    await fetchBankAccounts();
  };

  const syncAccount = async (id: string) => {
    if (!user || !isSupabaseConfigured) {
      setError('Cannot sync bank account: User not authenticated or database not configured');
      return false;
    }

    try {
      const { error } = await supabase
        .from('bank_accounts')
        .update({ 
          last_synced_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error syncing bank account:', error);
        setError(`Failed to sync bank account: ${error.message}`);
        return false;
      }

      // Refresh accounts after sync
      await fetchBankAccounts();
      return true;
    } catch (error: any) {
      console.error('Error syncing bank account:', error);
      setError(`An unexpected error occurred: ${error.message}`);
      return false;
    }
  };

  return {
    bankAccounts,
    loading,
    error,
    totalBalance,
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
    refreshAccounts,
    syncAccount,
    refetch: fetchBankAccounts,
  };
};