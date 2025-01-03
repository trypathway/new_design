'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  BookOpen, 
  Plus, 
  Search,
  ArrowLeft,
  Edit,
  Copy,
  Trash2
} from 'lucide-react'
import { PlaybookEditorModal } from '@/app/components/playbook-editor-modal'
import { PlaybookCreatorModal } from '@/app/components/playbook-creator-modal'

// Mock playbook data
const mockPlaybooks = [
  {
    id: '1',
    name: 'Earnings Analysis',
    description: 'Standard template for analyzing quarterly earnings reports',
    steps: [
      'Review key financial metrics',
      'Analyze year-over-year growth',
      'Check guidance and forecasts'
    ],
    lastModified: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Competitor Analysis',
    description: 'Framework for comparing companies in the same industry',
    steps: [
      'Market share analysis',
      'Product comparison',
      'Financial metrics comparison'
    ],
    lastModified: '2024-01-14T15:30:00Z'
  }
]

export default function PlaybooksPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [showEditor, setShowEditor] = useState(false)
  const [editingPlaybook, setEditingPlaybook] = useState<any>(null)
  const [showCreator, setShowCreator] = useState(false)

  const filteredPlaybooks = mockPlaybooks.filter(playbook =>
    playbook.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    playbook.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEdit = (playbook: any) => {
    setEditingPlaybook(playbook)
    setShowEditor(true)
  }

  const handleSave = (updatedPlaybook: any) => {
    // Handle save logic here
    setShowEditor(false)
    setEditingPlaybook(null)
  }

  const handleManualCreate = (name: string, purpose: string) => {
    setShowCreator(false)
    setEditingPlaybook({
      name,
      description: purpose,
      steps: ['']
    })
    setShowEditor(true)
  }

  const handleAutoDraft = (name: string, purpose: string) => {
    // Here we would call AI to generate steps
    // For now, using mock data
    setShowCreator(false)
    setEditingPlaybook({
      name,
      description: purpose,
      steps: [
        'Step 1: Initial research',
        'Step 2: Data analysis',
        'Step 3: Final review'
      ]
    })
    setShowEditor(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto max-w-7xl px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/')}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Playbook Manager
                </h1>
              </div>
            </div>
            <Button 
              onClick={() => setShowCreator(true)} 
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              New Playbook
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-8 py-12">
        {/* Search */}
        <div className="mb-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search playbooks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Playbooks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPlaybooks.map((playbook) => (
            <Card key={playbook.id} className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {playbook.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {playbook.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/playbooks/${playbook.id}`)
                    }}
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle delete
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Steps:</h4>
                <ul className="space-y-1">
                  {playbook.steps.map((step, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push(`/playbooks/${playbook.id}`)}
                >
                  Use Playbook
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <PlaybookEditorModal
        isOpen={showEditor}
        onClose={() => {
          setShowEditor(false)
          setEditingPlaybook(null)
        }}
        onSave={handleSave}
        initialPlaybook={editingPlaybook}
      />

      <PlaybookCreatorModal
        isOpen={showCreator}
        onClose={() => setShowCreator(false)}
        onManualCreate={handleManualCreate}
        onAutoDraft={handleAutoDraft}
      />
    </div>
  )
}

