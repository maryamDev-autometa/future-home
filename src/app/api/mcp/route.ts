import { NextRequest, NextResponse } from 'next/server';

const GRAM_API_KEY = process.env.GRAM_API_KEY || 'gram_live_ae3bbed8532da4b276293ac1a54738ae66b5c892925310ee55389d9e85a2102a';
const MCP_ENDPOINT = 'https://app.getgram.ai/mcp/ai-labs-future_home';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Proxying MCP request:', body);
    
    const response = await fetch(MCP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GRAM_API_KEY}`,
        'X-API-Key': GRAM_API_KEY,
        'gram-api-key': GRAM_API_KEY,
        'x-gram-api-key': GRAM_API_KEY,
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    console.log('MCP Response status:', response.status);
    console.log('MCP Response:', responseText);

    if (!response.ok) {
      return NextResponse.json(
        { error: `MCP Error: ${response.status} - ${responseText}` },
        { status: response.status }
      );
    }

    try {
      const data = JSON.parse(responseText);
      return NextResponse.json(data);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON response from MCP' }, { status: 500 });
    }
  } catch (error) {
    console.error('MCP Proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'MCP Proxy is running',
    endpoint: MCP_ENDPOINT,
    hasApiKey: !!GRAM_API_KEY 
  });
}