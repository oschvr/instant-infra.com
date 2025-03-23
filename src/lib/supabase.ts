
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://znmazobrdqfbwpmxdxso.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpubWF6b2JyZHFmYndwbXhkeHNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyOTI3NjYsImV4cCI6MjA1Njg2ODc2Nn0.ah6mi1_x4bR6MMp0dTUm9OKg-IDdZiCsKo5WLMCgVEI';

export const supabase = createClient(supabaseUrl, supabaseKey);
