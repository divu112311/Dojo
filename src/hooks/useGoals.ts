import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface Goal {
  id: string;
  user_id: string | null;
  name: string | null;
  description: string | null; // New field
  target_amount: number | null;
  saved_amount: number | null;
  current_amount: number | null; // New field (alias for saved_amount)
  deadline: string | null;
  target_date: string | null; // New field (alias for deadline)
  goal_type: string | null; // New field
  priority_level: string | null; // New field
  status: string | null; // New field
  created_at: string | null;
  updated_at: string | null; // New field
}

export const useGoals = (user: User | null) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isSupabaseConfigured) {
      fetchGoals();
    } else {
      // Set empty goals array if Supabase is not configured
      setGoals([]);
      setLoading(false);
    }
  }, [user]);

  const fetchGoals = async () => {
    if (!user || !isSupabaseConfigured) {
      setGoals([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching goals:', error);
        throw error;
      } else {
        setGoals(data || []);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
      // Set empty goals array on error to prevent UI crashes
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (goal: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user || !isSupabaseConfigured) {
      console.warn('Cannot create goal: User not authenticated or Supabase not configured');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('goals')
        .insert({
          user_id: user.id,
          ...goal,
          status: goal.status || 'active',
          priority_level: goal.priority_level || 'medium',
          current_amount: goal.saved_amount || goal.current_amount || 0,
          target_date: goal.deadline || goal.target_date,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating goal:', error);
        return null;
      }

      setGoals(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error creating goal:', error);
      return null;
    }
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    if (!user || !isSupabaseConfigured) {
      console.warn('Cannot update goal: User not authenticated or Supabase not configured');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('goals')
        .update({
          ...updates,
          // Sync current_amount with saved_amount if either is updated
          current_amount: updates.saved_amount !== undefined ? updates.saved_amount : updates.current_amount,
          // Sync target_date with deadline if either is updated
          target_date: updates.deadline !== undefined ? updates.deadline : updates.target_date,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating goal:', error);
        return null;
      }

      setGoals(prev => prev.map(goal => goal.id === id ? data : goal));
      return data;
    } catch (error) {
      console.error('Error updating goal:', error);
      return null;
    }
  };

  const deleteGoal = async (id: string) => {
    if (!user || !isSupabaseConfigured) {
      console.warn('Cannot delete goal: User not authenticated or Supabase not configured');
      return false;
    }

    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting goal:', error);
        return false;
      }

      setGoals(prev => prev.filter(goal => goal.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting goal:', error);
      return false;
    }
  };

  const updateGoalStatus = async (id: string, status: string) => {
    return updateGoal(id, { status });
  };

  const updateGoalPriority = async (id: string, priority: string) => {
    return updateGoal(id, { priority_level: priority });
  };

  return {
    goals,
    loading,
    createGoal,
    updateGoal,
    deleteGoal,
    updateGoalStatus,
    updateGoalPriority,
    refetch: fetchGoals,
  };
};