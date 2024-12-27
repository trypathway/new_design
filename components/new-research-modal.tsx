'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  PlusCircle, 
  Building2, 
  FileText, 
  Newspaper, 
  Globe, 
  Upload,
  X,
  Link
} from 'lucide-react'
import { Checkbox } from "@/components/ui/checkbox"
import { TabsList, TabsTrigger, Tabs, TabsContent } from "@/components/ui/tabs"

const MOCK_DOCUMENTS = {
  'Apple': [
    { id: 'a1', name: 'Q4 2023 Earnings Report', type: 'Earnings' },
    { id: 'a2', name: '2023 Annual Report', type: '10-K' },
    { id: 'a3', name: 'Q3 2023 10-Q', type: '10-Q' },
    { id: 'a4', name: 'Sustainability Report 2023', type: 'ESG' },
  ],
  'Microsoft': [
    { id: 'm1', name: 'Q4 2023 Earnings Call Transcript', type: 'Earnings' },
    { id: 'm2', name: '2023 Annual Report', type: '10-K' },
    { id: 'm3', name: 'Azure Growth Report', type: 'Analysis' },
  ],
  'Tesla': [
    { id: 't1', name: 'Q4 2023 Production Numbers', type: 'Report' },
    { id: 't2', name: '2023 Annual Report', type: '10-K' },
    { id: 't3', name: 'Cybertruck Launch Presentation', type: 'Presentation' },
  ]
}

type Document = {
  id: string
  name: string
  type: string
}

type DocumentType = 'Earnings' | '10-K' | '10-Q' | '8-K' | 'Other'

const DOCUMENT_TYPES: { label: string; value: DocumentType; icon: React.ReactNode }[] = [
  { 
    label: 'Earnings Calls', 
    value: 'Earnings',
    icon: <FileText className="h-4 w-4" />
  },
  { 
    label: '10-K', 
    value: '10-K',
    icon: <FileText className="h-4 w-4" />
  },
  { 
    label: '10-Q', 
    value: '10-Q',
    icon: <FileText className="h-4 w-4" />
  },
  { 
    label: '8-K', 
    value: '8-K',
    icon: <FileText className="h-4 w-4" />
  },
  { 
    label: 'Other', 
    value: 'Other',
    icon: <FileText className="h-4 w-4" />
  },
]

type UploadedFile = {
  id: string
  name: string
  type: 'local' | 'url'
  source: string
}

