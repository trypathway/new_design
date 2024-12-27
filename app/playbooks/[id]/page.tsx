'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BackToStartButton } from '@/components/back-to-start-button'
import { PlaybookSteps } from '@/components/playbook-steps'

// Mock data for playbooks
const mockPlaybooks = {
  '1': { 
    id: '1',
    name: "Fundamental Analysis",
    description: "Analyze company financials and market position",
    steps: [
      { id: '1', title: "Review Financial Statements", content: "Analyze the company's income statement, balance sheet, and cash flow statement." },
      { id: '2', title: "Assess Market Position", content: "Evaluate the company's competitive advantages and market share." },
      { id: '3', title: "Analyze Growth Prospects", content: "Research the company's growth strategy and potential for expansion." },
    ]
  },
  '2': { 
    id: '2',
    name: "Technical Analysis",
    description: "Study price charts and trading volumes",
    steps: [
      { id: '1', title: "Identify Trends", content: "Analyze price charts to identify long-term and short-term trends." },
      { id: '2', title: "Evaluate Support and Resistance", content: "Identify key support and resistance levels in the price chart." },
      { id: '3', title: "Assess Volume", content: "Analyze trading volumes to confirm trend strength and potential reversals." },
    ]
  },
  '3': { 
    id: '3',
    name: "Macro Economic Review",
    description: "Evaluate broader economic factors",
    steps: [
      { id: '1', title: "Analyze Economic Indicators", content: "Review key economic indicators such as GDP growth, inflation, and unemployment rates." },
      { id: '2', title: "Assess Monetary Policy", content: "Evaluate current monetary policy and potential future changes." },
      { id: '3', title: "Consider Geopolitical Factors", content: "Analyze geopolitical events and their potential impact on the economy and markets." },
    ]
  },
}

export default function PlaybookPage({ params }: { params: { id: string } }) {
  const [playbook, setPlaybook] = useState<any>(null)
  const [context, setContext] = useState<any>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const contextParam = searchParams.get('context')
    if (contextParam) {
      setContext(JSON.parse(decodeURIComponent(contextParam)))
    }

    // Load playbook data
    setPlaybook(mockPlaybooks[params.id as keyof typeof mockPlaybooks] || null)
  }, [searchParams, params.id])

  if (!playbook) {
    return <div>Playbook not found</div>
  }

  return (
    <div className="container mx-auto p-6 relative">
      <BackToStartButton />
      <h1 className="text-3xl font-bold mb-6 mt-12">{playbook.name}</h1>
      <p className="text-xl mb-6">{playbook.description}</p>
      {context && (
        <Card className="mb-4 p-4">
          <h2 className="text-xl font-semibold mb-2">Research Context</h2>
          <p>Companies: {context.companies?.join(', ') || 'None specified'}</p>
          <p>Specific Documents: {context.specificDocuments?.map((doc: any) => doc.name).join(', ') || 'None specified'}</p>
          <p>Include News: {context.includeNews ? 'Yes' : 'No'}</p>
          <p>Web Access: {context.includeWebAccess ? 'Yes' : 'No'}</p>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Playbook Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <PlaybookSteps steps={playbook.steps} />
        </CardContent>
      </Card>
    </div>
  )
}

