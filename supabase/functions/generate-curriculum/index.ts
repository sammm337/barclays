import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const NVIDIA_API_KEY = Deno.env.get('NVIDIA_API_KEY');
const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subject } = await req.json();
    console.log('Generating curriculum for subject:', subject);

    if (!NVIDIA_API_KEY) {
      throw new Error('NVIDIA API key not configured');
    }

    console.log('Sending request to NVIDIA API...');
    const response = await fetch(NVIDIA_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are a curriculum design expert. Generate structured learning modules that follow industry standards and best practices.'
          },
          {
            role: 'user',
            content: `Generate a structured learning curriculum for ${subject}. Create 10 modules, each with:
              - Name (short, engaging title)
              - Description (brief overview)
              - Topics Covered (as an array of strings)
              - Difficulty Level (Easy, Medium, or Hard)
              
              Ensure progression from beginner to advanced levels.
              Return the response as a JSON array of modules.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        model: "meta/llama3-70b-instruct",
        stream: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NVIDIA API error response:', errorText);
      console.error('Response status:', response.status);
      console.error('Response headers:', Object.fromEntries(response.headers.entries()));
      throw new Error(`NVIDIA API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Generated curriculum:', data);

    return new Response(
      JSON.stringify(data.choices[0].message.content),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});