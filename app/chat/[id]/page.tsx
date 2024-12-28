'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SendHorizontal, User, Bot, X, Wand2, FileText, Building2, Newspaper, Globe, ChevronDown, ChevronUp } from 'lucide-react'
import { BackToStartButton } from '@/components/back-to-start-button'
import { PDFViewer } from '@/components/pdf-viewer'
import { ErrorBoundary } from '@/components/error-boundary'
import { LogViewer } from '@/components/log-viewer'
import { PromptImproverModal } from '@/components/prompt-improver-modal'

// Mock data for existing chats
const mockChatData: Record<string, { messages: Array<{ role: 'user' | 'assistant', content: string }>, context: any }> = {
  "1": {
    messages: [
      { 
        role: 'user', 
        content: "Can you analyze Apple's financial performance?" 
      },
      { 
        role: 'assistant', 
        content: `Based on Apple's recent financial performance, there are several key points to highlight:

1. Revenue Growth: Apple reported a revenue of $81.8 billion in Q3 2023 [1], showing a slight decline from the previous year's $83.0 billion. However, this was better than market expectations.

2. Product Performance: iPhone sales remained strong at $39.67 billion [1], though slightly down from $40.67 billion year-over-year. The Services segment continues to show impressive growth, reaching $21.21 billion [2].

3. Profit Margins: The company maintained strong profit margins, with a gross margin of 44.5% [2], indicating efficient cost management and premium pricing power.

4. Market Position: According to the latest earnings call transcript [3], Apple continues to see strong customer satisfaction and loyalty, with particularly strong performance in emerging markets.

5. Future Outlook: The company's guidance suggests continued strength in Services and potential growth opportunities in AI and augmented reality [3].

[1] Apple Q3 2023 Earnings Report
[2] Apple Q3 2023 10-Q Filing
[3] Apple Q3 2023 Earnings Call Transcript` 
      }
    ],
    context: {
      companies: ['Apple'],
      specificDocuments: ['Apple Q3 2023 Earnings Report', 'Apple Q3 2023 10-Q Filing', 'Apple Q3 2023 Earnings Call Transcript'],
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
  const [showPromptImprover, setShowPromptImprover] = useState(false)
  const [isContextCollapsed, setIsContextCollapsed] = useState(false)
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

      // Mock AI response with citations
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { 
          role: 'assistant', 
          content: `Based on the available data, here's the analysis:

1. Financial Performance: The company shows strong fundamentals with consistent revenue growth [1], maintaining a healthy profit margin above industry averages.

2. Market Position: Recent market share data indicates a dominant position in key segments [2], particularly in premium products and services.

3. Future Outlook: According to recent earnings calls [3], management expects continued growth driven by:
   - Product innovation pipeline
   - Services expansion
   - Market penetration in emerging economies

[1] Q3 2023 Earnings Report
[2] Market Analysis 2023
[3] Q3 2023 Earnings Call Transcript`
        }])
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
          Quantly {params.id === 'new' ? '(New Research)' : `Research #${params.id}`}
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
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-gray-100 p-1.5 rounded-md">
                    <FileText className="h-4 w-4 text-gray-700" />
                  </div>
                  <h2 className="text-base font-semibold text-gray-900">Research Context</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsContextCollapsed(!isContextCollapsed)}
                  className="text-gray-500 hover:text-gray-900"
                >
                  {isContextCollapsed ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <div
                className={`overflow-hidden transition-all duration-200 ease-in-out ${
                  isContextCollapsed ? 'max-h-0' : 'max-h-[500px]'
                }`}
              >
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
                  pdfUrl={mockPDFData[selectedCitation as keyof typeof mockPDFData]?.url}
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

