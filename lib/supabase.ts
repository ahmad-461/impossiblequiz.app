import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabaseInstance: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
  }
} else {
  if (typeof window !== 'undefined') {
    console.warn('Supabase environment variables are missing or invalid. Supabase client will fallback to a dummy object.');
  }
}

interface DummyChainable {
  select: () => DummyChainable;
  insert: () => DummyChainable;
  update: () => DummyChainable;
  delete: () => DummyChainable;
  order: () => DummyChainable;
  limit: () => DummyChainable;
  eq: () => DummyChainable;
  or: () => DummyChainable;
  like: () => DummyChainable;
  neq: () => DummyChainable;
  gt: () => DummyChainable;
  lt: () => DummyChainable;
  gte: () => DummyChainable;
  lte: () => DummyChainable;
  in: () => DummyChainable;
  single: () => DummyChainable;
  then: (resolve: (value: { data: Record<string, unknown>[]; error: Error }) => void) => Promise<{ data: Record<string, unknown>[]; error: Error }>;
}

// Fallback proxy to prevent runtime crashes if someone calls supabase.from()
export const supabase = supabaseInstance || (new Proxy({} as Record<string, unknown>, {
  get(target, prop) {
    if (prop === 'from') {
      return (table: string) => {
        console.warn(`Supabase is not initialized. Call to from('${table}') was ignored.`);
        // Return a chainable object to support common Supabase queries gracefully
        const chainable: DummyChainable = {
          select: () => chainable,
          insert: () => chainable,
          update: () => chainable,
          delete: () => chainable,
          order: () => chainable,
          limit: () => chainable,
          eq: () => chainable,
          or: () => chainable,
          like: () => chainable,
          neq: () => chainable,
          gt: () => chainable,
          lt: () => chainable,
          gte: () => chainable,
          lte: () => chainable,
          in: () => chainable,
          single: () => chainable,
          then: (resolve) => {
            if (resolve) {
              resolve({ data: [], error: new Error('Supabase not initialized') });
            }
            return Promise.resolve({ data: [], error: new Error('Supabase not initialized') });
          }
        };
        return chainable;
      };
    }
    return () => {
      console.warn(`Supabase is not initialized. Call to ${String(prop)} was ignored.`);
      return {
        then: (resolve: (value: { data: null; error: Error }) => void) => {
          if (resolve) {
            resolve({ data: null, error: new Error('Supabase not initialized') });
          }
          return Promise.resolve({ data: null, error: new Error('Supabase not initialized') });
        }
      };
    };
  }
}) as unknown as SupabaseClient);
