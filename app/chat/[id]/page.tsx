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
      { role: 'assistant', content: "Let's take a look at Apple's financial performance based on their recent quarterly report[1]. Apple has shown strong financial performance in the last fiscal quarter. Their revenue reached $81.8 billion, which is a 1% decrease year-over-year, but still exceeded market expectations[1].\n\nKey highlights include:\n\n1. iPhone sales: $39.67 billion, up 2.8% year-over-year[1]\n2. Services revenue: $21.21 billion, up 8.2% year-over-year[1]\n3. Mac sales: $6.84 billion, down 7.3% year-over-year[1]\n4. iPad sales: $5.79 billion, down 19.8% year-over-year[1]\n\nDespite challenges in the global economy, Apple has maintained strong profit margins and continues to generate significant cash flow[2]. Their ability to grow iPhone and Services revenue demonstrates the strength of their ecosystem and brand loyalty.\n\n[1] Apple Q3 2023 Earnings Report\n[2] Apple 10-Q Filing, Q3 2023" },
    ],
    context: {
      companies: ['Apple'],
      specificDocuments: ['Apple Q3 2023 Earnings Report', 'Apple 10-Q Filing, Q3 2023'],
      includeNews: true,
      includeWebAccess: false
    }
  },
  "2": {
    messages: [
      { role: 'user', content: "What's Tesla's current market position?" },
      { role: 'assistant', content: "Tesla's current market position is quite strong in the electric vehicle (EV) sector. Let's break down some key aspects..." },
    ],
    context: {
      companies: ['Tesla'],
      specificDocuments: ['Tesla Q2 2023 Update'],
      includeNews: true,
      includeWebAccess: true
    }
  },
  "3": {
    messages: [
      { role: 'user', content: "How has Microsoft's Azure grown recently?" },
      { role: 'assistant', content: "Microsoft's Azure has shown significant growth in recent years. Let's examine some key growth indicators..." },
    ],
    context: {
      companies: ['Microsoft'],
      specificDocuments: ['Microsoft FY23 Q4 Earnings Release'],
      includeNews: false,
      includeWebAccess: true
    }
  },
}

// Mock PDF data
const mockPDFData = {
  "Apple Q3 2023 Earnings Report": {
    url: "/placeholder.svg?height=1000&width=800",
    highlights: [
      { page: 1, rect: { x1: 50, y1: 100, x2: 400, y2: 150 } },
      { page: 2, rect: { x1: 100, y1: 200, x2: 450, y2: 250 } },
    ]
  },
  "Apple 10-Q Filing, Q3 2023": {
    url: "/placeholder.svg?height=1000&width=800",
    highlights: [
      { page: 5, rect: { x1: 75, y1: 300, x2: 425, y2: 350 } },
    ]
  }
}

export default function ChatPage({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([])
  const [input, setInput] = useState('')
  const [selectedCitation, setSelectedCitation] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [context, setContext] = useState<any>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const loadData = async () => {
      if (params.id === 'new') {
        // Parse context for new chat
        const contextParam = searchParams.get('context')
        if (contextParam) {
          try {
            const parsedContext = JSON.parse(decodeURIComponent(contextParam))
            setContext(parsedContext)
          } catch (error) {
            console.error('Error parsing context:', error)
            setError('Failed to parse context data. Please try again.')
            return
          }
        }
      } else {
        // Load existing chat data
        try {
          const chatData = mockChatData[params.id]
          if (chatData) {
            setMessages(chatData.messages)
            setContext(chatData.context)
          } else {
            console.warn(`No chat data found for id: ${params.id}`)
            setError('Chat not found. Please select a different chat or start a new one.')
          }
        } catch (error) {
          console.error(`Error loading chat data for id ${params.id}:`, error)
          setError('Failed to load chat data. Please try again.')
        }
      }
    }

    loadData()
  }, [searchParams, params.id])

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

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-6 h-screen flex flex-col relative">
        <BackToStartButton />
        <h1 className="text-3xl font-bold mb-6 mt-12">Research Chat {params.id === 'new' ? '(New)' : `#${params.id}`}</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center" role="alert">
            <div>
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
            <button onClick={handleErrorDismiss} className="text-red-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        {context && (
          <Card className="mb-4 p-4">
            <h2 className="text-xl font-semibold mb-2">Research Context</h2>
            <p>Companies: {context.companies?.join(', ') || 'None specified'}</p>
            <p>Specific Documents: {context.specificDocuments?.join(', ') || 'None specified'}</p>
            <p>Include News: {context.includeNews ? 'Yes' : 'No'}</p>
            <p>Web Access: {context.includeWebAccess ? 'Yes' : 'No'}</p>
          </Card>
        )}
        <div className={`flex ${selectedCitation ? 'space-x-4' : ''} flex-grow`}>
          <Card className={`flex-grow flex flex-col ${selectedCitation ? 'w-1/2' : 'w-full'}`}>
            <ScrollArea className="flex-grow p-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex items-start mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-center ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-lg p-3 max-w-[70%]`}>
                    {message.role === 'user' ? <User className="h-5 w-5 mr-2" /> : <Bot className="h-5 w-5 mr-2" />}
                    <p>
                      {message.content.split(/(\[[0-9]+\])/).map((part, i) => {
                        if (part.match(/\[[0-9]+\]/)) {
                          return (
                            <span
                              key={i}
                              className="text-blue-600 cursor-pointer hover:underline"
                              onClick={() => handleCitationClick(part.slice(1, -1))}
                            >
                              {part}
                            </span>
                          )
                        }
                        return part
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollArea>
            <CardContent className="border-t">
              <div className="flex items-center space-x-2">
                <Input 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message here..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button onClick={handleSend}>
                  <SendHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          {selectedCitation && (
            <Card className="w-1/2 flex flex-col">
              <CardContent className="flex-grow relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 z-10"
                  onClick={closePDFViewer}
                >
                  <X className="h-4 w-4" />
                </Button>
                <PDFViewer
                  pdfUrl={mockPDFData[selectedCitation as keyof typeof mockPDFData].url}
                  highlights={mockPDFData[selectedCitation as keyof typeof mockPDFData].highlights}
                />
              </CardContent>
            </Card>
          )}
        </div>
        <LogViewer />
      </div>
    </ErrorBoundary>
  )
}

