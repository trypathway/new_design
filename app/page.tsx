'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function HomePage() {
  const router = useRouter()

  const startNewChat = () => {
    const defaultContext = {
      companies: [],
      specificDocuments: [],
      includeNews: true,
      includeWebAccess: true
    }
    
    router.push(`/chat/new?context=${encodeURIComponent(JSON.stringify(defaultContext))}`)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Investment Research Platform</h1>
      
      <div className="grid gap-4">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Start New Research</h2>
          <Button onClick={startNewChat}>
            Start New Chat
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Chats</h2>
          <div className="space-y-2">
            {Object.entries(mockChatData).map(([id, chat]) => (
              <Button 
                key={id}
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push(`/chat/${id}`)}
              >
                Chat #{id}: {chat.messages[0].content.substring(0, 50)}...
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

// Mock data (move this to a separate file later)
const mockChatData = {
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

