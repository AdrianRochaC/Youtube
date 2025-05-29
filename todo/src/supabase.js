import { createClient } from '@supabase/supabase-js';

const supabase = createClient(' https://njxqiwqdrucdamffjzpl.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qeHFpd3FkcnVjZGFtZmZqenBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMDczNDEsImV4cCI6MjA2Mzg4MzM0MX0.P_sjMZOVfJZwlC42DXfDkKvNAxQe_0J-5D-b-H6OSMM');

export { supabase };