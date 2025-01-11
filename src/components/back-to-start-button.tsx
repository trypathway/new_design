'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function BackToStartButton() {
  const router = useRouter()
  
  return (
    <Button 
      variant="ghost" 
      onClick={() => router.push('/')}
      className="absolute top-4 left-4"
    >
      ← Back
    </Button>
  )
}

