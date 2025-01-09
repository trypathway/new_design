"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Building2, Calendar, ChevronRight, Search } from "lucide-react";
import { format } from "date-fns";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface ChatFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCompany: string | null;
  onCompanyChange: (company: string | null) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  onViewAllClick?: () => void;
}

export function ChatFilters({
  searchQuery,
  onSearchChange,
  selectedCompany,
  onCompanyChange,
  dateRange,
  onDateRangeChange,
  onViewAllClick,
}: ChatFiltersProps) {
  return (
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
          <CalendarComponent
            initialFocus
            mode="range"
            defaultMonth={dateRange.from}
            selected={dateRange}
            onSelect={(range) => {
              onDateRangeChange({
                from: range?.from,
                to: range?.to,
              });
            }}
            numberOfMonths={2}
            className="rounded-md border"
          />
        </PopoverContent>
      </Popover>

      {/* Company Filter */}
      <div className="relative w-[200px]">
        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search company..."
          value={selectedCompany || ""}
          onChange={(e) => onCompanyChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Search Box */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Find research..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {onViewAllClick && (
        <Button
          variant="ghost"
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          onClick={onViewAllClick}
        >
          View All <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      )}
    </div>
  );
}
