'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  PlusCircle, 
  History, 
  TrendingUp, 
  Building2, 
  Star, 
  Clock,
  ChevronRight,
  MessageSquare, 
  BookOpen,
  Search,
  CalendarIcon,
  PlayCircle
} from 'lucide-react'
import { NewResearchModal } from "@/app/components/new-research-modal"
import { Input } from "@/components/ui/input"
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Enhanced mock data with more diverse examples
const mockChatData = {
  "1": {
    messages: [
      { role: 'user', content: "Can you analyze Apple's financial performance and growth prospects?" },
      { role: 'assistant', content: "Let's analyze Apple's recent performance..." }
    ],
    context: {
      companies: ['Apple'],
      specificDocuments: ['Apple Q3 2023 Earnings Report', 'Industry Analysis 2023'],
      includeNews: true,
      includeWebAccess: false,
      timestamp: '2023-12-27T10:30:00Z',
      type: 'Chat'
    }
  },
  "2": {
    messages: [
      { role: 'user', content: "Compare Tesla and BYD's market position in the EV industry" },
      { role: 'assistant', content: "Let's examine the competitive landscape..." }
    ],
    context: {
      companies: ['Tesla', 'BYD'],
      specificDocuments: ['EV Market Report 2023', 'Tesla Q3 Earnings'],
      includeNews: true,
      includeWebAccess: true,
      timestamp: '2023-12-26T15:45:00Z',
      type: 'Chat'
    }
  },
  "3": {
    messages: [
      { role: 'user', content: "Analyze the impact of AI on cloud providers: Microsoft Azure, AWS, and Google Cloud" },
      { role: 'assistant', content: "Let's evaluate the AI capabilities..." }
    ],
    context: {
      companies: ['Microsoft', 'Amazon', 'Google'],
      specificDocuments: ['Cloud Market Analysis 2023'],
      includeNews: true,
      includeWebAccess: true,
      timestamp: '2023-12-25T09:15:00Z',
      type: 'Chat'
    }
  },
  "4": {
    messages: [
      { role: 'user', content: "Research semiconductor industry supply chain resilience" },
      { role: 'assistant', content: "Let's examine the semiconductor supply chain..." }
    ],
    context: {
      companies: ['TSMC', 'Intel', 'Samsung'],
      specificDocuments: ['Semiconductor Industry Report'],
      includeNews: true,
      includeWebAccess: true,
      timestamp: '2023-12-24T14:20:00Z',
      type: 'Chat'
    }
  }
}

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date)
}

// Get icon for category
const getCategoryIcon = (type: 'Chat' | 'Playbook') => {
  switch (type) {
    case 'Chat':
      return <MessageSquare className="h-4 w-4 text-blue-500" />
    case 'Playbook':
      return <BookOpen className="h-4 w-4 text-emerald-500" />
    default:
      return <MessageSquare className="h-4 w-4 text-gray-500" />
  }
}

export default function HomePage() {
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'company' | 'date' | 'name'>('all')
  const [showTutorial, setShowTutorial] = useState(false)

  const filteredChats = Object.entries(mockChatData).filter(([_, chat]) => {
    const query = searchQuery.toLowerCase()
    
    switch (filterType) {
      case 'company':
        return chat.context.companies.some(company => 
          company.toLowerCase().includes(query)
        )
      case 'date':
        return formatDate(chat.context.timestamp).toLowerCase().includes(query)
      case 'name':
        return chat.messages[0].content.toLowerCase().includes(query)
      case 'all':
      default:
        return (
          chat.messages[0].content.toLowerCase().includes(query) ||
          chat.context.companies.some(company => 
            company.toLowerCase().includes(query)
          ) ||
          chat.context.specificDocuments.some(doc => 
            doc.toLowerCase().includes(query)
          ) ||
          formatDate(chat.context.timestamp).toLowerCase().includes(query)
        )
    }
  })

  const startNewChat = () => {
    const defaultContext = {
      companies: [],
      specificDocuments: [],
      includeNews: true,
      includeWebAccess: true
    }
    
    router.push(`/chat/new?context=${encodeURIComponent(JSON.stringify(defaultContext))}`)
  }

  const handleViewAllClick = () => {
    router.push('/chat/history')  // Redirect to chat history page
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto max-w-7xl px-8 py-12">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Quantly
              </h1>
              <p className="text-gray-500 text-lg">
                AI-powered investment research assistant
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowTutorial(true)}
                className="text-gray-600 gap-2"
              >
                <PlayCircle className="h-4 w-4" />
                See Tutorial
              </Button>
              <NewResearchModal />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-lg">
              <History className="h-6 w-6 text-gray-900" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Recent Research</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 w-[500px]">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Find research..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
              <Select
                value={filterType}
                onValueChange={(value: 'all' | 'company' | 'date' | 'name') => setFilterType(value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              variant="ghost" 
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={handleViewAllClick}
            >
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {filteredChats.map(([id, chat]) => (
            <Card 
              key={id}
              className="group hover:shadow-lg transition-all duration-200 border-0 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => router.push(`/chat/${id}`)}
                className="w-full text-left"
              >
                <div className="p-6 bg-white">
                  {/* Category and Date */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full
                                    ${chat.context.type === 'Chat'
                                      ? 'bg-blue-50 text-blue-700'
                                      : 'bg-emerald-50 text-emerald-700'
                                    }`}>
                      {getCategoryIcon(chat.context.type)}
                      <span className="text-sm font-medium">
                        {chat.context.type}
                      </span>
                    </div>
                    <time className="text-sm text-gray-500">
                      {formatDate(chat.context.timestamp)}
                    </time>
                  </div>

                  {/* Main Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 
                               group-hover:text-gray-700 transition-colors duration-200 
                               line-clamp-2">
                    {chat.messages[0].content}
                  </h3>

                  {/* Tags */}
                  <div className="space-y-3">
                    {/* Companies */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider min-w-[80px]">
                        Companies
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {chat.context.companies.map((company) => (
                          <span 
                            key={company}
                            className="text-sm bg-gray-100 text-gray-700 px-3 py-1 
                                     rounded-full border border-gray-200"
                          >
                            {company}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider min-w-[80px]">
                        Sources
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {chat.context.specificDocuments.map((doc) => (
                          <span 
                            key={doc}
                            className="text-sm bg-gray-50 text-gray-600 px-3 py-1 
                                     rounded-full border border-gray-200"
                          >
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 
                              flex justify-between items-center group-hover:bg-gray-100 
                              transition-colors duration-200">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {chat.context.includeNews ? '✓ Including News' : '✗ Excluding News'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {chat.context.includeWebAccess ? '✓ Web Access' : '✗ No Web Access'}
                    </span>
                  </div>
                  <span className="text-gray-900 text-sm font-medium group-hover:underline">
                    Continue Research →
                  </span>
                </div>
              </button>
            </Card>
          ))}

          {/* No Results State */}
          {filteredChats.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Search className="h-6 w-6 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No results found</h3>
              <p className="text-gray-500">
                {filterType === 'all' 
                  ? 'Try adjusting your search terms or browse all research'
                  : `No matches found when filtering by ${filterType}. Try a different filter or search term`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

