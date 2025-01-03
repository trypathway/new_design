'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  const [name, setName] = useState(initialPlaybook?.name || '')
  const [description, setDescription] = useState(initialPlaybook?.description || '')
  const [steps, setSteps] = useState<string[]>(initialPlaybook?.steps || [''])

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
        </DialogHeader>

        <div className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Playbook Name
            </label>
            <Input
              placeholder="Enter playbook name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Description
            </label>
            <Textarea
              placeholder="Describe the purpose of this playbook..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-24"
            />
          </div>

          {/* Steps */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-900">
                Research Steps
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={addStep}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Step
              </Button>
            </div>
            <div className="space-y-3">
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
                      className="w-full"
                    />
                  </div>
                  {steps.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeStep(index)}
                      className="text-gray-400 hover:text-red-500 mt-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onSave({
                  id: initialPlaybook?.id || Date.now().toString(),
                  name,
                  description,
                  steps: steps.filter(step => step.trim()),
                  lastModified: new Date().toISOString()
                })
              }}
              disabled={!name.trim() || !steps[0].trim()}
            >
              {initialPlaybook ? 'Save Changes' : 'Create Playbook'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 