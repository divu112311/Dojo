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
  created_at: string | null;
  updated_at: string | null; // New field
}

export const useBankAccounts = (user: User | null) => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalBalance, setTotalBalance] = useState(0);
  const [isUsingDemoData, setIsUsingDemoData] = useState(false);
  const [demoDataInitialized, setDemoDataInitialized] = useState(false);

  useEffect(() => {
    if (user && isSupabaseConfigured) {
      console.log('DIAGNOSTIC: User authenticated and Supabase configured, fetching real accounts');
      fetchBankAccounts();
    } else if (user) {
      // Set demo data if user is logged in but Supabase is not configured
      console.log('DIAGNOSTIC: User authenticated but Supabase not configured, using demo accounts');
      if (!demoDataInitialized) {
        setDemoAccounts();
        setDemoDataInitialized(true);
      }
      setIsUsingDemoData(true);
    }
  }, [user]);

  const setDemoAccounts = () => {
    console.log('DIAGNOSTIC: Setting demo accounts');
    const demoAccounts: BankAccount[] = [
      {
        id: 'demo-checking',
        user_id: user?.id || null,
        plaid_account_id: 'demo-checking',
        plaid_access_token: 'demo-token',
        name: 'Primary Checking',
        type: 'depository',
        account_subtype: 'checking',
        subtype: 'checking',
        balance: 2850.00,
        institution_name: 'Demo Bank',
        institution_id: 'ins_demo',
        mask: '1234',
        plaid_item_id: null,
        is_active: true,
        last_synced_at: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'demo-savings',
        user_id: user?.id || null,
        plaid_account_id: 'demo-savings',
        plaid_access_token: 'demo-token',
        name: 'High Yield Savings',
        type: 'depository',
        account_subtype: 'savings',
        subtype: 'savings',
        balance: 4375.00,
        institution_name: 'Demo Bank',
        institution_id: 'ins_demo',
        mask: '5678',
        plaid_item_id: null,
        is_active: true,
        last_synced_at: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    console.log('DIAGNOSTIC: Demo accounts data:', demoAccounts);
    setBankAccounts(demoAccounts);
    setTotalBalance(demoAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0));
    setLoading(false);
  };

  const fetchBankAccounts = async () => {
    if (!user) return;

    console.log('=== FETCHING BANK ACCOUNTS ===');
    console.log('User ID:', user.id);
    console.log('DIAGNOSTIC: isSupabaseConfigured:', isSupabaseConfigured);

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true) // Only fetch active accounts
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching bank accounts:', error);
        console.log('DIAGNOSTIC: Falling back to demo accounts due to error');
        // Fall back to demo accounts on error
        if (!demoDataInitialized) {
          setDemoAccounts();
          setDemoDataInitialized(true);
        }
        setIsUsingDemoData(true);
        return;
      }

      console.log('✅ Bank accounts fetched:', data?.length || 0);
      console.log('DIAGNOSTIC: Bank account data:', data);
      
      if (data && data.length > 0) {
        setBankAccounts(data);
        setIsUsingDemoData(false);
        
        // Calculate total balance
        const total = data.reduce((sum, acc) => sum + (acc.balance || 0), 0);
        setTotalBalance(total);
        console.log('💰 Total balance calculated:', total);
        console.log('DIAGNOSTIC: Total balance set to:', total);
      } else {
        console.log('DIAGNOSTIC: No accounts found, using demo accounts');
        if (!demoDataInitialized) {
          setDemoAccounts();
          setDemoDataInitialized(true);
        }
        setIsUsingDemoData(true);
      }
    } catch (error) {
      console.error('❌ Error fetching bank accounts:', error);
      console.log('DIAGNOSTIC: Falling back to demo accounts due to exception');
      // Fall back to demo accounts on error
      if (!demoDataInitialized) {
        setDemoAccounts();
        setDemoDataInitialized(true);
      }
      setIsUsingDemoData(true);
    } finally {
      setLoading(false);
    }
  };

  const addBankAccount = async (accountData: Omit<BankAccount, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user || !isSupabaseConfigured) {
      console.warn('Cannot add bank account: Supabase not configured');
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
        return null;
      }

      setBankAccounts(prev => [data, ...prev]);
      setTotalBalance(prev => prev + (data.balance || 0));
      return data;
    } catch (error) {
      console.error('Error adding bank account:', error);
      return null;
    }
  };

  const updateBankAccount = async (id: string, updates: Partial<BankAccount>) => {
    if (!user || !isSupabaseConfigured) {
      console.warn('Cannot update bank account: Supabase not configured');
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
    } catch (error) {
      console.error('Error updating bank account:', error);
      return null;
    }
  };

  const deleteBankAccount = async (id: string) => {
    if (!user) return false;

    try {
      const deletedAccount = bankAccounts.find(account => account.id === id);
      
      if (isSupabaseConfigured) {
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
          return false;
        }
      }

      setBankAccounts(prev => prev.filter(account => account.id !== id));
      setTotalBalance(prev => prev - (deletedAccount?.balance || 0));
      
      return true;
    } catch (error) {
      console.error('Error deleting bank account:', error);
      return false;
    }
  };

  const refreshAccounts = async () => {
    console.log('🔄 Refreshing bank accounts...');
    console.log('DIAGNOSTIC: refreshAccounts called, isUsingDemoData:', isUsingDemoData);
    
    if (isUsingDemoData) {
      console.log('DIAGNOSTIC: Using demo data, only updating timestamps');
      // If using demo data, just update the timestamps, not the balances
      const updatedAccounts = bankAccounts.map(account => ({
        ...account,
        last_synced_at: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      
      console.log('DIAGNOSTIC: Updated demo accounts with new timestamps only');
      setBankAccounts(updatedAccounts);
      return;
    }
    
    // Otherwise, fetch real data
    await fetchBankAccounts();
  };

  const syncAccount = async (id: string) => {
    if (!user) return false;

    try {
      if (isUsingDemoData) {
        console.log('DIAGNOSTIC: Using demo data, only updating timestamps for sync');
        // If using demo data, just update the timestamps for this account
        setBankAccounts(prev => prev.map(account => 
          account.id === id ? {
            ...account,
            last_synced_at: new Date().toISOString(),
            last_updated: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } : account
        ));
        return true;
      }
      
      if (isSupabaseConfigured) {
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
          return false;
        }
      }

      // Refresh accounts after sync
      await fetchBankAccounts();
      return true;
    } catch (error) {
      console.error('Error syncing bank account:', error);
      return false;
    }
  };

  return {
    bankAccounts,
    loading,
    totalBalance,
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
    refreshAccounts,
    syncAccount,
    refetch: fetchBankAccounts,
    isUsingDemoData
  };
};