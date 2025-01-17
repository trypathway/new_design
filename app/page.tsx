"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  PlayCircle,
  Calendar,
  Settings,
} from "lucide-react";
import { NewResearchModal } from "@/app/components/new-research-modal";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { mock } from "node:test";
import { FormattedDate } from "./components/formatted-date";

// Enhanced mock data with more diverse examples
const mockChatData = {
  "1": {
    messages: [
      {
        role: "user",
        content:
          "Can you analyze Apple's financial performance and growth prospects?",
      },
      {
        role: "assistant",
        content: "Let's analyze Apple's recent performance...",
      },
    ],
    context: {
      companies: ["Apple"],
      specificDocuments: [
        "Apple Q3 2023 Earnings Report",
        "Industry Analysis 2023",
      ],
      includeNews: true,
      includeWebAccess: false,
      timestamp: "2023-12-27T10:30:00Z",
      type: "Chat",
    },
  },
  "2": {
    messages: [
      {
        role: "user",
        content: "Compare Tesla and BYD's market position in the EV industry",
      },
      {
        role: "assistant",
        content: "Let's examine the competitive landscape...",
      },
    ],
    context: {
      companies: ["Tesla", "BYD"],
      specificDocuments: ["EV Market Report 2023", "Tesla Q3 Earnings"],
      includeNews: true,
      includeWebAccess: true,
      timestamp: "2023-12-26T15:45:00Z",
      type: "Chat",
    },
  },
  "3": {
    messages: [
      {
        role: "user",
        content:
          "Analyze the impact of AI on cloud providers: Microsoft Azure, AWS, and Google Cloud",
      },
      { role: "assistant", content: "Let's evaluate the AI capabilities..." },
    ],
    context: {
      companies: ["Microsoft", "Amazon", "Google"],
      specificDocuments: ["Cloud Market Analysis 2023"],
      includeNews: true,
      includeWebAccess: true,
      timestamp: "2023-12-25T09:15:00Z",
      type: "Chat",
    },
  },
  "4": {
    messages: [
      {
        role: "user",
        content: "Research semiconductor industry supply chain resilience",
      },
      {
        role: "assistant",
        content: "Let's examine the semiconductor supply chain...",
      },
    ],
    context: {
      companies: ["TSMC", "Intel", "Samsung"],
      specificDocuments: ["Semiconductor Industry Report"],
      includeNews: true,
      includeWebAccess: true,
      timestamp: "2023-12-24T14:20:00Z",
      type: "Chat",
    },
  },
};

// Get icon for category
const getCategoryIcon = (type: string) => {
  switch (type) {
    case "Chat":
      return <MessageSquare className="h-4 w-4 text-blue-500" />;
    case "Playbook":
      return <BookOpen className="h-4 w-4 text-emerald-500" />;
    default:
      return <MessageSquare className="h-4 w-4 text-gray-500" />;
  }
};

// Mock companies for autocomplete
const companies = [
  "Apple",
  "Microsoft",
  "Google",
  "Amazon",
  "Tesla",
  "NVIDIA",
  // Add more...
];

export default function HomePage() {
  const router = useRouter();

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

  const filteredChats = Object.entries(mockChatData).filter(([_, chat]) => {
    const query = searchQuery.toLowerCase();

    // Format date for search without relying on formatDate function
    const date = new Date(chat.context.timestamp);
    const dateStr = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
      .format(date)
      .toLowerCase();

    return (
      chat.messages[0].content.toLowerCase().includes(query) ||
      chat.context.companies.some((company) =>
        company.toLowerCase().includes(query),
      ) ||
      chat.context.specificDocuments.some((doc) =>
        doc.toLowerCase().includes(query),
      ) ||
      dateStr.includes(query)
    );
  });

  const startNewChat = () => {
    const defaultContext = {
      companies: [],
      specificDocuments: [],
      includeNews: true,
      includeWebAccess: true,
    };

    router.push(
      `/chat/new?context=${encodeURIComponent(JSON.stringify(defaultContext))}`,
    );
  };

  const handleViewAllClick = () => {
    router.push("/chat/history"); // Redirect to chat history page
  };

  return (
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
        {/* Header and Filters */}
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

          {/* Filters */}
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
                      value={
                        dateRange.from?.getFullYear() ||
                        new Date().getFullYear()
                      }
                      onChange={(e) => {
                        const year = parseInt(e.target.value);
                        setDateRange((prev) => ({
                          from: prev.from
                            ? new Date(
                                year,
                                prev.from.getMonth(),
                                prev.from.getDate(),
                              )
                            : undefined,
                          to: prev.to
                            ? new Date(
                                year,
                                prev.to.getMonth(),
                                prev.to.getDate(),
                              )
                            : undefined,
                        }));
                      }}
                      className="flex-1 p-2 text-sm border rounded-md"
                    >
                      {Array.from({ length: 5 }, (_, i) => 2020 + i).map(
                        (year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={(range) => {
                      setDateRange({
                        from: range?.from,
                        to: range?.to,
                      });
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

            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={handleViewAllClick}
            >
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Research Results */}
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
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full
                                    ${
                                      chat.context.type === "Chat"
                                        ? "bg-blue-50 text-blue-700"
                                        : "bg-emerald-50 text-emerald-700"
                                    }`}
                    >
                      {getCategoryIcon(chat.context.type)}
                      <span className="text-sm font-medium">
                        {chat.context.type}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      <FormattedDate dateString={chat.context.timestamp} />
                    </div>
                  </div>

                  {/* Main Content */}
                  <h3
                    className="text-xl font-semibold text-gray-900 mb-4 
                               group-hover:text-gray-700 transition-colors duration-200 
                               line-clamp-2"
                  >
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
                <div
                  className="px-6 py-4 bg-gray-50 border-t border-gray-100 
                              flex justify-between items-center group-hover:bg-gray-100 
                              transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {chat.context.includeNews
                        ? "✓ Including News"
                        : "✗ Excluding News"}
                    </span>
                    <span className="text-sm text-gray-500">
                      {chat.context.includeWebAccess
                        ? "✓ Web Access"
                        : "✗ No Web Access"}
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
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No results found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search terms or browse all research
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
