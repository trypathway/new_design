'use client'

import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MessageSquare, BookOpen, PlusCircle } from "lucide-react"
import { ContextWindow } from "@/components/context-window"

interface NewResearchModalProps {
  buttonProps?: React.ComponentProps<typeof Button>
}

export function NewResearchModal({ buttonProps }: NewResearchModalProps) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [showContext, setShowContext] = useState(false)
  const [context, setContext] = useState<any>(null)

  const handleContextComplete = useCallback((contextData: any) => {
    console.log('Context complete:', contextData)
    setContext(contextData)
    setShowContext(false)
  }, [])

  const handleSelection = useCallback((type: 'chat' | 'playbook') => {
    setOpen(false)
    if (type === 'chat') {
      navigate(`/chat/new?context=${encodeURIComponent(JSON.stringify(context))}`)
    } else {
      navigate(`/playbooks?context=${encodeURIComponent(JSON.stringify(context))}`)
    }
  }, [context, navigate])

  return (
    <>
      <Button
        {...buttonProps}
        variant="outline"
        className="gap-2"
        onClick={() => setOpen(true)}
      >
        <PlusCircle className="h-4 w-4" />
        New Research
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Research</DialogTitle>
            <DialogDescription>
              Choose how you would like to start your research.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-32 flex flex-col items-center justify-center gap-2"
              onClick={() => {
                setOpen(false)
                setShowContext(true)
              }}
            >
              <MessageSquare className="h-8 w-8" />
              Chat with Context
            </Button>

            <Button
              variant="outline"
              className="h-32 flex flex-col items-center justify-center gap-2"
              onClick={() => handleSelection('playbook')}
            >
              <BookOpen className="h-8 w-8" />
              Use Playbook
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ContextWindow
        isOpen={showContext}
        onClose={() => setShowContext(false)}
        onComplete={handleContextComplete}
      />
    </>
  )
}
