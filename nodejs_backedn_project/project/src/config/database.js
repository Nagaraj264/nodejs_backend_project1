const { createClient } = require('@supabase/supabase-js');
const config = require('./config');

let supabase = null;

if (config.supabase.url && config.supabase.anonKey) {
  supabase = createClient(config.supabase.url, config.supabase.anonKey);
  console.log('✅ Supabase client initialized');
} else {
  console.warn('⚠️  Supabase not configured. Database operations will not work.');
  console.warn('ℹ️  Please click "Connect to Supabase" button to set up your database.');
}

module.exports = { supabase };