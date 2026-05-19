import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vemdohlusviseajbrmne.supabase.co';
const supabaseKey = 'sb_publishable_U1wIJtiRMX4d1pvkIeE58w_V5igd8MH';

export const supabase = createClient(supabaseUrl, supabaseKey);