"use client";

import { Card } from "@/components/ui/card";
import { MessageSquare, BookOpen } from "lucide-react";
import { Chat } from "@/app/types/chat";

interface ChatListProps {
  chats: Chat[];
  isLoading?: boolean;
  onChatClick: (chatId: string) => void;
}

export function ChatList({ chats, isLoading, onChatClick }: ChatListProps) {
  console.log("ChatList render:", { chats, isLoading });

  const getCategoryIcon = (mode: string) => {
    switch (mode) {
      case "CompanyDocsV2":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "AnalysisV2":
        return <BookOpen className="h-4 w-4 text-emerald-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {chats.map((chat) => (
        <Card
          key={chat.id}
          className="group hover:shadow-lg transition-all duration-200 border-0 shadow-sm overflow-hidden"
        >
          <button
            onClick={() => onChatClick(chat.id)}
            className="w-full text-left"
          >
            <div className="p-6 bg-white">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full
                    ${
                      chat.mode === "CompanyDocsV2"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                >
                  {getCategoryIcon(chat.mode)}
                  <span className="text-sm font-medium">{chat.mode}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(chat.startedAt).toLocaleDateString()}
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-4 line-clamp-2">
                {chat.input}
              </h3>

              {chat.suggestedQuestions &&
                chat.suggestedQuestions.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Suggested Questions
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {chat.suggestedQuestions.map((question, index) => (
                        <span
                          key={index}
                          className="text-sm bg-gray-50 text-gray-600 px-3 py-1 rounded-full border border-gray-200"
                        >
                          {question}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  {chat.settings?.NewsProvider || "No News Provider"}
                </span>
                <span className="text-sm text-gray-500">
                  {chat.settings?.MlModel || "Default Model"}
                </span>
              </div>
              <span className="text-gray-900 text-sm font-medium group-hover:underline">
                Continue Research →
              </span>
            </div>
          </button>
        </Card>
      ))}
    </div>
  );
}
