'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  FileText, 
  Building2, 
  Newspaper, 
  Globe, 
  GripVertical,
  Plus,
  X,
  Edit2,
  Save,
  PlayCircle,
  Wand2,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { BackToStartButton } from '@/components/back-to-start-button'
import { PromptImproverModal } from '@/components/prompt-improver-modal'

// Mock playbook data
const MOCK_PLAYBOOKS = {
  "1": {
    name: "Fundamental Analysis",
    description: "Analyze company financials and market position",
    steps: [
      {
        id: '1',
        title: 'Financial Overview',
        description: 'Review key financial metrics and ratios',
        prompt: 'Analyze the company\'s key financial metrics including revenue growth, profit margins, and cash flow trends over the past 3 years.'
      },
      {
        id: '2',
        title: 'Market Position',
        description: 'Evaluate competitive position and market share',
        prompt: 'Assess the company\'s market position, including market share, competitive advantages, and industry dynamics.'
      },
      {
        id: '3',
        title: 'Risk Assessment',
        description: 'Identify key risks and challenges',
        prompt: 'Identify and analyze key business risks, regulatory challenges, and potential threats to the company\'s business model.'
      }
    ]
  }
}

interface PlaybookStep {
  id: string
  title: string
  description: string
  prompt: string
}

export default function PlaybookPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [context, setContext] = useState<any>(null)
  const [playbook, setPlaybook] = useState<any>(null)
  const [editMode, setEditMode] = useState(false)
  const [steps, setSteps] = useState<PlaybookStep[]>([])
  const [editingStep, setEditingStep] = useState<string | null>(null)
  const [improvingStepId, setImprovingStepId] = useState<string | null>(null)
  const [isContextCollapsed, setIsContextCollapsed] = useState(false)

  useEffect(() => {
    const contextParam = searchParams.get('context')
    if (contextParam) {
      setContext(JSON.parse(decodeURIComponent(contextParam)))
    }

    // Load playbook data
    if (params.id !== 'new') {
      const playbookData = MOCK_PLAYBOOKS[params.id as keyof typeof MOCK_PLAYBOOKS]
      if (playbookData) {
        setPlaybook(playbookData)
        setSteps(playbookData.steps)
      }
    } else {
      setEditMode(true)
    }
  }, [params.id, searchParams])

  const handleAddStep = () => {
    const newStep: PlaybookStep = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Step',
      description: 'Step description',
      prompt: 'Research prompt'
    }
    setSteps([...steps, newStep])
    setEditingStep(newStep.id)
  }

  const handleDeleteStep = (stepId: string) => {
    setSteps(steps.filter(step => step.id !== stepId))
  }

  const handleStepChange = (stepId: string, field: keyof PlaybookStep, value: string) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, [field]: value } : step
    ))
  }

  const handleSavePlaybook = () => {
    // Here you would typically save to your backend
    console.log('Saving playbook:', { ...playbook, steps })
    setEditMode(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <BackToStartButton />
        
        <div className="flex items-center justify-between mb-6 mt-12">
          <div>
            <h1 className="text-3xl font-bold">
              {params.id === 'new' ? 'New Quantly Playbook' : playbook?.name}
            </h1>
            {playbook?.description && (
              <p className="text-gray-500 mt-1">{playbook.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            {!editMode && (
              <Button 
                variant="outline" 
                onClick={() => setEditMode(true)}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Playbook
              </Button>
            )}
            {editMode && (
              <Button 
                onClick={handleSavePlaybook}
                className="bg-gray-900 hover:bg-gray-800"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Playbook
              </Button>
            )}
          </div>
        </div>

        {/* Research Context Card */}
        {context && (
          <Card className="mb-6 border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-gray-100 p-1.5 rounded-md">
                    <FileText className="h-4 w-4 text-gray-700" />
                  </div>
                  <h2 className="text-base font-semibold text-gray-900">Research Context</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsContextCollapsed(!isContextCollapsed)}
                  className="text-gray-500 hover:text-gray-900"
                >
                  {isContextCollapsed ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <div
                className={`overflow-hidden transition-all duration-200 ease-in-out ${
                  isContextCollapsed ? 'max-h-0' : 'max-h-[500px]'
                }`}
              >
                <div className="grid grid-cols-2 gap-3">
                  {/* ... Context content ... */}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Playbook Steps */}
        <div className="space-y-4 mb-8">
          {steps.map((step, index) => (
            <Card 
              key={step.id} 
              className={`border-gray-200 transition-shadow hover:shadow-md
                       ${editMode ? 'cursor-move' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {editMode && (
                    <div className="pt-1.5">
                      <GripVertical className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium">
                        {index + 1}
                      </span>
                      {editingStep === step.id ? (
                        <Input
                          value={step.title}
                          onChange={(e) => handleStepChange(step.id, 'title', e.target.value)}
                          className="font-medium text-lg"
                          placeholder="Step title"
                        />
                      ) : (
                        <h3 className="text-lg font-medium">{step.title}</h3>
                      )}
                    </div>

                    <div className="pl-11 space-y-3"> {/* Aligned with step title */}
                      {editingStep === step.id ? (
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                              Description
                            </label>
                            <Input
                              value={step.description}
                              onChange={(e) => handleStepChange(step.id, 'description', e.target.value)}
                              placeholder="Brief description of this step"
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-sm font-medium text-gray-700">
                                Research Prompt
                              </label>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setImprovingStepId(step.id)}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                <Wand2 className="h-3.5 w-3.5 mr-1.5" />
                                Improve Prompt
                              </Button>
                            </div>
                            <Textarea
                              value={step.prompt}
                              onChange={(e) => handleStepChange(step.id, 'prompt', e.target.value)}
                              placeholder="Enter the research prompt for this step"
                              className="h-32"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingStep(null)}
                            >
                              Done
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600">{step.description}</p>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-medium text-gray-700">Research Prompt</h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setImprovingStepId(step.id)}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                <Wand2 className="h-3.5 w-3.5 mr-1.5" />
                                Improve
                              </Button>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-md text-sm border border-gray-100">
                              {step.prompt}
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingStep(step.id)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                              Edit
                            </Button>
                            {editMode && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteStep(step.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-3.5 w-3.5 mr-1.5" />
                                Delete
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {editMode && (
            <Button
              variant="outline"
              className="w-full py-6 border-dashed"
              onClick={handleAddStep}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Step
            </Button>
          )}
        </div>

        {/* Start Playbook Button */}
        {!editMode && steps.length > 0 && (
          <div className="fixed bottom-8 left-0 right-0 flex justify-center">
            <Button
              size="lg"
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 rounded-xl 
                       shadow-lg hover:shadow-xl transition-all duration-200 
                       flex items-center gap-3 h-auto border border-gray-800
                       hover:border-gray-700"
              onClick={() => {
                // Handle starting the playbook
                router.push(`/playbooks/${params.id}/run${context ? `?context=${encodeURIComponent(JSON.stringify(context))}` : ''}`)
              }}
            >
              <PlayCircle className="h-5 w-5" />
              <span className="text-base font-medium">Start Playbook</span>
            </Button>
          </div>
        )}

        {/* Prompt Improver Modal */}
        {improvingStepId && (
          <PromptImproverModal
            isOpen={!!improvingStepId}
            onClose={() => setImprovingStepId(null)}
            originalPrompt={steps.find(s => s.id === improvingStepId)?.prompt || ''}
            onAccept={(improvedPrompt) => {
              handleStepChange(improvingStepId, 'prompt', improvedPrompt)
              setImprovingStepId(null)
            }}
          />
        )}
      </div>
    </div>
  )
}

