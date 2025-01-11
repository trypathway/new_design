import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, BookOpen } from 'lucide-react'

export function PlaybookSelection() {
  const playbooks = [
    { id: 1, name: "Fundamental Analysis", description: "Analyze company financials and market position" },
    { id: 2, name: "Technical Analysis", description: "Study price charts and trading volumes" },
    { id: 3, name: "Macro Economic Review", description: "Evaluate broader economic factors" },
  ]

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Select a Playbook</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playbooks.map((playbook) => (
          <Card key={playbook.id}>
            <CardHeader>
              <CardTitle>{playbook.name}</CardTitle>
              <CardDescription>{playbook.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
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
            <Button className="w-full" variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Playbook
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

