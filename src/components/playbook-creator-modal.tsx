import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { BookOpen, Wand2 } from 'lucide-react'

interface PlaybookCreatorModalProps {
  open: boolean
  onClose: () => void
}

export function PlaybookCreatorModal({ open, onClose }: PlaybookCreatorModalProps) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [purpose, setPurpose] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Here you would typically make an API call to create the playbook
      console.log('Creating playbook:', { name, purpose })
      
      // For now, just close the modal and refresh
      onClose()
      // Optionally navigate or refresh the page
      navigate('/playbooks')
    } catch (error) {
      console.error('Error creating playbook:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Create New Playbook
          </DialogTitle>
          <DialogDescription>
            Create a new playbook template for your research workflow.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Playbook Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name for your playbook..."
              disabled={isLoading}
            />
          </div>

          {/* Purpose */}
          <div className="space-y-2">
            <Label htmlFor="purpose">What would you like the playbook to do?</Label>
            <Textarea
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Describe the purpose and goals of this playbook..."
              disabled={isLoading}
              className="h-32"
            />
          </div>

          {/* Actions */}
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
              disabled={isLoading || !name.trim() || !purpose.trim()}
            >
              Create
            </Button>
            <Button
              type="button"
              onClick={() => {
                // Here you would typically make an API call to auto draft the playbook
                console.log('Auto drafting playbook:', { name, purpose })
                // For now, just close the modal and refresh
                onClose()
                // Optionally navigate or refresh the page
                navigate('/playbooks')
              }}
              disabled={isLoading || !name.trim() || !purpose.trim()}
              className="gap-2"
            >
              <Wand2 className="h-4 w-4" />
              Draft Playbook
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}