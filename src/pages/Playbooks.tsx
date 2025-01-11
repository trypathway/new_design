import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { PlaybookEditorModal } from '@/components/playbook-editor-modal'
import { PlaybookCreatorModal } from '@/components/playbook-creator-modal'

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
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showEditor, setShowEditor] = useState(false)
  const [editingPlaybook, setEditingPlaybook] = useState<any>(null)
  const [showCreator, setShowCreator] = useState(false)

  const handleEditPlaybook = (playbook: any) => {
    setEditingPlaybook(playbook)
    setShowEditor(true)
  }

  const handleDuplicatePlaybook = (playbook: any) => {
    // Implementation for duplicating playbook
    console.log('Duplicate playbook:', playbook)
  }

  const handleDeletePlaybook = (playbookId: string) => {
    // Implementation for deleting playbook
    console.log('Delete playbook:', playbookId)
  }

  const filteredPlaybooks = mockPlaybooks.filter(playbook =>
    playbook.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    playbook.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar-background border-r border-sidebar-border">
        <div className="p-6">
          <Button
            variant="ghost"
            className="w-full justify-start mb-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2" />
            Back to Home
          </Button>
          <Button
            onClick={() => setShowCreator(true)}
            className="w-full"
          >
            <Plus className="mr-2" />
            New Playbook
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold flex items-center">
              <BookOpen className="mr-2" />
              Playbooks
            </h1>
            <div className="w-1/3">
              <Input
                type="text"
                placeholder="Search playbooks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {filteredPlaybooks.map(playbook => (
              <Card key={playbook.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{playbook.name}</h2>
                    <p className="text-muted-foreground mb-4">{playbook.description}</p>
                    <div className="space-y-1">
                      {playbook.steps.map((step, index) => (
                        <p key={index} className="text-sm text-muted-foreground">
                          {index + 1}. {step}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditPlaybook(playbook)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDuplicatePlaybook(playbook)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeletePlaybook(playbook.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Last modified: {new Date(playbook.lastModified).toLocaleDateString()}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {showEditor && editingPlaybook && (
        <PlaybookEditorModal
          playbook={editingPlaybook}
          open={showEditor}
          onClose={() => {
            setShowEditor(false)
            setEditingPlaybook(null)
          }}
        />
      )}

      <PlaybookCreatorModal
        open={showCreator}
        onClose={() => setShowCreator(false)}
      />
    </div>
  )
}
