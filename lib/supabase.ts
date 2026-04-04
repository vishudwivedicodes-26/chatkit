import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://crfullplriunmmbjjopw.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_OfiZPTvJR6ZW2McAlpC9LQ_Qwnv3FZU';

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
  console.warn('Supabase credentials not found or are using placeholders. Please check your .env.local file.');
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
  encrypted_private_key: string;
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
