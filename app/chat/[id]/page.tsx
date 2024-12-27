'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SendHorizontal, User, Bot, X } from 'lucide-react'
import { BackToStartButton } from '@/components/back-to-start-button'
import { PDFViewer } from '@/components/pdf-viewer'
import { ErrorBoundary } from '@/components/error-boundary'
import { LogViewer } from '@/components/log-viewer'

// Mock data for existing chats
const mockChatData: Record<string, { messages: Array<{ role: 'user' | 'assistant', content: string }>, context: any }> = {
  "1": {
    messages: [
      { role: 'user', content: "Can you analyze Apple's financial performance?" },
      { role: 'assistant', content: "Let's analyze Apple's recent performance..." }
    ],
    context: {
      companies: ['Apple'],
      specificDocuments: ['Apple Q3 2023 Earnings Report'],
      includeNews: true,
      includeWebAccess: false
    }
  }
}

// Mock PDF data
const mockPDFData = {
  "Apple Q3 2023 Earnings Report": {
    url: "/placeholder.svg?height=1000&width=800",
    highlights: [
      { page: 1, rect: { x1: 50, y1: 100, x2: 400, y2: 150 } }
    ]
  }
}

export default function ChatPage({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([])
  const [input, setInput] = useState('')
  const [selectedCitation, setSelectedCitation] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [context, setContext] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        console.log('Loading chat data for ID:', params.id) // Debug log
        
        if (params.id === 'new') {
          const contextParam = searchParams.get('context')
          console.log('Context param:', contextParam) // Debug log
          
          if (contextParam) {
            const parsedContext = JSON.parse(decodeURIComponent(contextParam))
            setContext(parsedContext)
          } else {
            console.log('No context parameter found') // Debug log
          }
        } else {
          const chatData = mockChatData[params.id]
          console.log('Found chat data:', chatData) // Debug log
          
          if (chatData) {
            setMessages(chatData.messages)
            setContext(chatData.context)
          } else {
            setError('Chat not found. Please select a different chat or start a new one.')
          }
        }
      } catch (error) {
        console.error('Error loading chat:', error)
        setError('Failed to load chat data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.id, searchParams])

  const handleSend = useCallback(() => {
    if (input.trim()) {
      setMessages(prevMessages => [...prevMessages, { role: 'user', content: input }])
      setInput('')

      // Mock AI response
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: "I'm sorry, but as an AI language model, I don't have real-time data or the ability to perform actual analysis. In a real application, this is where the AI would provide a response based on the user's input and the given context." }])
      }, 1000)
    }
  }, [input])

  const handleCitationClick = useCallback((citation: string) => {
    setSelectedCitation(citation)
  }, [])

  const closePDFViewer = useCallback(() => {
    setSelectedCitation(null)
  }, [])

  const handleErrorDismiss = useCallback(() => {
    setError(null)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading chat...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 flex flex-col min-h-screen">
        <BackToStartButton />
        
        <h1 className="text-3xl font-bold mb-6 mt-12">
          Research Chat {params.id === 'new' ? '(New)' : `#${params.id}`}
        </h1>

        {error && (
          <div className="bg-destructive/15 text-destructive px-4 py-3 rounded mb-4 flex justify-between items-center" role="alert">
            <span>{error}</span>
            <Button variant="ghost" size="icon" onClick={handleErrorDismiss}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {context && (
          <Card className="mb-4">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-2">Research Context</h2>
              <p>Companies: {context.companies?.join(', ') || 'None specified'}</p>
              <p>Documents: {context.specificDocuments?.join(', ') || 'None specified'}</p>
              <p>Include News: {context.includeNews ? 'Yes' : 'No'}</p>
              <p>Web Access: {context.includeWebAccess ? 'Yes' : 'No'}</p>
            </CardContent>
          </Card>
        )}

        <div className={`flex ${selectedCitation ? 'space-x-4' : ''} flex-grow`}>
          <Card className={`flex-grow flex flex-col ${selectedCitation ? 'w-1/2' : 'w-full'}`}>
            <ScrollArea className="flex-grow p-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex items-start mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start space-x-2 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-3 max-w-[70%]`}>
                    {message.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                    <div className="space-y-1">
                      <p className="text-sm leading-relaxed">
                        {message.content.split(/(\[[0-9]+\])/).map((part, i) => {
                          if (part.match(/\[[0-9]+\]/)) {
                            return (
                              <button
                                key={i}
                                className="text-blue-600 hover:underline"
                                onClick={() => handleCitationClick(part.slice(1, -1))}
                              >
                                {part}
                              </button>
                            )
                          }
                          return part
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
            
            <CardContent className="border-t p-4">
              <form 
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
                className="flex items-center space-x-2"
              >
                <Input 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message here..."
                />
                <Button type="submit">
                  <SendHorizontal className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {selectedCitation && (
            <Card className="w-1/2">
              <CardContent className="relative p-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 z-10"
                  onClick={closePDFViewer}
                >
                  <X className="h-4 w-4" />
                </Button>
                <PDFViewer
                  pdfUrl={mockPDFData[selectedCitation as keyof typeof mockPDFData]?.url}
                  highlights={mockPDFData[selectedCitation as keyof typeof mockPDFData]?.highlights}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

