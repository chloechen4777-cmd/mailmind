// Vercel serverless function — proxies AI API calls to avoid CORS
// Frontend passes X-AI-Key and X-AI-Base headers to route to any OpenAI-compatible API
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-AI-Key, X-AI-Base');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed, use POST' });
    return;
  }

  const aiKey = (req.headers['x-ai-key'] || '').trim();
  const aiBase = (req.headers['x-ai-base'] || '').trim();
  const body = req.body;

  if (!aiKey) {
    res.status(400).json({ error: 'Missing X-AI-Key header' });
    return;
  }

  // Build the target URL dynamically from the base URL
  const baseUrl = aiBase || 'https://api.sandboxcrew.ai/v1';
  // Strip trailing slash then append /chat/completions
  const targetUrl = baseUrl.replace(/\/+$/, '') + '/chat/completions';

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Authorization': aiKey.startsWith('Bearer ') ? aiKey : 'Bearer ' + aiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      // Vercel default timeout for serverless functions is 10s (Hobby) / 60s (Pro)
      // AI responses may take several seconds, so set a generous timeout
      signal: AbortSignal.timeout(55000),
    });

    // Try to parse JSON response
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      res.status(response.status).json(data);
    } else {
      const text = await response.text();
      res.status(response.status).json({ error: 'Non-JSON response from AI API', detail: text.substring(0, 500) });
    }
  } catch (err) {
    console.error('MailMind AI proxy error:', err.message);
    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      res.status(504).json({ error: 'AI API 响应超时，请稍后重试', detail: err.message });
    } else if (err.message.includes('fetch')) {
      res.status(502).json({ error: 'AI API 无法连接: ' + err.message });
    } else {
      res.status(502).json({ error: 'AI API 错误: ' + err.message });
    }
  }
}
