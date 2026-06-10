import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Use a placeholder URL/key during Next.js build time to prevent build failures.
// supabaseUrl must be a valid http/https URL.
const isPlaceholderUrl = !supabaseUrl || supabaseUrl.includes('YOUR_SUPABASE_PROJECT_URL') || !supabaseUrl.startsWith('http');
const activeUrl = isPlaceholderUrl ? 'https://placeholder-project.supabase.co' : supabaseUrl!;

const activeAnonKey = !supabaseAnonKey || supabaseAnonKey.includes('YOUR_SUPABASE_ANON_KEY') 
  ? 'placeholder-anon-key' 
  : supabaseAnonKey;

const activeServiceRoleKey = !supabaseServiceRoleKey || supabaseServiceRoleKey.includes('YOUR_SUPABASE_SERVICE_ROLE_KEY') 
  ? 'placeholder-service-role-key' 
  : supabaseServiceRoleKey;

if (isPlaceholderUrl && typeof window === 'undefined') {
  console.warn('⚠️ Warning: NEXT_PUBLIC_SUPABASE_URL is not fully configured. Using fallback placeholder for compilation.');
}

// Client for public operations (like inserting a subscriber from frontend)
export const supabase = createClient(activeUrl, activeAnonKey);

// Client for admin/backend operations bypassing RLS (like cron job reading all subscribers)
export const supabaseAdmin = createClient(
  activeUrl,
  activeServiceRoleKey || activeAnonKey
);
