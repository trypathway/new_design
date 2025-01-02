'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MessageSquare, BookOpen, PlusCircle } from 'lucide-react'
import { ContextWindow } from '@/app/components/context-window'

export function NewResearchModal() {
  const [open, setOpen] = useState(false)
  const [showContext, setShowContext] = useState(false)
  const [context, setContext] = useState<any>(null)
  const router = useRouter()

  console.log('NewResearchModal state:', { open, showContext });

  const handleNewResearchClick = useCallback(() => {
    console.log('New Research clicked');
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
    console.log('Context complete:', contextData);
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
        onClose={() => {
          console.log('Closing context window');
          setShowContext(false)
        }} 
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
            <Button 
              className="h-32 flex flex-col items-center justify-center space-y-2 p-4" 
              variant="outline" 
              onClick={() => handleSelection('chat')}
            >
              <MessageSquare className="h-8 w-8" />
              <span className="text-base font-medium">Chat</span>
            </Button>
            <Button 
              className="h-32 flex flex-col items-center justify-center space-y-2 p-4" 
              variant="outline" 
              onClick={() => handleSelection('playbook')}
            >
              <BookOpen className="h-8 w-8" />
              <span className="text-base font-medium">Playbook</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

