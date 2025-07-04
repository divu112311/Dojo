import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface UserProfile {
  id: string;
  email: string | null;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  date_of_birth: string | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

interface ExtendedUserProfile {
  id: string;
  user_id: string | null;
  age_range: string | null;
  income_range: string | null;
  financial_experience: string | null;
  primary_goals: string[] | null;
  learning_style: string | null;
  time_availability: string | null;
  interests: string[] | null;
  notification_preferences: NotificationPreferences | null;
  privacy_settings: PrivacySettings | null;
  theme_preferences: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface NotificationPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  marketing_emails: boolean;
  goal_reminders: boolean;
  learning_reminders: boolean;
  weekly_summary: boolean;
}

interface PrivacySettings {
  profile_visibility: 'public' | 'private' | 'friends';
  data_sharing: boolean;
  analytics_tracking: boolean;
  third_party_sharing: boolean;
}

interface UserXP {
  id: string;
  user_id: string | null;
  points: number | null;
  badges: string[] | null;
}

export const useUserProfile = (user: User | null) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [extendedProfile, setExtendedProfile] = useState<ExtendedUserProfile | null>(null);
  const [xp, setXP] = useState<UserXP | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      setProfile(null);
      setExtendedProfile(null);
      setXP(null);
      setLoading(false);
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Skip database operations if Supabase is not configured
      if (!isSupabaseConfigured) {
        console.log('Supabase not configured, using fallback profile data');
        
        // Create fallback profile from auth data
        const fallbackProfile = {
          id: user.id,
          email: user.email,
          first_name: user.user_metadata?.first_name || user.user_metadata?.full_name?.split(' ')[0] || 'User',
          last_name: user.user_metadata?.last_name || user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
          phone_number: null,
          date_of_birth: null,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Create fallback XP
        const fallbackXP = {
          id: 'default',
          user_id: user.id,
          points: 100,
          badges: ['Welcome']
        };
        
        setProfile(fallbackProfile);
        setXP(fallbackXP);
        setLoading(false);
        return;
      }

      // Fetch user profile, extended profile, and XP in parallel
      const [profileResult, extendedProfileResult, xpResult] = await Promise.all([
        supabase.from('users').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('user_profiles').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('xp').select('*').eq('user_id', user.id).maybeSingle()
      ]);

      // Process profile data
      if (profileResult.error) {
        console.error('Profile fetch error:', profileResult.error);
      } else if (!profileResult.data && user.email) {
        // If no profile exists, create one from auth metadata
        const firstName = user.user_metadata?.first_name || user.user_metadata?.full_name?.split(' ')[0] || 'User';
        const lastName = user.user_metadata?.last_name || user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '';
        
        try {
          const { data: newProfile } = await supabase
            .from('users')
            .insert({
              id: user.id,
              email: user.email,
              first_name: firstName,
              last_name: lastName,
              is_active: true,
            })
            .select()
            .single();

          setProfile(newProfile);
        } catch (createError) {
          console.error('Error creating profile:', createError);
          // Set fallback profile
          setProfile({
            id: user.id,
            email: user.email,
            first_name: firstName,
            last_name: lastName,
            phone_number: null,
            date_of_birth: null,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      } else {
        setProfile(profileResult.data);
      }

      // Process extended profile data
      if (extendedProfileResult.error) {
        console.error('Extended profile fetch error:', extendedProfileResult.error);
      } else {
        setExtendedProfile(extendedProfileResult.data);
      }

      // Process XP data
      if (xpResult.error) {
        console.error('XP fetch error:', xpResult.error);
        // Set default XP
        setXP({
          id: 'default',
          user_id: user.id,
          points: 100,
          badges: ['Welcome']
        });
      } else if (!xpResult.data) {
        // Create new XP record
        try {
          const { data: newXpData } = await supabase
            .from('xp')
            .insert({
              user_id: user.id,
              points: 100,
              badges: ['Welcome']
            })
            .select()
            .single();

          setXP(newXpData);
        } catch (createXpError) {
          console.error('Error creating XP record:', createXpError);
          // Set default XP
          setXP({
            id: 'default',
            user_id: user.id,
            points: 100,
            badges: ['Welcome']
          });
        }
      } else {
        setXP(xpResult.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      
      // Create fallback data on error
      setProfile({
        id: user.id,
        email: user.email,
        first_name: user.user_metadata?.first_name || user.user_metadata?.full_name?.split(' ')[0] || 'User',
        last_name: user.user_metadata?.last_name || user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
        phone_number: null,
        date_of_birth: null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      setXP({
        id: 'default',
        user_id: user.id,
        points: 100,
        badges: ['Welcome']
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return;
    
    if (!isSupabaseConfigured) {
      // Local update only if Supabase is not configured
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return { ...profile, ...updates };
    }

    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return;
    }

    setProfile(data);
    return data;
  };

  const updateExtendedProfile = async (updates: Partial<ExtendedUserProfile>) => {
    if (!user) return;
    
    if (!isSupabaseConfigured) {
      // Local update only if Supabase is not configured
      setExtendedProfile(prev => prev ? { ...prev, ...updates } : {
        id: 'default',
        user_id: user.id,
        ...updates,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as ExtendedUserProfile);
      return;
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        ...updates,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating extended profile:', error);
      return;
    }

    setExtendedProfile(data);
    return data;
  };

  const updateNotificationPreferences = async (preferences: Partial<NotificationPreferences>) => {
    if (!user) return;

    const currentPreferences = extendedProfile?.notification_preferences || {};
    const updatedPreferences = { ...currentPreferences, ...preferences };

    return updateExtendedProfile({
      notification_preferences: updatedPreferences
    });
  };

  const updatePrivacySettings = async (settings: Partial<PrivacySettings>) => {
    if (!user) return;

    const currentSettings = extendedProfile?.privacy_settings || {};
    const updatedSettings = { ...currentSettings, ...settings };

    return updateExtendedProfile({
      privacy_settings: updatedSettings
    });
  };

  const updateThemePreference = async (theme: string) => {
    if (!user) return;

    return updateExtendedProfile({
      theme_preferences: theme
    });
  };

  const updateXP = async (pointsToAdd: number, newBadge?: string) => {
    if (!user || !xp) return;

    const newPoints = (xp.points || 0) + pointsToAdd;
    const newBadges = newBadge 
      ? [...(xp.badges || []), newBadge]
      : xp.badges;

    // If we have a default XP object (not in database), just update local state
    if (xp.id === 'default' || !isSupabaseConfigured) {
      const updatedXP = {
        ...xp,
        points: newPoints,
        badges: newBadges
      };
      setXP(updatedXP);
      return updatedXP;
    }

    try {
      const { data, error } = await supabase
        .from('xp')
        .update({
          points: newPoints,
          badges: newBadges,
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating XP:', error);
        // Update local state even if database update fails
        setXP(prev => prev ? { ...prev, points: newPoints, badges: newBadges } : null);
        return;
      }

      setXP(data);
      return data;
    } catch (error) {
      console.error('Error in updateXP:', error);
      // Update local state even if database update fails
      setXP(prev => prev ? { ...prev, points: newPoints, badges: newBadges } : null);
    }
  };

  const getFullName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`.trim();
    }
    if (profile?.first_name) {
      return profile.first_name;
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.user_metadata?.first_name) {
      const lastName = user.user_metadata?.last_name || '';
      return `${user.user_metadata.first_name} ${lastName}`.trim();
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const getDisplayName = () => {
    if (profile?.first_name) {
      return profile.first_name;
    }
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name;
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const getInitials = () => {
    const fullName = getFullName();
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  return {
    profile,
    extendedProfile,
    xp,
    loading,
    updateProfile,
    updateExtendedProfile,
    updateNotificationPreferences,
    updatePrivacySettings,
    updateThemePreference,
    updateXP,
    getFullName,
    getDisplayName,
    getInitials,
    refetch: fetchUserData,
  };
};