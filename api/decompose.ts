const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_URL = 'https://api.deepseek.com/v1/chat/completions';

const SYSTEM_PROMPT = `You are an expert curriculum designer and learning path architect. Given any learning goal, you output a structured JSON with a skill dependency tree and daily action plan.

Output ONLY valid JSON, no other text. The JSON must match this structure exactly:

{
  "skillTree": [
    {
      "id": "n1",
      "title": "技能名称 (Chinese)",
      "description": "该技能具体涵盖什么、学完能做什么",
      "estimatedHours": 15,
      "difficulty": 1,
      "resources": [
        {"title": "资源名称", "url": "https://...", "type": "article", "duration": "2h"}
      ],
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
      "title": "具体可执行的行动项 (Chinese)",
      "description": "怎么做、做到什么程度算完成",
      "date": "2026-06-22",
      "completed": false,
      "order": 1
    }
  ]
}

Rules (follow strictly):
1. Generate 8-12 skill nodes organized in 3-4 layers of dependency depth (tree structure, not flat list)
2. Root nodes (no dependencies): status = "unlocked". Other nodes: status = "locked"
3. difficulty: 1=beginner, 2=intermediate, 3=advanced. Use a mix
4. estimatedHours: realistic, 5-40h per node
5. Each node has 1-3 resources with REAL, accessible URLs (Bilibili, Coursera, official docs, Zhihu, etc.). NO placeholder "#" links
6. Generate 12-20 daily tasks spread across 7-30 days starting from today or tomorrow
7. Each task: specific title + description, actionable today ("花20分钟阅读Pandas官方快速入门" not "学习Pandas")
8. Multiple tasks on the same date: assign sequential order numbers starting from 1
9. All text (titles, descriptions) in Chinese
10. All dependency references must be valid (don't reference non-existent node IDs)
11. Learning path should progress from foundational → intermediate → advanced, reflecting real learning sequences`;

export default async function handler(req: Request): Promise<Response> {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }

  if (!DEEPSEEK_API_KEY) {
    return new Response(JSON.stringify({ error: 'DEEPSEEK_API_KEY not configured' }), {
      status: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }

  let body: { goal?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }

  const goal = body.goal?.trim();
  if (!goal) {
    return new Response(JSON.stringify({ error: 'Goal is required' }), {
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
          { role: 'user', content: `请为以下学习目标生成结构化学习计划：${goal}` },
        ],
        temperature: 0.7,
        max_tokens: 4096,
        response_format: { type: 'json_object' },
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error('DeepSeek API error:', resp.status, errText);
      throw new Error(`DeepSeek API returned ${resp.status}`);
    }

    const data: any = await resp.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Empty response from DeepSeek');
    }

    let parsed: any;
    try {
      parsed = JSON.parse(content);
    } catch {
      // Try to extract JSON from markdown code block
      const match = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match) {
        parsed = JSON.parse(match[1]);
      } else {
        throw new Error('Failed to parse JSON from response');
      }
    }

    if (!parsed.skillTree || !Array.isArray(parsed.skillTree) || !parsed.tasks || !Array.isArray(parsed.tasks)) {
      throw new Error('Response missing required fields');
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Decompose error:', error.message);
    return new Response(JSON.stringify({ error: error.message || 'Internal error' }), {
      status: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }
}
