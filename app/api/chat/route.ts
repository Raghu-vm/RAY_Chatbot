import { NextResponse } from 'next/server'

const WEBHOOK_TEST_URL = 'http://localhost:5678/webhook-test/ray-rag-model'
const WEBHOOK_PROD_URL = 'http://localhost:5678/webhook/ray-rag-model'

export async function POST(request: Request) {
  const body = await request.json()

  for (const endpoint of [WEBHOOK_TEST_URL, WEBHOOK_PROD_URL]) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        const payload = await response.json()
        return NextResponse.json(payload)
      }
    } catch {
      // Try the next endpoint.
    }
  }

  return NextResponse.json(
    {
      message: 'n8n webhook is unavailable. Start n8n and execute/activate the workflow.',
    },
    { status: 503 },
  )
}