export function NewResearchModal() {
  const router = useRouter()
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [companies, setCompanies] = useState<string[]>([])
  const [companyInput, setCompanyInput] = useState('')
  const [documents, setDocuments] = useState<string[]>([])
  const [documentInput, setDocumentInput] = useState('')
  const [includeNews, setIncludeNews] = useState(false)
  const [includeWebAccess, setIncludeWebAccess] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [urlInput, setUrlInput] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<DocumentType[]>([])

  const handleStartResearch = () => {
    const context = {
      companies,
      specificDocuments: documents,
      includeNews,
      includeWebAccess,
      uploadedFiles
    }
    
    router.push(`/chat/new?context=${encodeURIComponent(JSON.stringify(context))}`)
    setIsOpen(false)
  }

  const renderOptionContent = () => {
    switch (selectedOption) {
      case 'companies':
        return (
          <div className="space-y-3 mt-2">
            <div className="flex gap-2">
              <Input
                placeholder="Add company name..."
                value={companyInput}
                onChange={(e) => setCompanyInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCompany()}
              />
              <Button 
                variant="outline"
                onClick={addCompany}
                className="shrink-0"
              >
                Add
              </Button>
            </div>
            {companies.length > 0 && (
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                <div className="flex flex-wrap gap-2">
                  {companies.map((company) => (
                    <span 
                      key={company}
                      className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full 
                               border border-gray-200 text-sm flex items-center gap-2"
                    >
                      {company}
                      <button
                        onClick={() => setCompanies(companies.filter(c => c !== company))}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        )

      case 'documents':
        return (
          <div className="space-y-3 mt-2">
            <div>
              <Label className="text-sm font-medium">Company</Label>
              <Input
                placeholder="Search company..."
                value={companyInput}
                onChange={(e) => setCompanyInput(e.target.value)}
                className="h-9 mt-1.5"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium">Document Types</Label>
              <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                {DOCUMENT_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => {
                      setSelectedTypes(prev =>
                        prev.includes(type.value)
                          ? prev.filter(t => t !== type.value)
                          : [...prev, type.value]
                      )
                    }}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md border transition-all duration-200
                      ${selectedTypes.includes(type.value)
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    <div className={`p-1 rounded-md ${
                      selectedTypes.includes(type.value)
                        ? 'bg-gray-800'
                        : 'bg-gray-100'
                    }`}>
                      {type.icon}
                    </div>
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Available Documents</Label>
              <ScrollArea className="h-[200px] w-full rounded-md border mt-1.5">
                <div className="p-2">
                  {Object.entries(MOCK_DOCUMENTS)
                    .filter(([company]) => 
                      company.toLowerCase().includes(companyInput.toLowerCase())
                    )
                    .map(([company, docs]) => {
                      const filteredDocs = docs.filter(doc => 
                        selectedTypes.length === 0 || selectedTypes.includes(doc.type as DocumentType)
                      )
                      
                      if (filteredDocs.length === 0) return null

                      return (
                        <div key={company} className="mb-3 last:mb-0">
                          <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{company}</h3>
                          <div className="space-y-1">
                            {filteredDocs.map((doc) => (
                              <div
                                key={doc.id}
                                className={`flex items-center justify-between py-1 px-2 rounded-md
                                          ${documents.includes(doc.id) 
                                            ? 'bg-gray-900 text-white' 
                                            : 'hover:bg-gray-50'
                                          } 
                                          cursor-pointer transition-colors duration-150`}
                                onClick={() => toggleDocument(doc.id)}
                              >
                                <div className="flex items-center gap-2">
                                  <FileText className={`h-4 w-4 ${
                                    documents.includes(doc.id) ? 'text-white' : 'text-gray-500'
                                  }`} />
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium">{doc.name}</span>
                                    <span className={`text-xs ${
                                      documents.includes(doc.id) ? 'text-gray-300' : 'text-gray-500'
                                    }`}>
                                      {doc.type}
                                    </span>
                                  </div>
                                </div>
                                <div className={`text-xs ${
                                  documents.includes(doc.id) ? 'text-gray-300' : 'text-gray-500'
                                }`}>
                                  {documents.includes(doc.id) ? 'Selected' : 'Select'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                </div>
              </ScrollArea>
            </div>

            {documents.length > 0 && (
              <div className="text-sm text-gray-500">
                {documents.length} document{documents.length !== 1 ? 's' : ''} selected
              </div>
            )}
          </div>
        )

      case 'upload':
        return (
          <div className="space-y-3 mt-2">
            <Tabs defaultValue="file" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="file" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload File
                </TabsTrigger>
                <TabsTrigger value="url" className="flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  Add URL
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="file">
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <Label>Upload Document</Label>
                    <Input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const newFile: UploadedFile = {
                            id: Math.random().toString(36).substr(2, 9),
                            name: file.name,
                            type: 'local',
                            source: 'Local Upload'
                          }
                          setUploadedFiles(prev => [...prev, newFile])
                        }
                      }}
                      accept=".pdf,.doc,.docx,.txt"
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-gray-500">
                      Supported formats: PDF, DOC, DOCX, TXT
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="url">
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <Label>Document URL</Label>
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        placeholder="https://..."
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && urlInput.trim()) {
                            const newFile: UploadedFile = {
                              id: Math.random().toString(36).substr(2, 9),
                              name: new URL(urlInput).hostname,
                              type: 'url',
                              source: urlInput
                            }
                            setUploadedFiles(prev => [...prev, newFile])
                            setUrlInput('')
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (urlInput.trim()) {
                            const newFile: UploadedFile = {
                              id: Math.random().toString(36).substr(2, 9),
                              name: new URL(urlInput).hostname,
                              type: 'url',
                              source: urlInput
                            }
                            setUploadedFiles(prev => [...prev, newFile])
                            setUrlInput('')
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="mt-6">
                <Label className="mb-2 block">Uploaded Documents</Label>
                <ScrollArea className="h-[200px] w-full rounded-md border">
                  <div className="p-4 space-y-2">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-2 rounded-md border bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          {file.type === 'local' ? (
                            <FileText className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Link className="h-4 w-4 text-gray-500" />
                          )}
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{file.name}</span>
                            <span className="text-xs text-gray-500">
                              {file.type === 'local' ? 'Local File' : file.source}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setUploadedFiles(prev => 
                            prev.filter(f => f.id !== file.id)
                          )}
                          className="text-gray-500 hover:text-gray-900"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  const addCompany = () => {
    if (companyInput.trim() && !companies.includes(companyInput.trim())) {
      setCompanies([...companies, companyInput.trim()])
      setCompanyInput('')
    }
  }

  const toggleDocument = (docId: string) => {
    setDocuments(prev => 
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          size="lg"
          className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 rounded-xl 
                   shadow-md hover:shadow-xl transition-all duration-200 
                   flex items-center gap-3 h-auto border border-gray-800
                   hover:border-gray-700"
        >
          <PlusCircle className="h-5 w-5" />
          <span className="text-base font-medium">New Research</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Define Research Context
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Set the scope of your research by selecting the context options below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-md
                     ${selectedOption === 'companies' ? 'ring-2 ring-gray-900 bg-gray-50' : ''}`}
            onClick={() => setSelectedOption('companies')}
          >
            <CardHeader className="p-4">
              <Building2 className="w-5 h-5 text-gray-700 mb-1.5" />
              <CardTitle className="text-base">Companies</CardTitle>
              <CardDescription className="text-sm">Select target companies</CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-md
                     ${selectedOption === 'documents' ? 'ring-2 ring-gray-900 bg-gray-50' : ''}`}
            onClick={() => setSelectedOption('documents')}
          >
            <CardHeader>
              <FileText className="w-6 h-6 text-gray-700 mb-2" />
              <CardTitle className="text-lg">Documents</CardTitle>
              <CardDescription>Add specific documents</CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-md
                     ${includeNews ? 'bg-gray-900 text-white' : ''}`}
            onClick={() => setIncludeNews(!includeNews)}
          >
            <CardHeader>
              <Newspaper className={`w-6 h-6 mb-2 ${includeNews ? 'text-white' : 'text-gray-700'}`} />
              <CardTitle className="text-lg">News</CardTitle>
              <CardDescription className={includeNews ? 'text-gray-200' : ''}>
                {includeNews ? 'News Included' : 'Include news articles'}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-md
                     ${includeWebAccess ? 'bg-gray-900 text-white' : ''}`}
            onClick={() => setIncludeWebAccess(!includeWebAccess)}
          >
            <CardHeader>
              <Globe className={`w-6 h-6 mb-2 ${includeWebAccess ? 'text-white' : 'text-gray-700'}`} />
              <CardTitle className="text-lg">Web Access</CardTitle>
              <CardDescription className={includeWebAccess ? 'text-gray-200' : ''}>
                {includeWebAccess ? 'Web Access Enabled' : 'Enable web access'}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-md
                     ${selectedOption === 'upload' ? 'ring-2 ring-gray-900 bg-gray-50' : ''}`}
            onClick={() => setSelectedOption('upload')}
          >
            <CardHeader>
              <Upload className="w-6 h-6 text-gray-700 mb-2" />
              <CardTitle className="text-lg">Upload</CardTitle>
              <CardDescription>Upload custom documents</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-4">
          {renderOptionContent()}
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleStartResearch}
            className="bg-gray-900 hover:bg-gray-800"
          >
            Start Research
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 