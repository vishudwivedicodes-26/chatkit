import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Types for the database tables.
 */
export type Profile = {
  id: string;
  display_name: string;
  username: string;
  uid: string;
  bio: string | null;
  avatar_id: string;
  public_key: string;
  online_at: string;
  created_at: string;
};

export type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  nonce: string;
  type: 'text' | 'image' | 'video' | 'file' | 'voice';
  metadata: any;
  is_saved: boolean;
  created_at: string;
  delivered_at: string | null;
  read_at: string | null;
};
