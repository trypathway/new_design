import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from 'lucide-react'
import { NewResearchModal } from './components/new-research-modal'

// Mock data for chat history
const chatHistory = [
  { id: "1", title: "Apple Financial Analysis", date: "2023-06-01" },
  { id: "2", title: "Tesla Market Position", date: "2023-06-03" },
  { id: "3", title: "Microsoft Azure Growth", date: "2023-06-05" },
]

export default function Dashboard() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Investment Research Assistant</h1>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Your Research History</h2>
        <NewResearchModal />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chatHistory.map((chat) => (
          <Link href={`/chat/${chat.id}`} key={chat.id}>
            <Card className="cursor-pointer hover:bg-gray-100 transition-colors">
              <CardHeader>
                <CardTitle>{chat.title}</CardTitle>
                <CardDescription>Created on {new Date(chat.date).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Continue Chat</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

