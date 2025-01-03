'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, Wand2 } from 'lucide-react'

interface PlaybookCreatorModalProps {
  isOpen: boolean
  onClose: () => void
  onManualCreate: (name: string, purpose: string) => void
  onAutoDraft: (name: string, purpose: string) => void
}

export function PlaybookCreatorModal({
  isOpen,
  onClose,
  onManualCreate,
  onAutoDraft
}: PlaybookCreatorModalProps) {
  const [name, setName] = useState('')
  const [purpose, setPurpose] = useState('')

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Create New Playbook
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Playbook Name
            </label>
            <Input
              placeholder="Enter a name for your playbook..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Purpose */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              What would you like the playbook to do?
            </label>
            <Textarea
              placeholder="Describe the purpose and goals of this playbook..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="h-32"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => onAutoDraft(name, purpose)}
              disabled={!name.trim() || !purpose.trim()}
              className="gap-2"
            >
              <Wand2 className="h-4 w-4" />
              Draft Playbook
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">or</span>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => onManualCreate(name, purpose)}
              disabled={!name.trim() || !purpose.trim()}
            >
              Create Manually
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 