"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SendHorizontal,
  User,
  Bot,
  X,
  Wand2,
  FileText,
  Building2,
  Newspaper,
  Globe,
  ChevronRight,
  Plus,
  FileDown,
} from "lucide-react";
import { BackToStartButton } from "@/components/back-to-start-button";
import { PDFViewer } from "@/components/pdf-viewer";
import { ErrorBoundary } from "@/components/error-boundary";
import { LogViewer } from "@/components/log-viewer";
import { PromptImproverModal } from "@/app/components/prompt-improver-modal";
import { ContextWindow } from "@/app/components/context-window";
import { toast } from "@/components/ui/use-toast";

// Mock data for existing chats
const mockChatData: Record<
  string,
  {
    messages: Array<{
      role: "user" | "assistant";
      content: string;
      citations?: Array<{
        id: string;
        page: number;
        text: string;
        fileUrl: string;
      }>;
    }>;
    context: any;
  }
> = {
  "1": {
    messages: [
      {
        role: "user",
        content: "Can you analyze Apple's financial performance?",
      },
      {
        role: "assistant",
        content:
          "According to Apple's recent earnings report[1], the company showed strong performance in Q3 2023. Revenue exceeded expectations[2] with significant growth in Services.",
        citations: [
          {
            id: "1",
            page: 1,
            text: "Apple Q3 2023 Earnings Overview",
            fileUrl: "/earnings.pdf",
          },
          {
            id: "2",
            page: 3,
            text: "Revenue Analysis",
            fileUrl: "/earnings.pdf",
          },
        ],
      },
    ],
    context: {
      companies: ["Apple"],
      specificDocuments: ["Apple Q3 2023 Earnings Report"],
      includeNews: true,
      includeWebAccess: false,
    },
  },
};

// Mock PDF data
const mockPDFData = {
  "1": {
    url: "/earnings.pdf",
    highlights: [{ page: 1, rect: { x1: 50, y1: 100, x2: 400, y2: 150 } }],
  },
  "2": {
    url: "/earnings.pdf",
    highlights: [{ page: 3, rect: { x1: 50, y1: 100, x2: 400, y2: 150 } }],
  },
};

const generateFollowUpQuestions = (message: string) => {
  // This will be replaced with actual AI-generated questions
  // For now, using mock questions based on context
  return [
    "Can you provide more detailed financial metrics?",
    "How does this compare to industry competitors?",
    "What are the key risk factors to consider?",
    "What's the growth potential in the next 5 years?",
    "How might market trends affect this analysis?",
    "What regulatory factors should we consider?",
  ];
};

