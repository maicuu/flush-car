import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://biinllgbguuqlthdckck.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpaW5sbGdiZ3V1cWx0aGRja2NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NDIwNzUsImV4cCI6MjA4NDQxODA3NX0.KH83nQWwS2nS6RBMqsA_dHG0wvYXJOsQ4WizUnk9PJ0';

export const supabase = createClient(supabaseUrl, supabaseKey);
export const APP_SLUG = 'flush-car';