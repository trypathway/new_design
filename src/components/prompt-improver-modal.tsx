'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
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
  onAccept 
}: PromptImproverModalProps) {
  const [improvement, setImprovement] = useState('')
  const [improvedPrompt, setImprovedPrompt] = useState('')

  const handleImprove = () => {
    // Mock improvement - replace with actual AI call
    const improved = `Here's an improved version of your prompt that ${
      improvement ? 'incorporates your suggestions and ' : ''
    }adds more specificity and structure:\n\n${originalPrompt}`
    setImprovedPrompt(improved)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Improve Prompt
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Original Prompt */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Original Prompt
            </label>
            <div className="p-3 bg-gray-50 rounded-lg text-gray-700 text-sm">
              {originalPrompt}
            </div>
          </div>

          {/* Improvement Direction */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              How would you like to improve the prompt?
            </label>
            <Textarea
              placeholder="Optional: Add specific aspects you'd like to improve..."
              value={improvement}
              onChange={(e) => setImprovement(e.target.value)}
              className="h-24"
            />
          </div>

          {/* Improved Version */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-900">
                Improved Version
              </label>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleImprove}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Improvement
              </Button>
            </div>
            {improvedPrompt ? (
              <div className="p-3 bg-emerald-50 rounded-lg text-emerald-900 text-sm">
                {improvedPrompt}
              </div>
            ) : (
              <div className="p-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 text-sm text-center">
                Click "Generate Improvement" to see the improved version
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                onAccept(originalPrompt)
              }}
            >
              Use Original
            </Button>
            <Button
              onClick={() => {
                if (improvedPrompt) {
                  onAccept(improvedPrompt)
                }
              }}
              disabled={!improvedPrompt}
            >
              Use Improved Version
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 