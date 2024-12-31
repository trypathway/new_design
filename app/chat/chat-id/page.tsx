'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SendHorizontal, User, Bot, X, Wand2, FileText, Building2, Newspaper, Globe, ChevronDown, ChevronUp } from 'lucide-react'
import { BackToStartButton } from '@/components/back-to-start-button'
import { PDFViewer } from '@/components/pdf-viewer'
import { ErrorBoundary } from '@/components/error-boundary'
import { LogViewer } from '@/components/log-viewer'
import { PromptImproverModal } from '@/components/prompt-improver-modal'

export default function ChatPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  // ... rest of the code stays the same
} 