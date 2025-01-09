"use client";

import { useEffect, useState } from "react";
import { useChats } from "./hooks/useChats";
import { ChatList } from "./components/chat-list";
import { ChatFilters } from "./components/chat-filters";
import { Button } from "@/components/ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import { ProtectedRoute } from "./components/protected-route";
import { useRouter } from "next/navigation";
import { History, PlayCircle, BookOpen, Settings } from "lucide-react";
import { NewResearchModal } from "@/app/components/new-research-modal";

export default function Home() {
  const router = useRouter();
  const { chats, isLoading, getChats } = useChats();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    getChats();
  }, []);

  const filteredChats = chats.filter((chat) => {
    // Filter by search query
    if (
      searchQuery &&
      !chat.input.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter by company
    if (selectedCompany && !chat.settings?.company?.includes(selectedCompany)) {
      return false;
    }

    // Filter by date range
    if (dateRange.from || dateRange.to) {
      const chatDate = new Date(chat.startedAt);
      if (dateRange.from && chatDate < dateRange.from) {
        return false;
      }
      if (dateRange.to && chatDate > dateRange.to) {
        return false;
      }
    }

    return true;
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-100">
          <div className="container mx-auto max-w-7xl px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quantly</h1>
                <p className="text-gray-500 text-base">
                  AI-powered investment research assistant
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTutorial(true)}
                  className="text-gray-600 gap-1.5 text-sm h-8"
                >
                  <PlayCircle className="h-3.5 w-3.5" />
                  See Tutorial
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/playbooks")}
                  className="gap-1.5 text-sm h-8"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Playbook Manager
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/settings")}
                  className="text-gray-600 gap-1.5 text-sm h-8"
                >
                  <Settings className="h-3.5 w-3.5" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto max-w-7xl px-8 py-12">
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <History className="h-6 w-6 text-gray-900" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Recent Research
                </h2>
              </div>

              <NewResearchModal
                buttonProps={{
                  size: "lg",
                  className:
                    "bg-gray-900 hover:bg-gray-800 text-white px-8 h-12 shadow-md hover:shadow-lg transition-all duration-200",
                }}
              />
            </div>

            <ChatFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCompany={selectedCompany}
              onCompanyChange={setSelectedCompany}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
            <ChatList
              chats={filteredChats}
              isLoading={isLoading}
              onChatClick={(chatId) => router.push(`/chat/${chatId}`)}
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
