'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { 
  Building2, 
  FileText, 
  Upload,
  Plus,
  Info,
  Globe,
  Newspaper,
  X,
  Search,
  Link
} from 'lucide-react'

// Mock company search results - replace with real API later
const searchCompanies = (query: string) => {
  const companies = [
    { id: '1', name: 'Apple Inc.', ticker: 'AAPL' },
    { id: '2', name: 'Microsoft Corporation', ticker: 'MSFT' },
    { id: '3', name: 'Amazon.com Inc.', ticker: 'AMZN' },
    { id: '4', name: 'Tesla Inc.', ticker: 'TSLA' },
    { id: '5', name: 'NVIDIA Corporation', ticker: 'NVDA' }
  ]
  return companies.filter(company => 
    company.name.toLowerCase().includes(query.toLowerCase()) ||
    company.ticker.toLowerCase().includes(query.toLowerCase())
  )
}

// Mock documents data - replace with real API later
const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Apple Q4 2023 Earnings Call',
    company: 'Apple Inc.',
    type: 'Earnings Call Transcript',
    year: 2023,
    date: '2023-10-26'
  },
  {
    id: '2',
    title: 'Apple Annual Report 2023',
    company: 'Apple Inc.',
    type: '10K',
    year: 2023,
    date: '2023-09-30'
  },
  {
    id: '3',
    title: 'Apple Material Event Disclosure',
    company: 'Apple Inc.',
    type: '8K',
    year: 2023,
    date: '2023-08-15'
  },
  {
    id: '4',
    title: 'Microsoft Q3 2023 Earnings Call',
    company: 'Microsoft Corporation',
    type: 'Earnings Call Transcript',
    year: 2023,
    date: '2023-07-25'
  },
  {
    id: '5',
    title: 'Microsoft Annual Report 2023',
    company: 'Microsoft Corporation',
    type: '10K',
    year: 2023,
    date: '2023-06-30'
  },
  {
    id: '6',
    title: 'Tesla Q3 2023 Earnings Call',
    company: 'Tesla Inc.',
    type: 'Earnings Call Transcript',
    year: 2023,
    date: '2023-10-18'
  },
  {
    id: '7',
    title: 'NVIDIA Annual Report 2023',
    company: 'NVIDIA Corporation',
    type: '10K',
    year: 2023,
    date: '2023-02-28'
  },
  {
    id: '8',
    title: 'Amazon Q2 2023 Earnings Call',
    company: 'Amazon.com Inc.',
    type: 'Earnings Call Transcript',
    year: 2023,
    date: '2023-07-15'
  },
  {
    id: '9',
    title: 'Tesla Cybertruck Production Update',
    company: 'Tesla Inc.',
    type: '8K',
    year: 2023,
    date: '2023-11-01'
  },
  {
    id: '10',
    title: 'NVIDIA AI Strategy Overview',
    company: 'NVIDIA Corporation',
    type: 'Other',
    year: 2023,
    date: '2023-09-15'
  }
]

interface Company {
  id: string
  name: string
  ticker: string
}

interface Document {
  id: string
  title: string
  company: string
  type: 'Earnings Call Transcript' | '10K' | '8K' | 'Other'
  year: number
  date: string
}

interface ContextWindowProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (contextData: any) => void
}

