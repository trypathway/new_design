import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { BookOpen, Plus, X } from 'lucide-react'

interface PlaybookEditorModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (playbook: any) => void
  initialPlaybook?: any
}

export function PlaybookEditorModal({
  isOpen,
  onClose,
  onSave,
  initialPlaybook
}: PlaybookEditorModalProps) {
  const navigate = useNavigate()
  const [name, setName] = useState(initialPlaybook?.name || '')
  const [description, setDescription] = useState(initialPlaybook?.description || '')
  const [steps, setSteps] = useState<string[]>(initialPlaybook?.steps || [''])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      onSave({
        id: initialPlaybook?.id || Date.now().toString(),
        name,
        description,
        steps: steps.filter(step => step.trim()),
        lastModified: new Date().toISOString()
      })
      onClose()
      navigate('/playbooks')
    } catch (error) {
      console.error('Error updating playbook:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addStep = () => {
    setSteps([...steps, ''])
  }

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index))
  }

  const updateStep = (index: number, value: string) => {
    const newSteps = [...steps]
    newSteps[index] = value
    setSteps(newSteps)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {initialPlaybook ? 'Edit Playbook' : 'Create New Playbook'}
          </DialogTitle>
          <DialogDescription>
            Make changes to your playbook template.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Playbook Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter playbook name..."
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the purpose of this playbook..."
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label>Research Steps</Label>
            {steps.map((step, index) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 mt-2">
                  {index + 1}
                </div>
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder={`Step ${index + 1}: Describe what to research...`}
                    value={step}
                    onChange={(e) => updateStep(index, e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                {steps.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeStep(index)}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={addStep}
              disabled={isLoading}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Step
            </Button>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !name.trim() || !steps[0].trim()}
            >
              {initialPlaybook ? 'Save Changes' : 'Create Playbook'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}