import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  organization?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

interface SignUpMetadata {
  full_name: string;
  organization?: string;
  role?: string;
  experience?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, metadata: SignUpMetadata) => Promise<{ error: AuthError | null; session: Session | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ error: Error | null; profile: UserProfile | null }>;
  refreshProfile: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Immediate profile builder from metadata or local cache
  const getInitialProfile = (currentUser: User): UserProfile => {
    try {
      const cached = localStorage.getItem(`conark_profile_${currentUser.id}`);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {}

    const metaName = currentUser.user_metadata?.full_name;
    const emailName = currentUser.email ? currentUser.email.split('@')[0] : 'User';
    return {
      id: currentUser.id,
      email: currentUser.email || '',
      full_name: metaName || emailName,
      organization: currentUser.user_metadata?.organization || '',
      role: currentUser.user_metadata?.role || 'Site Engineer',
      avatar_url: currentUser.user_metadata?.avatar_url || '',
      created_at: currentUser.created_at
    };
  };

  // Fetch or construct profile
  const fetchProfile = async (currentUser: User) => {
    // 1. Immediately hydrate state without waiting for network (0ms)
    const initial = getInitialProfile(currentUser);
    setProfile(initial);

    // 2. Try fetching from fast local backend first
    try {
      const sessionData = await supabase.auth.getSession();
      const token = sessionData.data.session?.access_token;
      if (token) {
        const res = await fetch('/api/v1/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const freshData = await res.json();
          if (freshData && freshData.id) {
            setProfile(freshData as UserProfile);
            try {
              localStorage.setItem(`conark_profile_${currentUser.id}`, JSON.stringify(freshData));
            } catch {}
            return;
          }
        }
      }
    } catch (backendErr) {
      // Ignore and proceed to Supabase REST
    }

    // 3. Fallback to Supabase REST with a 2.5-second timeout to prevent connection drop hangs
    try {
      const queryPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      const timeoutPromise = new Promise<{ data: null; error: any }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: new Error('Profile fetch timeout') }), 2500)
      );

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

      if (data && !error) {
        setProfile(data as UserProfile);
        try {
          localStorage.setItem(`conark_profile_${currentUser.id}`, JSON.stringify(data));
        } catch {}
      }
    } catch (err) {
      console.warn('Silent fallback for profile:', err);
    }
  };

  useEffect(() => {
    // Initial session restoration
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user);
      }
      setLoading(false);
    });

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        await fetchProfile(newSession.user);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata: SignUpMetadata) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: metadata.full_name,
            organization: metadata.organization || '',
            role: metadata.role || 'Site Engineer',
            experience: metadata.experience || ''
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      return { error, session: data.session };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    return { error };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    return { error };
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return { error: new Error('Not authenticated'), profile: null };

    try {
      const { data: updated, error } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          organization: data.organization,
          role: data.role,
          avatar_url: data.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(updated as UserProfile);
      return { error: null, profile: updated as UserProfile };
    } catch (err: any) {
      return { error: err, profile: null };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
    }
  };

  const getAccessToken = async (): Promise<string | null> => {
    const currentSession = (await supabase.auth.getSession()).data.session;
    return currentSession?.access_token ?? null;
  };

  const value = useMemo(
    () => ({
      user,
      profile,
      session,
      loading,
      isAuthenticated: !!user,
      signIn,
      signUp,
      signOut,
      resetPassword,
      updatePassword,
      updateProfile,
      refreshProfile,
      getAccessToken
    }),
    [user, profile, session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
