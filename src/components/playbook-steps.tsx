'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Trash2 } from 'lucide-react'

interface Step {
  id: string
  title: string
  content: string
}

interface PlaybookStepsProps {
  steps: Step[]
}

export function PlaybookSteps({ steps: initialSteps }: PlaybookStepsProps) {
  const [steps, setSteps] = useState<Step[]>(initialSteps)
  const [editingStep, setEditingStep] = useState<string | null>(null)

  const handleEdit = (id: string) => {
    setEditingStep(id)
  }

  const handleSave = (id: string, newTitle: string, newContent: string) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, title: newTitle, content: newContent } : step
    ))
    setEditingStep(null)
  }

  const handleDelete = (id: string) => {
    setSteps(steps.filter(step => step.id !== id))
  }

  const handleAdd = () => {
    const newStep: Step = {
      id: Date.now().toString(),
      title: "New Step",
      content: "Describe the new step here."
    }
    setSteps([...steps, newStep])
    setEditingStep(newStep.id)
  }

  return (
    <div className="space-y-4">
      {steps.map((step) => (
        <Card key={step.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {editingStep === step.id ? (
                <Input 
                  value={step.title}
                  onChange={(e) => setSteps(steps.map(s => 
                    s.id === step.id ? { ...s, title: e.target.value } : s
                  ))}
                />
              ) : (
                step.title
              )}
              <div>
                {editingStep === step.id ? (
                  <Button onClick={() => handleSave(step.id, step.title, step.content)}>Save</Button>
                ) : (
                  <Button variant="ghost" onClick={() => handleEdit(step.id)}>Edit</Button>
                )}
                <Button variant="ghost" onClick={() => handleDelete(step.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editingStep === step.id ? (
              <Textarea 
                value={step.content}
                onChange={(e) => setSteps(steps.map(s => 
                  s.id === step.id ? { ...s, content: e.target.value } : s
                ))}
                rows={4}
              />
            ) : (
              <p>{step.content}</p>
            )}
          </CardContent>
        </Card>
      ))}
      <Button onClick={handleAdd} className="w-full">
        <PlusCircle className="mr-2 h-4 w-4" /> Add Step
      </Button>
    </div>
  )
}

