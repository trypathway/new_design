'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, BookOpen } from 'lucide-react'
import { BackToStartButton } from '@/components/back-to-start-button'

export default function PlaybookSelection() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const context = searchParams.get('context') ? JSON.parse(decodeURIComponent(searchParams.get('context')!)) : null

  const playbooks = [
    { id: 1, name: "Fundamental Analysis", description: "Analyze company financials and market position" },
    { id: 2, name: "Technical Analysis", description: "Study price charts and trading volumes" },
    { id: 3, name: "Macro Economic Review", description: "Evaluate broader economic factors" },
  ]

  const handlePlaybookStart = (id: number) => {
    router.push(`/playbooks/${id}${context ? `?context=${encodeURIComponent(JSON.stringify(context))}` : ''}`)
  }

  const handleCreatePlaybook = () => {
    router.push(`/playbooks/new${context ? `?context=${encodeURIComponent(JSON.stringify(context))}` : ''}`)
  }

  return (
    <div className="container mx-auto p-6 relative">
      <BackToStartButton />
      <h1 className="text-3xl font-bold mb-6 mt-12">Select a Playbook</h1>
      {context && (
        <Card className="mb-4 p-4">
          <h2 className="text-xl font-semibold mb-2">Research Context</h2>
          <p>Companies: {context.companies?.join(', ') || 'None specified'}</p>
          <p>Specific Documents: {context.specificDocuments?.map((doc: any) => doc.name).join(', ') || 'None specified'}</p>
          <p>Include News: {context.includeNews ? 'Yes' : 'No'}</p>
          <p>Web Access: {context.includeWebAccess ? 'Yes' : 'No'}</p>
        </Card>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playbooks.map((playbook) => (
          <Card key={playbook.id}>
            <CardHeader>
              <CardTitle>{playbook.name}</CardTitle>
              <CardDescription>{playbook.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => handlePlaybookStart(playbook.id)}>
                <BookOpen className="mr-2 h-4 w-4" /> Start Playbook
              </Button>
            </CardContent>
          </Card>
        ))}
        <Card>
          <CardHeader>
            <CardTitle>Create New Playbook</CardTitle>
            <CardDescription>Define a new research workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" onClick={handleCreatePlaybook}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create Playbook
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

