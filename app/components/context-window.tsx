'use client'

import { useState, useCallback, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Building2, FileText, Newspaper, Globe, Upload, Link } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

// Mock data for available documents
const availableDocuments = [
  { id: 1, company: 'Apple', type: '10K', name: 'Apple 2022 10-K' },
  { id: 2, company: 'Apple', type: '10Q', name: 'Apple Q2 2023 10-Q' },
  { id: 3, company: 'Microsoft', type: '8K', name: 'Microsoft 8-K (May 2023)' },
  { id: 4, company: 'Google', type: 'Earnings Call', name: 'Google Q1 2023 Earnings Call' },
  { id: 5, company: 'Amazon', type: 'Other', name: 'Amazon Shareholder Letter 2023' },
]

export function ContextWindow({ isOpen, onClose, onComplete }: { isOpen: boolean; onClose: () => void; onComplete: (context: any) => void }) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [context, setContext] = useState<any>({
    companies: [],
    specificDocuments: [],
    includeNews: false,
    includeWebAccess: false,
    uploadedFiles: []
  })
  const [selectedCompany, setSelectedCompany] = useState('')
  const [documentFilter, setDocumentFilter] = useState('All')
  const [showInfoWindow, setShowInfoWindow] = useState(false)

  const filteredDocuments = useMemo(() => {
    return availableDocuments.filter(doc => 
      (documentFilter === 'All' || doc.type === documentFilter) &&
      (selectedCompany === '' || doc.company.toLowerCase().includes(selectedCompany.toLowerCase()))
    )
  }, [documentFilter, selectedCompany])

  const handleOptionSelect = useCallback((option: string) => {
    setSelectedOption(option)
  }, [])

  const handleCompanyAdd = useCallback((company: string) => {
    if (company && !context.companies.includes(company)) {
      setContext(prev => ({ ...prev, companies: [...prev.companies, company] }))
    }
  }, [context.companies])

  const handleDocumentToggle = useCallback((document: any) => {
    setContext(prev => {
      const updatedDocuments = prev.specificDocuments.some((doc: any) => doc.id === document.id)
        ? prev.specificDocuments.filter((doc: any) => doc.id !== document.id)
        : [...prev.specificDocuments, document]
      return { ...prev, specificDocuments: updatedDocuments }
    })
  }, [])

  const handleNewsToggle = useCallback(() => {
    setContext(prev => ({ ...prev, includeNews: !prev.includeNews }))
  }, [])

  const handleWebAccessToggle = useCallback(() => {
    setContext(prev => ({ ...prev, includeWebAccess: !prev.includeWebAccess }))
  }, [])

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setContext(prev => ({ ...prev, uploadedFiles: [...prev.uploadedFiles, ...Array.from(event.target.files as FileList).map(file => file.name)] }))
    }
  }, [])

  const handleComplete = useCallback(() => {
    onComplete(context)
  }, [context, onComplete])

  const renderOptionContent = useCallback(() => {
    switch (selectedOption) {
      case 'companies':
        return (
          <div className="space-y-4">
            <Input
              placeholder="Add a company"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCompanyAdd(selectedCompany)
                  setSelectedCompany('')
                }
              }}
            />
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              {context.companies.map((company: string, index: number) => (
                <div key={index} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm mb-2">
                  {company}
                </div>
              ))}
            </ScrollArea>
          </div>
        )
      case 'specificDocuments':
        return (
          <div className="space-y-4">
            <Input
              placeholder="Filter by company name"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            />
            <Select value={documentFilter} onValueChange={setDocumentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="10K">10K</SelectItem>
                <SelectItem value="10Q">10Q</SelectItem>
                <SelectItem value="8K">8K</SelectItem>
                <SelectItem value="Earnings Call">Earnings Call</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id={`doc-${doc.id}`}
                    checked={context.specificDocuments.some((d: any) => d.id === doc.id)}
                    onCheckedChange={() => handleDocumentToggle(doc)}
                  />
                  <label
                    htmlFor={`doc-${doc.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {doc.name} ({doc.company})
                  </label>
                </div>
              ))}
            </ScrollArea>
          </div>
        )
      case 'news':
        return (
          <div className="space-y-4">
            <p>
              {context.includeNews
                ? "News articles will be included in your research context."
                : "News articles will not be included in your research context."}
            </p>
          </div>
        )
      case 'webAccess':
        return (
          <div className="space-y-4">
            <p>
              {context.includeWebAccess
                ? "The AI will have access to the web for up-to-date information."
                : "The AI will not have access to the web and will rely on its existing knowledge."}
            </p>
          </div>
        )
      case 'upload':
        return (
          <div className="space-y-4">
            <Input id="fileUpload" type="file" multiple onChange={handleFileUpload} />
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              {context.uploadedFiles.map((file: string, index: number) => (
                <div key={index} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm mb-2">
                  {file}
                </div>
              ))}
            </ScrollArea>
          </div>
        )
      case 'connectNewSource':
        return (
          <div className="space-y-4">
            <p>
              To integrate a new data source, please click the "Connect New Source" card again or use the "Contact Us" button.
            </p>
          </div>
        )
      default:
        return null
    }
  }, [selectedOption, selectedCompany, documentFilter, filteredDocuments, context, handleCompanyAdd, handleDocumentToggle, handleFileUpload])

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Define Research Context</DialogTitle>
            <DialogDescription>
              Set the scope of your research by defining the context.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4">
            <Card className={`cursor-pointer ${selectedOption === 'companies' ? 'border-primary' : ''}`} onClick={() => handleOptionSelect('companies')}>
              <CardHeader>
                <CardTitle><Building2 className="w-6 h-6 mb-2" /> Companies</CardTitle>
                <CardDescription>Select companies to include in your research</CardDescription>
              </CardHeader>
            </Card>
            <Card className={`cursor-pointer ${selectedOption === 'specificDocuments' ? 'border-primary' : ''}`} onClick={() => handleOptionSelect('specificDocuments')}>
              <CardHeader>
                <CardTitle><FileText className="w-6 h-6 mb-2" /> Specific Documents</CardTitle>
                <CardDescription>Add specific documents to your research</CardDescription>
              </CardHeader>
            </Card>
            <Card 
              className={`cursor-pointer ${selectedOption === 'news' ? 'border-primary' : ''} ${context.includeNews ? 'bg-primary/10' : ''}`} 
              onClick={() => {
                handleOptionSelect('news')
                handleNewsToggle()
              }}
            >
              <CardHeader>
                <CardTitle><Newspaper className="w-6 h-6 mb-2" /> News</CardTitle>
                <CardDescription>{context.includeNews ? "News Included" : "News Not Included"}</CardDescription>
              </CardHeader>
            </Card>
            <Card 
              className={`cursor-pointer ${selectedOption === 'webAccess' ? 'border-primary' : ''} ${context.includeWebAccess ? 'bg-primary/10' : ''}`} 
              onClick={() => {
                handleOptionSelect('webAccess')
                handleWebAccessToggle()
              }}
            >
              <CardHeader>
                <CardTitle><Globe className="w-6 h-6 mb-2" /> Web Access</CardTitle>
                <CardDescription>{context.includeWebAccess ? "Web Access Enabled" : "Web Access Disabled"}</CardDescription>
              </CardHeader>
            </Card>
            <Card className={`cursor-pointer ${selectedOption === 'upload' ? 'border-primary' : ''}`} onClick={() => handleOptionSelect('upload')}>
              <CardHeader>
                <CardTitle><Upload className="w-6 h-6 mb-2" /> Upload Documents</CardTitle>
                <CardDescription>Upload internal files or PDFs</CardDescription>
              </CardHeader>
            </Card>
            <Card className={`cursor-pointer ${selectedOption === 'connectNewSource' ? 'border-primary' : ''}`} onClick={() => {
              handleOptionSelect('connectNewSource')
              setShowInfoWindow(true)
            }}>
              <CardHeader>
                <CardTitle><Link className="w-6 h-6 mb-2" /> Connect New Source</CardTitle>
                <CardDescription>Integrate a new data source</CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div className="mt-6">
            {renderOptionContent()}
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleComplete}>Set Context</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showInfoWindow} onOpenChange={setShowInfoWindow}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect New Source</DialogTitle>
            <DialogDescription>
              To integrate a new data source, please get in touch with our team.
            </DialogDescription>
          </DialogHeader>
          <p className="py-4">
            Our experts will work with you to securely connect and configure your desired data source, 
            ensuring it seamlessly integrates with our research platform.
          </p>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setShowInfoWindow(false)}>Close</Button>
            <Button type="button" onClick={() => {
              // Here you would typically trigger an email or open a contact form
              console.log("Contact team for new source integration")
              setShowInfoWindow(false)
            }}>
              Contact Us
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

