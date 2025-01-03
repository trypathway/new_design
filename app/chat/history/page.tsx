'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ChevronLeft,
  History,
  MessageSquare,
  BookOpen,
  ArrowLeft,
  Calendar,
  Building2,
  Search
} from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useState } from 'react'

// Use the same mock data structure as homepage
const chatHistory = {
  "1": {
    messages: [
      { role: 'user', content: "Can you analyze Apple's financial performance and growth prospects?" }
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
      { role: 'user', content: "Compare Tesla and BYD's market position in the global EV market" }
    ],
    context: {
      companies: ['Tesla', 'BYD'],
      specificDocuments: ['EV Market Report 2023', 'Global EV Sales Data'],
      includeNews: true,
      includeWebAccess: true,
      timestamp: '2023-12-26T15:45:00Z',
      type: 'Playbook'
    }
  },
  "3": {
    messages: [
      { role: 'user', content: "Analyze the impact of AI on cloud providers: Microsoft Azure, AWS, and Google Cloud" }
    ],
    context: {
      companies: ['Microsoft', 'Amazon', 'Google'],
      specificDocuments: ['Cloud Market Analysis 2023', 'AI in Cloud Computing Report'],
      includeNews: true,
      includeWebAccess: true,
      timestamp: '2023-12-25T09:15:00Z',
      type: 'Chat'
    }
  },
  "4": {
    messages: [
      { role: 'user', content: "Research semiconductor industry supply chain resilience post-COVID" }
    ],
    context: {
      companies: ['TSMC', 'Intel', 'Samsung'],
      specificDocuments: ['Semiconductor Industry Report', 'Supply Chain Analysis 2023'],
      includeNews: true,
      includeWebAccess: true,
      timestamp: '2023-12-24T14:20:00Z',
      type: 'Playbook'
    }
  },
  "5": {
    messages: [
      { role: 'user', content: "Evaluate the impact of rising interest rates on major US banks" }
    ],
    context: {
      companies: ['JPMorgan Chase', 'Bank of America', 'Wells Fargo'],
      specificDocuments: ['Banking Sector Analysis', 'Federal Reserve Reports'],
      includeNews: true,
      includeWebAccess: false,
      timestamp: '2023-12-23T11:30:00Z',
      type: 'Chat'
    }
  },
  "6": {
    messages: [
      { role: 'user', content: "Compare renewable energy strategies of major oil companies" }
    ],
    context: {
      companies: ['Shell', 'BP', 'ExxonMobil'],
      specificDocuments: ['Energy Transition Report', 'Climate Strategy Analysis'],
      includeNews: true,
      includeWebAccess: true,
      timestamp: '2023-12-22T16:45:00Z',
      type: 'Playbook'
    }
  }
}

// Reuse the helper functions from homepage
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date)
}

const getCategoryIcon = (type: string) => {
  switch (type) {
    case 'Chat':
      return <MessageSquare className="h-4 w-4 text-blue-500" />
    case 'Playbook':
      return <BookOpen className="h-4 w-4 text-emerald-500" />
    default:
      return <MessageSquare className="h-4 w-4 text-gray-500" />
  }
}

export default function ChatHistoryPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined
  })

  const filteredChats = Object.entries(chatHistory).filter(([_, chat]) => {
    const query = searchQuery.toLowerCase()
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
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto max-w-7xl px-8 py-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/')}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <History className="h-6 w-6" />
                  Research History
                </h1>
              </div>
            </div>

            {/* Add Filters */}
            <div className="flex items-center gap-4">
              {/* Date Range Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-[250px] justify-start text-left font-normal ${
                      !dateRange.from && !dateRange.to && "text-muted-foreground"
                    }`}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "MMM d, yyyy")} -{" "}
                          {format(dateRange.to, "MMM d, yyyy")}
                        </>
                      ) : (
                        format(dateRange.from, "MMM d, yyyy")
                      )
                    ) : (
                      "Select date range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4" align="start">
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <select
                        value={dateRange.from?.getFullYear() || new Date().getFullYear()}
                        onChange={(e) => {
                          const year = parseInt(e.target.value)
                          setDateRange(prev => ({
                            from: prev.from ? new Date(year, prev.from.getMonth(), prev.from.getDate()) : undefined,
                            to: prev.to ? new Date(year, prev.to.getMonth(), prev.to.getDate()) : undefined
                          }))
                        }}
                        className="flex-1 p-2 text-sm border rounded-md"
                      >
                        {Array.from({ length: 5 }, (_, i) => 2020 + i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={dateRange}
                      onSelect={(range)=>{
                        setDateRange({
                          from: range?.from,
                          to: range?.to
                        })
                      }}
                      numberOfMonths={2}
                      className="rounded-md border"
                    />
                  </div>
                </PopoverContent>
              </Popover>

              {/* Company Filter */}
              <div className="relative w-[200px]">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search company..."
                  value={selectedCompany || ""}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Find research..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-8 py-12">
        <div className="grid grid-cols-1 gap-6">
          {filteredChats.map(([id, chat]) => (
            <Card 
              key={id}
              className={`group hover:shadow-lg transition-all duration-200 border-0 shadow-sm overflow-hidden cursor-pointer
                          ${chat.context.type === 'Chat' 
                            ? 'hover:border-l-4 hover:border-l-blue-500' 
                            : 'hover:border-l-4 hover:border-l-emerald-500'}`}
              onClick={() => router.push(`/chat/${id}`)}
            >
              <div className={`p-6 bg-white ${
                chat.context.type === 'Chat'
                  ? 'border-l-2 border-l-blue-100'
                  : 'border-l-2 border-l-emerald-100'
              }`}>
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
                             group-hover:text-gray-700 transition-colors duration-200">
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
              <div className={`px-6 py-4 border-t border-gray-100 
                              flex justify-between items-center transition-colors duration-200
                              ${chat.context.type === 'Chat'
                                ? 'bg-blue-50/30 group-hover:bg-blue-50/50'
                                : 'bg-emerald-50/30 group-hover:bg-emerald-50/50'
                              }`}>
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
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 