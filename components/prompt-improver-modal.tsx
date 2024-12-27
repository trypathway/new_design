'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Wand2 } from 'lucide-react'

interface PromptImproverModalProps {
  isOpen: boolean
  onClose: () => void
  originalPrompt: string
  onAccept: (improvedPrompt: string) => void
}

export function PromptImproverModal({
  isOpen,
  onClose,
  originalPrompt,
  onAccept,
}: PromptImproverModalProps) {
  const [improvedPrompt, setImprovedPrompt] = useState('')
  const [isImproving, setIsImproving] = useState(true)

  // Simulate prompt improvement - replace with actual API call
  const improvePrompt = async (prompt: string) => {
    // Simulated delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Example improvement - replace with actual API logic
    const improved = `Here's a more detailed version of your prompt:

${prompt}

Additional context and specifications:
- Include specific metrics and data points
- Request comparative analysis where relevant
- Ask for concrete examples and case studies
- Specify the time period for analysis`

    setImprovedPrompt(improved)
    setIsImproving(false)
  }

  // Start improvement when modal opens
  useState(() => {
    if (isOpen && originalPrompt) {
      setIsImproving(true)
      improvePrompt(originalPrompt)
    }
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Improve Your Prompt
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Review the improved version of your research prompt.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Original Prompt */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Original Prompt:</h3>
            <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-600">
              {originalPrompt}
            </div>
          </div>

          {/* Improved Prompt */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Improved Version:</h3>
            {isImproving ? (
              <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-600 animate-pulse">
                Improving your prompt...
              </div>
            ) : (
              <ScrollArea className="h-[200px] w-full rounded-md border">
                <div className="p-3 text-sm whitespace-pre-wrap">
                  {improvedPrompt}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Keep Original
          </Button>
          <Button
            onClick={() => onAccept(improvedPrompt)}
            className="bg-gray-900 hover:bg-gray-800"
            disabled={isImproving}
          >
            Use Improved Version
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 