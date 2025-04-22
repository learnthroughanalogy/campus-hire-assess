
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'administrator' | 'recruiter' | 'candidate' | 'sme' | 'university_spoc' | 'hr' | 'student' | null;

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  college?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdministrator: boolean;
  isRecruiter: boolean;
  isCandidate: boolean;
  isSME: boolean;
  isUniversitySPOC: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user profile if session exists
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Got existing session', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    setIsLoading(false);
    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      // Type casting to ensure role is properly typed
      const userProfile: UserProfile = {
        id: data.id,
        name: data.name || '',
        email: data.email || '',
        role: data.role as UserRole || null,
        college: data.college || undefined,
        department: data.department || undefined
      };
      console.log('Profile fetched successfully:', userProfile);
      setProfile(userProfile);
      
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setProfile(null);
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setProfile(null);
  };

  const value = {
    user,
    session,
    profile,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdministrator: profile?.role === 'administrator',
    isRecruiter: profile?.role === 'recruiter' || profile?.role === 'hr',
    isCandidate: profile?.role === 'candidate' || profile?.role === 'student',
    isSME: profile?.role === 'sme',
    isUniversitySPOC: profile?.role === 'university_spoc',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
