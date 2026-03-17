const url = 'https://nxixiubbbmufwlrybrut.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54aXhpdWJiYm11ZndscnlicnV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MDczODYsImV4cCI6MjA4ODk4MzM4Nn0.abQrseu6QtsOmyH2gz3gNXZDm9FdPcqF8LGy1DofTRM';

async function test() {
  try {
    const response = await fetch(`${url}/functions/v1/analyze-document`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ documentText: 'test', question: 'test' })
    });
    
    console.log('Status:', response.status);
    const text = await response.text();
    console.log('Body:', text);
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

test();
