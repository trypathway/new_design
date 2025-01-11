"use client"

import * as React from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { cn } from "@/lib/utils"

interface AutocompleteProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  emptyText?: string
  className?: string
}

export function Autocomplete({
  options,
  value,
  onChange,
  placeholder = "Type to search...",
  emptyText = "No results found.",
  className
}: AutocompleteProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState(value)

  React.useEffect(() => {
    setInputValue(value)
  }, [value])

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  )

  return (
    <div className={className}>
      <Command className="border rounded-md">
        <CommandInput
          placeholder={placeholder}
          value={inputValue}
          onValueChange={(text) => {
            setInputValue(text)
            onChange(text)
          }}
        />
        {inputValue && (
          <CommandGroup className="max-h-[200px] overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={(value) => {
                    setInputValue(value)
                    onChange(value)
                    setOpen(false)
                  }}
                >
                  {option}
                </CommandItem>
              ))
            ) : (
              <CommandEmpty>{emptyText}</CommandEmpty>
            )}
          </CommandGroup>
        )}
      </Command>
    </div>
  )
} 