export default function ChatPage({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState<
    Array<{
      role: "user" | "assistant";
      content: string;
      citations?: Array<{
        id: string;
        page: number;
        text: string;
        fileUrl: string;
      }>;
    }>
  >([]);
  const [input, setInput] = useState("");
  const [selectedCitation, setSelectedCitation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [context, setContext] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPromptImprover, setShowPromptImprover] = useState(false);
  const [isContextExpanded, setIsContextExpanded] = useState(false);
  const [showAddContext, setShowAddContext] = useState(false);
  const [chatTitle, setChatTitle] = useState<string>("");
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        console.log("Loading chat data for ID:", params.id); // Debug log

        if (params.id === "new") {
          const contextParam = searchParams.get("context");
          console.log("Context param:", contextParam); // Debug log

          if (contextParam) {
            const parsedContext = JSON.parse(decodeURIComponent(contextParam));
            setContext(parsedContext);
          } else {
            console.log("No context parameter found"); // Debug log
          }
        } else {
          const chatData = mockChatData[params.id];
          console.log("Found chat data:", chatData); // Debug log

          if (chatData) {
            setMessages(chatData.messages);
            setContext(chatData.context);
          } else {
            setError(
              "Chat not found. Please select a different chat or start a new one.",
            );
          }
        }
      } catch (error) {
        console.error("Error loading chat:", error);
        setError("Failed to load chat data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params.id, searchParams]);

  useEffect(() => {
    if (params.id === "new") {
      setChatTitle("New Research");
    } else {
      // Get title from first message of chat
      const chat = mockChatData[params.id];
      if (chat) {
        setChatTitle(chat.messages[0].content);
      }
    }
  }, [params.id]);

  const handleSend = useCallback(() => {
    if (input.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: input },
      ]);
      setInput("");

      // Mock AI response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "assistant",
            content:
              "I'm sorry, but as an AI language model, I don't have real-time data or the ability to perform actual analysis. In a real application, this is where the AI would provide a response based on the user's input and the given context.",
          },
        ]);
      }, 1000);
    }
  }, [input]);

  const handleCitationClick = useCallback(
    (citation: { id: string; page: number; text: string; fileUrl: string }) => {
      setSelectedCitation(citation.id);
    },
    [],
  );

  const closePDFViewer = useCallback(() => {
    setSelectedCitation(null);
  }, []);

  const handleErrorDismiss = useCallback(() => {
    setError(null);
  }, []);

  const handleContextAdd = (newContextData: any) => {
    setContext({
      ...context,
      companies: [
        ...(context?.companies || []),
        ...(newContextData.companies || []),
      ],
      specificDocuments: [
        ...(context?.specificDocuments || []),
        ...(newContextData.specificDocuments || []),
      ],
      includeNews: newContextData.includeNews,
      includeWebAccess: newContextData.includeWebAccess,
    });
    setShowAddContext(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 flex flex-col min-h-screen">
        <div className="mb-12">
          <BackToStartButton />
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            {params.id === "new" ? "New Research" : chatTitle}
          </h1>
          <Button
            size="lg"
            className="bg-gray-900 hover:bg-gray-800 text-white shadow-md hover:shadow-lg
                       transition-all duration-200 gap-2 h-11"
            onClick={() => {
              toast({
                title: "Coming Soon!",
                description: "Report generation feature is under development.",
                duration: 3000,
              });
            }}
          >
            <FileDown className="h-5 w-5" />
            Convert to Report
          </Button>
        </div>

        {error && (
          <div
            className="bg-destructive/15 text-destructive px-4 py-3 rounded mb-4 flex justify-between items-center"
            role="alert"
          >
            <span>{error}</span>
            <Button variant="ghost" size="icon" onClick={handleErrorDismiss}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {context && (
          <Card className="mb-4 border-gray-200">
            <div className="flex items-center justify-between p-4">
              <button
                onClick={() => setIsContextExpanded(!isContextExpanded)}
                className="flex-1 flex items-center justify-between hover:bg-gray-50/50 rounded-md p-2"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-gray-100 p-1.5 rounded-md">
                    <FileText className="h-4 w-4 text-gray-700" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-gray-900">
                      Research Context
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>•</span>
                      <span>{context.companies?.length || 0} Companies</span>
                      <span>•</span>
                      <span>
                        {context.specificDocuments?.length || 0} Documents
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight
                  className={`h-5 w-5 text-gray-400 transition-transform duration-200
                                      ${isContextExpanded ? "rotate-90" : ""}`}
                />
              </button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddContext(true)}
                className="ml-4 gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Context
              </Button>
            </div>

            {isContextExpanded && (
              <CardContent className="border-t pt-4">
                <div className="grid grid-cols-2 gap-3">
                  {/* Companies */}
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-medium text-gray-700">
                      Companies
                    </h3>
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
                        <span className="text-xs text-gray-500">
                          None specified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-medium text-gray-700">
                      Documents
                    </h3>
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
                        <span className="text-xs text-gray-500">
                          None specified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Additional Context */}
                  <div className="col-span-2 flex gap-3 mt-1.5">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`p-1 rounded-md ${
                          context.includeNews
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        <Newspaper className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs text-gray-700">
                        News:{" "}
                        <span className="font-medium">
                          {context.includeNews ? "Yes" : "No"}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div
                        className={`p-1 rounded-md ${
                          context.includeWebAccess
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        <Globe className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs text-gray-700">
                        Web:{" "}
                        <span className="font-medium">
                          {context.includeWebAccess ? "Yes" : "No"}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}

            <ContextWindow
              isOpen={showAddContext}
              onClose={() => setShowAddContext(false)}
              onComplete={handleContextAdd}
            />
          </Card>
        )}

        <div
          className={`flex ${selectedCitation ? "space-x-4" : ""} flex-grow`}
        >
          <Card
            className={`flex-grow flex flex-col ${
              selectedCitation ? "w-1/2" : "w-full"
            }`}
          >
            <div className="flex-grow flex flex-col overflow-hidden">
              {/* Messages ScrollArea */}
              <ScrollArea className="flex-grow p-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-4 p-4 ${
                      message.role === "assistant"
                        ? "bg-gray-50 border-y border-gray-100"
                        : ""
                    }`}
                  >
                    <div
                      className={`flex items-start space-x-2 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      } rounded-lg p-3 max-w-[70%]`}
                    >
                      {message.role === "user" ? (
                        <User className="h-5 w-5" />
                      ) : (
                        <Bot className="h-5 w-5" />
                      )}
                      <div className="space-y-1">
                        <p className="text-sm leading-relaxed">
                          {message.content
                            .split(/(\[[0-9]+\])/)
                            .map((part, i) => {
                              if (part.match(/\[[0-9]+\]/)) {
                                const citationId = part.slice(1, -1);
                                const citation = message.citations?.find(
                                  (c) => c.id === citationId,
                                );
                                return citation ? (
                                  <button
                                    key={i}
                                    className="text-blue-600 hover:underline"
                                    onClick={() =>
                                      handleCitationClick(citation)
                                    }
                                  >
                                    {part}
                                  </button>
                                ) : (
                                  part
                                );
                              }
                              return part;
                            })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>

              {/* Follow-up Questions Section */}
              {messages.length > 0 &&
                messages[messages.length - 1].role === "assistant" && (
                  <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-3">
                    <div className="grid grid-cols-3 gap-2">
                      {generateFollowUpQuestions(
                        messages[messages.length - 1].content,
                      ).map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="bg-white hover:bg-gray-50 text-xs text-gray-700 
                                 border border-gray-200 shadow-sm h-7 w-full"
                          onClick={() => {
                            if (inputRef.current) {
                              inputRef.current.focus();
                            }
                            if (inputRef.current) {
                              inputRef.current.focus();
                            }
                          }}
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

              {/* Input Section */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
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
                  <Button onClick={handleSend} disabled={!input.trim()}>
                    <SendHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
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
                  fileUrl={
                    mockPDFData[selectedCitation as keyof typeof mockPDFData]
                      ?.url
                  }
                  initialPage={1}
                  highlights={
                    mockPDFData[selectedCitation as keyof typeof mockPDFData]
                      ?.highlights
                  }
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
            setInput(improvedPrompt);
            setShowPromptImprover(false);
          }}
        />
      </div>
    </div>
  );
}
