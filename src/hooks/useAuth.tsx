// @ts-nocheck
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import Cookies from 'js-cookie';

export type AuthContextType =
{
  user: User | null;
  session: Session | null;
  signUp: ( email: string, password: string, fullName?: string, gender?: string, signupReason?: string ) => Promise<{ error: any }>;
  signIn: ( email: string, password: string ) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>( undefined );

export const AuthProvider = ( { children }: { children: React.ReactNode } ) =>
{
  const [ user, setUser ] = useState<User | null>( null );
  const [ session, setSession ] = useState<Session | null>( null );
  const [ loading, setLoading ] = useState( true );

  useEffect( () =>
  {
    // Check for cached session first
    const cachedSession = Cookies.get( 'supabase-session' );
    if ( cachedSession )
    {
      try
      {
        const parsedSession = JSON.parse( cachedSession );
        setSession( parsedSession );
        setUser( parsedSession?.user ?? null );
      } catch ( error )
      {
        console.error( 'Failed to parse cached session:', error );
      }
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      ( event, session ) =>
      {
        setSession( session );
        setUser( session?.user ?? null );
        setLoading( false );

        // Cache the session in cookies
        if ( session )
        {
          Cookies.set( 'supabase-session', JSON.stringify( session ), {
            expires: 7, // 7 days
            secure: true,
            sameSite: 'strict'
          } );
        } else
        {
          Cookies.remove( 'supabase-session' );
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then( ( { data: { session } } ) =>
    {
      setSession( session );
      setUser( session?.user ?? null );
      setLoading( false );

      // Cache the session
      if ( session )
      {
        Cookies.set( 'supabase-session', JSON.stringify( session ), {
          expires: 7,
          secure: true,
          sameSite: 'strict'
        } );
      }
    } );

    return () => subscription.unsubscribe();
  }, [] );

  const signUp = async ( email, password, fullName, gender, signupReason ) =>
  {
    const { data, error } = await supabase.auth.signUp( {
      email,
      password,
      options: {
        emailRedirectTo: `${ window.location.origin }/`,
        data: {
          full_name: fullName,
          gender: gender,
          signup_reason: signupReason
        }
      }
    } );
    console.log( data )
    return { error };
  };

  const signIn = async ( email, password ) =>
  {
    const { error } = await supabase.auth.signInWithPassword( {
      email,
      password
    } );
    return { error };
  };

  const signInWithGoogle = async () =>
  {
    const { error } = await supabase.auth.signInWithOAuth( {
      provider: 'google',
      options: {
        redirectTo: `${ window.location.origin }/`
      }
    } );
    return { error };
  };

  const signOut = async () =>
  {
    Cookies.remove( 'supabase-session' );
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value= { value } >
    { children }
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
{
  const context = useContext( AuthContext );
  if ( context === undefined )
  {
    throw new Error( 'useAuth must be used within an AuthProvider' );
  }
  return context;
};
