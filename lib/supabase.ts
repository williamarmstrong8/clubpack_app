import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Get environment variables from Expo Constants
// Support both EXPO_PUBLIC_ (Expo) and VITE_ (Vite) prefixes for compatibility
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl 
  || process.env.EXPO_PUBLIC_SUPABASE_URL 
  || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey 
  || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY 
  || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY (or VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY)');
}

// Define types for our database schema
export type Club = {
  id: string;
  name: string;
  subdomain: string;
  logo_url?: string;
  primary_color?: string;
  plan?: string;
  created_at?: string;
  instagram?: string;
  tagline?: string;
  hero_image_url?: string;
  hero_image_small_url?: string;
  hero_image_large_url?: string;
  about_blurb?: string;
  hero_subtext?: string;
  favicon_url?: string;
  hero_headline?: string;
  email?: string;
  phone_number?: string;
  meeting_location?: string;
  meeting_time?: string;
  description?: string;
  use_mock_content?: boolean;
};

export type Profile = {
  id: string;
  club_id: string | null;
  role: string;
  name: string;
  created_at: string;
};

export type Event = {
  id: string;
  club_id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location_name: string;
  status: string;
  created_by: string;
  created_at: string;
  image_url?: string;
  image_small_url?: string;
  image_large_url?: string;
};

export type Membership = {
  id: string;
  club_id: string;
  name: string | null;
  email: string | null;
  joined_at: string | null;
  role: string | null;
  status: string | null;
};

export type RSVP = {
  id: string;
  event_id: string;
  membership_id: string | null;
  avatar_url: string | null;
  created_at: string;
  name: string | null;
  email: string | null;
  attendance: 'attended' | 'not_attended' | null;
};

// Create Supabase client
export const supabase = createClient<{
  public: {
    Tables: {
      clubs: {
        Row: Club;
        Insert: Omit<Club, 'id' | 'created_at'>;
        Update: Partial<Omit<Club, 'id' | 'created_at'>>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      events: {
        Row: Event;
        Insert: Omit<Event, 'id' | 'created_at'>;
        Update: Partial<Omit<Event, 'id' | 'created_at'>>;
      };
      memberships: {
        Row: Membership;
        Insert: Omit<Membership, 'id'>;
        Update: Partial<Omit<Membership, 'id'>>;
      };
      rsvps: {
        Row: RSVP;
        Insert: Omit<RSVP, 'id' | 'created_at'>;
        Update: Partial<Omit<RSVP, 'id' | 'created_at'>>;
      };
    };
  };
}>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: require('@react-native-async-storage/async-storage').default,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