export function ContextWindow({ isOpen, onClose, onComplete }: ContextWindowProps) {
  const [selectedCompanies, setSelectedCompanies] = useState<Company[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Company[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isDocumentSelecting, setIsDocumentSelecting] = useState(false)
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([])
  const [documentFilter, setDocumentFilter] = useState({
    type: '',
    year: '',
    company: ''
  })
  const [isUploadSelecting, setIsUploadSelecting] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [urls, setUrls] = useState<string[]>([])
  const [urlInput, setUrlInput] = useState('')
  const [includeNews, setIncludeNews] = useState(true)
  const [includeWeb, setIncludeWeb] = useState(true)

  const handleCompanySearch = (query: string) => {
    setSearchQuery(query)
    if (query.length > 0) {
      const results = searchCompanies(query)
      setSearchResults(results)
      setIsSearching(true)
    } else {
      setSearchResults([])
      setIsSearching(false)
    }
  }

  const addCompany = (company: Company) => {
    if (!selectedCompanies.find(c => c.id === company.id)) {
      setSelectedCompanies([...selectedCompanies, company])
    }
    setSearchQuery('')
    setSearchResults([])
    setIsSearching(false)
  }

  const removeCompany = (companyId: string) => {
    setSelectedCompanies(selectedCompanies.filter(c => c.id !== companyId))
  }

  const getFilteredDocuments = () => {
    return mockDocuments.filter(doc => {
      const matchesType = !documentFilter.type || doc.type === documentFilter.type
      const matchesYear = !documentFilter.year || doc.year === parseInt(documentFilter.year)
      const matchesCompany = !documentFilter.company || 
        doc.company.toLowerCase().includes(documentFilter.company.toLowerCase())
      return matchesType && matchesYear && matchesCompany
    })
  }

  console.log('ContextWindow rendering:', { isOpen });
  
        return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1200px] w-[95vw] p-0">
        <Card className="p-8 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Research Context</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
              <div className="text-amber-500 mt-0.5">
                <Info className="h-5 w-5" />
              </div>
              <p className="text-sm text-amber-800 font-medium">
                You can add multiple items to each category and combine categories and sources.
              </p>
            </div>
          </div>

          {/* Main Upload Options - Moved to top */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Companies Section */}
            <div className="group relative">
              <Button
                variant="outline"
                className="w-full h-auto p-6 hover:border-blue-500 hover:bg-blue-50/50
                         flex flex-col items-center gap-4 group-hover:border-blue-500
                         min-h-[200px] relative"
                onClick={() => setIsSearching(true)}
              >
                <Building2 className="h-10 w-10 text-gray-600 group-hover:text-blue-600" />
                <div className="text-center">
                  <h3 className="font-medium mb-2 text-lg">Add Companies</h3>
                  <p className="text-sm text-gray-500">
                    Include one or multiple companies to research
                  </p>
                </div>
                {selectedCompanies.length > 0 && (
                  <div className="absolute top-2 right-2 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    {selectedCompanies.length} added
                  </div>
                )}
                <Plus className="h-8 w-8 absolute bottom-4 right-4 
                              text-gray-400 group-hover:text-blue-500
                              transition-all duration-200 
                              group-hover:scale-110" />
              </Button>
              
              {/* Company Search Overlay */}
              {isSearching && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl shadow-2xl w-[600px] max-h-[80vh] overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">Add Companies</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setIsSearching(false)}
                          className="hover:bg-gray-100"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                        <Search className="h-5 w-5 text-gray-400" />
                        <Input
                          placeholder="Search by company name or ticker..."
                          value={searchQuery}
                          onChange={(e) => handleCompanySearch(e.target.value)}
                          className="flex-1 border-0 bg-transparent focus-visible:ring-0"
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="p-6 overflow-y-auto max-h-[60vh]">
                      {/* Selected Companies */}
                      {selectedCompanies.length > 0 && (
                        <div className="mb-6">
                          <div className="text-sm font-medium text-gray-900 mb-3">Selected Companies</div>
                          <div className="flex flex-wrap gap-2">
                            {selectedCompanies.map(company => (
                              <div
                                key={company.id}
                                className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm group"
                              >
                                <Building2 className="h-4 w-4" />
                                <span>{company.name}</span>
                                <span className="text-blue-500">({company.ticker})</span>
                                <button
                                  onClick={() => removeCompany(company.id)}
                                  className="hover:text-blue-900 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Search Results */}
                      {searchQuery && (
                        <>
                          <div className="text-sm font-medium text-gray-900 mb-3">Search Results</div>
                          <div className="space-y-2">
                            {searchResults.map(company => (
                              <button
                                key={company.id}
                                onClick={() => addCompany(company)}
                                className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center justify-between group transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <Building2 className="h-5 w-5 text-gray-400" />
                                  <span className="font-medium">{company.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500">{company.ticker}</span>
                                  <Plus className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </>
                      )}

                      {/* Empty State */}
                      {!searchQuery && !selectedCompanies.length && (
                        <div className="text-center text-gray-500 py-8">
                          <Building2 className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                          <p>Search for companies to add to your research</p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t bg-gray-50 flex justify-end">
                      <Button onClick={() => setIsSearching(false)}>
                        Done
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Documents Section */}
            <div className="group relative">
              <Button
                variant="outline"
                className="w-full h-auto p-6 hover:border-emerald-500 hover:bg-emerald-50/50
                         flex flex-col items-center gap-4 group-hover:border-emerald-500
                         min-h-[200px] relative"
                onClick={() => setIsDocumentSelecting(true)}
              >
                <FileText className="h-10 w-10 text-gray-600 group-hover:text-emerald-600" />
                <div className="text-center">
                  <h3 className="font-medium mb-2 text-lg">Add Specific Documents</h3>
                  <p className="text-sm text-gray-500">
                    Include specific documents you want to research
                  </p>
                </div>
                {selectedDocuments.length > 0 && (
                  <div className="absolute top-2 right-2 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs">
                    {selectedDocuments.length} added
                  </div>
                )}
                <Plus className="h-8 w-8 absolute bottom-4 right-4 
                              text-gray-400 group-hover:text-emerald-500
                              transition-all duration-200 
                              group-hover:scale-110" />
              </Button>

              {/* Document Selection Overlay */}
              {isDocumentSelecting && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl shadow-2xl w-[800px] h-[80vh] flex flex-col">
                    {/* Header with Filters */}
                    <div className="p-6 border-b">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">Add Specific Documents</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setIsDocumentSelecting(false)}
                          className="hover:bg-gray-100"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Filters */}
                      <div className="grid grid-cols-3 gap-4">
                        <select
                          className="w-full rounded-lg border border-gray-200 p-2"
                          value={documentFilter.type}
                          onChange={(e) => setDocumentFilter({...documentFilter, type: e.target.value})}
                        >
                          <option value="">All Document Types</option>
                          <option value="Earnings Call Transcript">Earnings Call Transcript</option>
                          <option value="10K">10K</option>
                          <option value="8K">8K</option>
                          <option value="Other">Other</option>
                        </select>

                        <select
                          className="w-full rounded-lg border border-gray-200 p-2"
                          value={documentFilter.year}
                          onChange={(e) => setDocumentFilter({...documentFilter, year: e.target.value})}
                        >
                          <option value="">All Years</option>
                          {[2023, 2022, 2021, 2020].map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>

            <Input
                          placeholder="Filter by company..."
                          value={documentFilter.company}
                          onChange={(e) => setDocumentFilter({...documentFilter, company: e.target.value})}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Document List - Flex grow to fill space */}
                    <div className="flex-1 p-6 overflow-y-auto min-h-0">
                      <div className="space-y-2">
                        {getFilteredDocuments().map(doc => {
                          const isSelected = selectedDocuments.some(d => d.id === doc.id);
                          return (
                            <button
                              key={doc.id}
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedDocuments(docs => docs.filter(d => d.id !== doc.id))
                                } else {
                                  setSelectedDocuments(docs => [...docs, doc])
                                }
                              }}
                              className={`w-full text-left p-4 rounded-lg flex items-center justify-between group transition-colors
                                        ${isSelected 
                                          ? 'bg-emerald-50 hover:bg-emerald-100' 
                                          : 'hover:bg-gray-50'}`}
                            >
                              <div className="flex items-center gap-3">
                                <FileText className={`h-5 w-5 ${isSelected ? 'text-emerald-500' : 'text-gray-400'}`} />
                                <div>
                                  <div className={`font-medium ${isSelected ? 'text-emerald-900' : 'text-gray-900'}`}>
                                    {doc.title}
                                  </div>
                                  <div className={`text-sm ${isSelected ? 'text-emerald-600' : 'text-gray-500'}`}>
                                    {doc.company} • {doc.type} • {doc.date}
                                  </div>
                                </div>
                              </div>
                              {isSelected ? (
                                <div className="text-emerald-500 text-sm font-medium">Selected</div>
                              ) : (
                                <Plus className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Footer - Always visible */}
                    <div className="p-6 border-t bg-gray-50 flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        {selectedDocuments.length} documents selected
                      </div>
                      <Button onClick={() => setIsDocumentSelecting(false)}>
                        Done
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Upload PDFs Section - Moved to last position */}
            <div className="group relative">
              <Button
                variant="outline"
                className="w-full h-auto p-6 hover:border-purple-500 hover:bg-purple-50/50
                         flex flex-col items-center gap-4 group-hover:border-purple-500
                         min-h-[200px] relative"
                onClick={() => setIsUploadSelecting(true)}
              >
                <Upload className="h-10 w-10 text-gray-600 group-hover:text-purple-600" />
                <div className="text-center">
                  <h3 className="font-medium mb-2 text-lg">Add Files or URLs</h3>
                  <p className="text-sm text-gray-500">
                    Include your own files or URLs to the research
                  </p>
                </div>
                {(selectedFiles.length > 0 || urls.length > 0) && (
                  <div className="absolute top-2 right-2 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                    {selectedFiles.length + urls.length} added
                  </div>
                )}
                <Plus className="h-8 w-8 absolute bottom-4 right-4 
                              text-gray-400 group-hover:text-purple-500
                              transition-all duration-200 
                              group-hover:scale-110" />
              </Button>

              {/* Upload Selection Overlay */}
              {isUploadSelecting && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl shadow-2xl w-[800px] h-[80vh] flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">Add File or URL</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setIsUploadSelecting(false)}
                          className="hover:bg-gray-100"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 overflow-y-auto min-h-0">
                      {/* File Upload Section */}
                      <div className="mb-8">
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Upload Files</h4>
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                          <input
                            type="file"
                            multiple
                            className="hidden"
                            id="file-upload"
                            onChange={(e) => {
                              if (e.target.files) {
                                setSelectedFiles(prev => [...prev, ...Array.from(e.target.files || [])])
                }
              }}
            />
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer flex flex-col items-center"
                          >
                            <Upload className="h-10 w-10 text-gray-400 mb-4" />
                            <span className="text-sm text-gray-600">
                              Click to select files or drag and drop
                            </span>
                          </label>
                        </div>
                        {selectedFiles.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {selectedFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-purple-50 text-purple-700 px-4 py-2 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  <span>{file.name}</span>
                                </div>
                                <button
                                  onClick={() => setSelectedFiles(files => files.filter((_, i) => i !== index))}
                                  className="text-purple-500 hover:text-purple-700"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                </div>
              ))}
                          </div>
                        )}
          </div>

                      {/* URL Input Section */}
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Add URLs</h4>
          <div className="space-y-4">
                          <div className="flex gap-2">
            <Input
                              placeholder="Paste URL here..."
                              value={urlInput}
                              onChange={(e) => setUrlInput(e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              onClick={() => {
                                if (urlInput.trim()) {
                                  setUrls(prev => [...prev, urlInput.trim()])
                                  setUrlInput('')
                                }
                              }}
                              variant="outline"
                            >
                              Add
                            </Button>
                          </div>
                          {urls.length > 0 && (
                            <div className="space-y-2">
                              {urls.map((url, index) => (
                                <div key={index} className="flex items-center justify-between bg-purple-50 text-purple-700 px-4 py-2 rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <Link className="h-4 w-4" />
                                    <span className="truncate">{url}</span>
                                  </div>
                                  <button
                                    onClick={() => setUrls(urls => urls.filter((_, i) => i !== index))}
                                    className="text-purple-500 hover:text-purple-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t bg-gray-50 flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        {selectedFiles.length} files and {urls.length} URLs added
                      </div>
                      <Button onClick={() => setIsUploadSelecting(false)}>
                        Done
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Access Options - Moved below */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Sources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* News Card */}
              <button
                onClick={() => setIncludeNews(!includeNews)}
                className={`w-full transition-colors ${
                  includeNews 
                    ? 'bg-emerald-50 border-emerald-200' 
                    : 'bg-gray-50 border-gray-200'
                } border-2 rounded-lg p-4 hover:bg-emerald-50/70 group`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      includeNews ? 'bg-emerald-100' : 'bg-gray-100'
                    }`}>
                      <Newspaper className={`h-5 w-5 ${
                        includeNews ? 'text-emerald-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="text-left">
                      <h3 className={`font-medium ${
                        includeNews ? 'text-emerald-900' : 'text-gray-900'
                      }`}>
                        Include News
                      </h3>
                      <p className={`text-sm ${
                        includeNews ? 'text-emerald-600' : 'text-gray-500'
                      }`}>
                        {includeNews ? 'News articles will be included' : 'News articles will not be included'}
            </p>
          </div>
          </div>
                  <Switch 
                    checked={includeNews}
                    className={`${includeNews ? 'bg-emerald-500' : ''}`}
                  />
                </div>
              </button>

              {/* Web Access Card */}
              <button
                onClick={() => setIncludeWeb(!includeWeb)}
                className={`w-full transition-colors ${
                  includeWeb 
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-gray-50 border-gray-200'
                } border-2 rounded-lg p-4 hover:bg-emerald-50/70 group`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      includeWeb ? 'bg-emerald-100' : 'bg-gray-100'
                    }`}>
                      <Globe className={`h-5 w-5 ${
                        includeWeb ? 'text-emerald-600' : 'text-gray-600'
                      }`} />
          </div>
                    <div className="text-left">
                      <h3 className={`font-medium ${
                        includeWeb ? 'text-emerald-900' : 'text-gray-900'
                      }`}>
                        Web Access
                      </h3>
                      <p className={`text-sm ${
                        includeWeb ? 'text-emerald-600' : 'text-gray-500'
                      }`}>
                        {includeWeb ? 'AI will search the web' : 'AI will not search the web'}
            </p>
          </div>
          </div>
                  <Switch 
                    checked={includeWeb}
                    className={`${includeWeb ? 'bg-emerald-500' : ''}`}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Add Continue Button */}
          <div className="flex justify-end pt-4">
            <Button onClick={() => onComplete({
              companies: [],
              specificDocuments: [],
              includeNews: true,
              includeWebAccess: true
            })}>
              Continue
            </Button>
          </div>
        </Card>
        </DialogContent>
      </Dialog>
  )
}

