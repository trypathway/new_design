'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, BookOpen, FileText, Building2, Newspaper, Globe } from 'lucide-react'
import { BackToStartButton } from '@/components/back-to-start-button'
import { useState, useEffect } from 'react'

export default function PlaybookSelection() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [context, setContext] = useState<any>(null)

  useEffect(() => {
    const contextParam = searchParams.get('context')
    if (contextParam) {
      const parsedContext = JSON.parse(decodeURIComponent(contextParam))
      setContext(parsedContext)
    }
  }, [searchParams])

  const playbooks = [
    { id: 1, name: "Fundamental Analysis", description: "Analyze company financials and market position" },
    { id: 2, name: "Technical Analysis", description: "Study price charts and trading volumes" },
    { id: 3, name: "Macro Economic Review", description: "Evaluate broader economic factors" },
  ]

  const handlePlaybookStart = (id: number) => {
    router.push(`/playbooks/${id}${context ? `?context=${encodeURIComponent(JSON.stringify(context))}` : ''}`)
  }

  const handleCreatePlaybook = () => {
    router.push(`/playbooks/new${context ? `?context=${encodeURIComponent(JSON.stringify(context))}` : ''}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <BackToStartButton />
        <h1 className="text-3xl font-bold mb-6 mt-12">Select a Playbook</h1>
        {context && (
          <Card className="mb-4 border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-gray-100 p-1.5 rounded-md">
                  <FileText className="h-4 w-4 text-gray-700" />
                </div>
                <h2 className="text-base font-semibold text-gray-900">Research Context</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <h3 className="text-xs font-medium text-gray-700">Companies</h3>
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
                      <span className="text-xs text-gray-500">None specified</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xs font-medium text-gray-700">Documents</h3>
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
                      <span className="text-xs text-gray-500">None specified</span>
                    )}
                  </div>
                </div>

                <div className="col-span-2 flex gap-3 mt-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className={`p-1 rounded-md ${context.includeNews ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}>
                      <Newspaper className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs text-gray-700">
                      News: <span className="font-medium">{context.includeNews ? 'Yes' : 'No'}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <div className={`p-1 rounded-md ${context.includeWebAccess ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}>
                      <Globe className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs text-gray-700">
                      Web: <span className="font-medium">{context.includeWebAccess ? 'Yes' : 'No'}</span>
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playbooks.map((playbook) => (
            <Card key={playbook.id}>
              <CardHeader>
                <CardTitle>{playbook.name}</CardTitle>
                <CardDescription>{playbook.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => handlePlaybookStart(playbook.id)}>
                  <BookOpen className="mr-2 h-4 w-4" /> Start Playbook
                </Button>
              </CardContent>
            </Card>
          ))}
          <Card>
            <CardHeader>
              <CardTitle>Create New Playbook</CardTitle>
              <CardDescription>Define a new research workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" onClick={handleCreatePlaybook}>
                <PlusCircle className="mr-2 h-4 w-4" /> Create Playbook
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

