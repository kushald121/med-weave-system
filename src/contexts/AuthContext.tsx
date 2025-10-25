import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { HospitalUser, RoleEnum } from '@/types/database.types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  hospitalUser: HospitalUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: { first_name: string; last_name: string }) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshHospitalUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [hospitalUser, setHospitalUser] = useState<HospitalUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHospitalUser = async (userId: string) => {
    const { data, error } = await supabase
      .from('hospital_users')
      .select('*')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .single();

    if (!error && data) {
      setHospitalUser(data);
    } else {
      setHospitalUser(null);
    }
  };

  const refreshHospitalUser = async () => {
    if (user) {
      await fetchHospitalUser(user.id);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          setTimeout(() => {
            fetchHospitalUser(session.user.id);
          }, 0);
        } else {
          setHospitalUser(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchHospitalUser(session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, userData: { first_name: string; last_name: string }) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: userData,
      }
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setHospitalUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, hospitalUser, loading, signIn, signUp, signOut, refreshHospitalUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
