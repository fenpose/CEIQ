const { createClient } = require('@supabase/supabase-js');

const url = 'https://nxixiubbbmufwlrybrut.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54aXhpdWJiYm11ZndscnlicnV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MDczODYsImV4cCI6MjA4ODk4MzM4Nn0.abQrseu6QtsOmyH2gz3gNXZDm9FdPcqF8LGy1DofTRM';

const supabase = createClient(url, key);

async function test() {
  const { data, error } = await supabase.functions.invoke('analyze-document', {
    body: { documentText: 'test', question: 'test' }
  });
  console.log('Error:', error);
  console.log('Data:', data);
}

test();
