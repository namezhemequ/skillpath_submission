const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';

const SYSTEM_PROMPT = `You are an expert curriculum designer. Given a learning goal, output structured JSON with a skill dependency tree and daily action plan. Output ONLY valid JSON.

{
  "skillTree": [
    {
      "id": "n1",
      "title": "技能名称",
      "description": "该技能涵盖什么、学完能做什么",
      "estimatedHours": 15,
      "difficulty": 1,
      "resources": [{"title": "资源名", "url": "https://...", "type": "article|video|course|project", "duration": "2h"}],
      "dependencies": [],
      "status": "unlocked",
      "progress": 0
    }
  ],
  "tasks": [
    {
      "id": "t1",
      "planId": "",
      "nodeId": "n1",
      "title": "具体行动项",
      "description": "怎么做、做到什么程度",
      "date": "2026-06-22",
      "completed": false,
      "order": 1
    }
  ]
}

Rules:
- 8-12 skill nodes in 3-4 dependency layers. Root nodes (no deps) status="unlocked", others="locked"
- difficulty: 1/2/3. estimatedHours: 5-40h
- Each node: 1-3 real resources with valid URLs (Bilibili, official docs, Coursera, etc. NO "#" links)
- 12-18 daily tasks spread across 7-28 days. Multiple tasks same date: order 1,2,3...
- Tasks must be specific & actionable: "花20分钟完成XX教程第1章" not "学习XX"
- All text in Chinese. Valid dependency references only
- Progress from foundational to advanced`;

export default async function handler(req: Request): Promise<Response> {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (!DEEPSEEK_API_KEY) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }

  let body: { goal?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid body' }), {
      status: 400,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }

  const goal = body.goal?.trim();
  if (!goal) {
    return new Response(JSON.stringify({ error: 'Goal required' }), {
      status: 400,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }

  try {
    const resp = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `为学习目标生成学习计划：${goal}` },
        ],
        temperature: 0.6,
        max_tokens: 2560,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error('DeepSeek error:', resp.status, errText.slice(0, 200));
      throw new Error(`DeepSeek returned ${resp.status}`);
    }

    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty response');

    let parsed = JSON.parse(content);

    // Handle markdown code block wrapping
    if (!parsed.skillTree && typeof content === 'string') {
      const m = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (m) parsed = JSON.parse(m[1]);
    }

    if (!parsed.skillTree?.length || !parsed.tasks?.length) {
      throw new Error('Missing skillTree or tasks in response');
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Decompose failed:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }
}
