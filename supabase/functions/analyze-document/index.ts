import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { documentText, question } = await req.json();

    if (!documentText || !question) {
      return new Response(JSON.stringify({ error: 'Missing documentText or question' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIKey) {
      throw new Error('Не найден ключ OPENAI_API_KEY. Убедитесь, что отправили секрет командой npx supabase secrets set OPENAI_API_KEY=...');
    }

    // Ограничиваем текст до 30 000 символов, чтобы не превысить лимиты OpenAI
    const truncatedText = documentText.substring(0, 30000);

    // Вызываем OpenAI через чистый fetch, чтобы избежать проблем с импортами библиотек в Deno
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Ты — высококвалифицированный ИИ-Инженер из Казахстана. Твоя задача — анализировать строительные документы (СНиП, ГОСТ, НТП РК, проекты) и давать четкие, профессиональные, аргументированные ответы. При составлении ответа ОПИРАЙСЯ СТРОГО на предоставленный текст документа и действующие строительные нормы Республики Казахстан. Отвечай в формате Markdown, структурированно, без воды.'
          },
          {
            role: 'user',
            content: `Вот выдержка из загруженного документа:\n\n---\n${truncatedText}\n---\n\nВопрос инженера: ${question}`
          }
        ],
        temperature: 0.2,
        max_tokens: 1500,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Ошибка OpenAI: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const answer = data.choices[0].message.content;

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : String(error) 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
