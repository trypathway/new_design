'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MessageSquare, BookOpen, PlusCircle } from 'lucide-react'
import { ContextWindow } from './context-window'

export function NewResearchModal() {
  const [open, setOpen] = useState(false)
  const [showContext, setShowContext] = useState(false)
  const [context, setContext] = useState<any>(null)
  const router = useRouter()

  const handleNewResearchClick = useCallback(() => {
    setShowContext(true)
  }, [])

  const handleSelection = useCallback((type: 'chat' | 'playbook') => {
    setOpen(false)
    if (type === 'chat') {
      router.push(`/chat/new?context=${encodeURIComponent(JSON.stringify(context))}`)
    } else {
      router.push(`/playbooks?context=${encodeURIComponent(JSON.stringify(context))}`)
    }
  }, [context, router])

  const handleContextComplete = useCallback((contextData: any) => {
    setContext(contextData)
    setShowContext(false)
    setOpen(true)
  }, [])

  return (
    <>
      <Button onClick={handleNewResearchClick}>
        <PlusCircle className="mr-2 h-4 w-4" /> New Research
      </Button>
      <ContextWindow 
        isOpen={showContext} 
        onClose={() => setShowContext(false)} 
        onComplete={handleContextComplete} 
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Start New Research</DialogTitle>
            <DialogDescription>
              Choose how you want to begin your research.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button className="h-24 flex-col" variant="outline" onClick={() => handleSelection('chat')}>
              <MessageSquare className="mb-2 h-6 w-6" />
              Chat
            </Button>
            <Button className="h-24 flex-col" variant="outline" onClick={() => handleSelection('playbook')}>
              <BookOpen className="mb-2 h-6 w-6" />
              Playbook
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

