'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SendHorizontal, User, Bot, X, Wand2, FileText, Building2, Newspaper, Globe } from 'lucide-react'
import { BackToStartButton } from '@/components/back-to-start-button'
import { PDFViewer } from '@/components/pdf-viewer'
import { ErrorBoundary } from '@/components/error-boundary'
import { LogViewer } from '@/components/log-viewer'
import { PromptImproverModal } from '@/components/prompt-improver-modal'

// Mock data for existing chats
const mockChatData: Record<string, { messages: Array<{ 
  role: 'user' | 'assistant', 
  content: string,
  citations?: Array<{
    id: string,
    page: number,
    text: string,
    fileUrl: string
  }>
}>, context: any }> = {
  "1": {
    messages: [
      { 
        role: 'user', 
        content: "Can you analyze Apple's financial performance?" 
      },
      { 
        role: 'assistant', 
        content: "According to Apple's recent earnings report[1], the company showed strong performance in Q3 2023. Revenue exceeded expectations[2] with significant growth in Services.",
        citations: [
          {
            id: "1",
            page: 1,
            text: "Apple Q3 2023 Earnings Overview",
            fileUrl: "/earnings.pdf"
          },
          {
            id: "2",
            page: 3,
            text: "Revenue Analysis",
            fileUrl: "/earnings.pdf"
          }
        ]
      }
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
  "1": {
    url: "/earnings.pdf",
    highlights: [
      { page: 1, rect: { x1: 50, y1: 100, x2: 400, y2: 150 } }
    ]
  },
  "2": {
    url: "/earnings.pdf",
    highlights: [
      { page: 3, rect: { x1: 50, y1: 100, x2: 400, y2: 150 } }
    ]
  }
}

export default function ChatPage({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState<Array<{
    role: 'user' | 'assistant',
    content: string,
    citations?: Array<{
      id: string,
      page: number,
      text: string,
      fileUrl: string
    }>
  }>>([])
  const [input, setInput] = useState('')
  const [selectedCitation, setSelectedCitation] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [context, setContext] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showPromptImprover, setShowPromptImprover] = useState(false)
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

  const handleCitationClick = useCallback((citation: { id: string, page: number, text: string, fileUrl: string }) => {
    setSelectedCitation(citation.id)
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
          <Card className="mb-4 border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-gray-100 p-1.5 rounded-md">
                  <FileText className="h-4 w-4 text-gray-700" />
                </div>
                <h2 className="text-base font-semibold text-gray-900">Research Context</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Companies */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-medium text-gray-700">Companies</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {context.companies?.length > 0 ? (
                      context.companies.map((company: string) => (
                        <span 
                          key={company}
                          className="inline-flex items-center px-2 py-0.5 rounded-full 
                                   text-xs bg-gray-100 text-gray-700 border border-gray-200"
                        >
                          <Building2 className="h-3 w-3 mr-1" />
                          {company}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500">None specified</span>
                    )}
                  </div>
                </div>

                {/* Documents */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-medium text-gray-700">Documents</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {context.specificDocuments?.length > 0 ? (
                      context.specificDocuments.map((doc: string) => (
                        <span 
                          key={doc}
                          className="inline-flex items-center px-2 py-0.5 rounded-full 
                                   text-xs bg-gray-100 text-gray-700 border border-gray-200"
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          {doc}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500">None specified</span>
                    )}
                  </div>
                </div>

                {/* Additional Context */}
                <div className="col-span-2 flex gap-3 mt-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className={`p-1 rounded-md ${context.includeNews ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}>
                      <Newspaper className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs text-gray-700">
                      News: <span className="font-medium">{context.includeNews ? 'Yes' : 'No'}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <div className={`p-1 rounded-md ${context.includeWebAccess ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}>
                      <Globe className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs text-gray-700">
                      Web: <span className="font-medium">{context.includeWebAccess ? 'Yes' : 'No'}</span>
                    </span>
                  </div>
                </div>
              </div>
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
                            const citationId = part.slice(1, -1);
                            const citation = message.citations?.find(c => c.id === citationId);
                            return citation ? (
                              <button
                                key={i}
                                className="text-blue-600 hover:underline"
                                onClick={() => handleCitationClick(citation)}
                              >
                                {part}
                              </button>
                            ) : part;
                          }
                          return part;
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
                <div className="flex items-center gap-2 w-full">
                  <Input
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={() => input.trim() && setShowPromptImprover(true)}
                    className="gap-2 px-3 hover:bg-gray-50 border-gray-200"
                    disabled={!input.trim()}
                  >
                    <Wand2 className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Improve</span>
                  </Button>
                  <Button 
                    onClick={handleSend}
                    disabled={!input.trim()}
                  >
                    <SendHorizontal className="h-4 w-4" />
                  </Button>
                </div>
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
                  fileUrl={mockPDFData[selectedCitation as keyof typeof mockPDFData]?.url}
                  initialPage={1}
                  highlights={mockPDFData[selectedCitation as keyof typeof mockPDFData]?.highlights}
                />
              </CardContent>
            </Card>
          )}
        </div>

        <PromptImproverModal
          isOpen={showPromptImprover}
          onClose={() => setShowPromptImprover(false)}
          originalPrompt={input}
          onAccept={(improvedPrompt) => {
            setInput(improvedPrompt)
            setShowPromptImprover(false)
          }}
        />
      </div>
    </div>
  )
}

