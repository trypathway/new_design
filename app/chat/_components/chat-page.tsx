'use client'

import { useState } from 'react'
import { Dialog, DialogHeader } from '@/components/ui/dialog'
import { PDFViewer } from '@/components/pdf-viewer'
import { DialogContent, DialogDescription, DialogTitle } from '@radix-ui/react-dialog';

interface Citation {
  id: string;
  page: number;
  text: string;
  fileUrl: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
}

export default function ChatPage({ params }: { params: { id: string } }) {
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  
  // Add sample messages with citations
  const [messages] = useState<Message[]>([
    {
      id: '1',
      role: 'user',
      content: 'What are the effects of climate change on coral reefs?'
    },
    {
      id: '2',
      role: 'assistant',
      content: 'According to recent research[1], coral reefs are experiencing significant bleaching due to rising ocean temperatures. Studies have shown that between 2016 and 2020, approximately 50% of the Great Barrier Reef was affected by bleaching events[2].',
      citations: [
        {
          id: '1',
          page: 1,
          text: "Global Impact of Climate Change on Coral Reefs",
          fileUrl: "/sample.pdf"
        },
        {
          id: '2',
          page: 3,
          text: "Great Barrier Reef Bleaching Events 2016-2020",
          fileUrl: "/sample.pdf"
        }
      ]
    }
  ]);

  // Add this console.log to debug
  console.log('Messages:', messages);

  const handleCitationClick = (citation: Citation) => {
    setSelectedCitation(citation);
    setIsPdfOpen(true);
  };

  return (
    <div className="flex flex-col space-y-4 p-4">
      {/* Add this debug element */}
      <div className="text-sm text-gray-500">
        Number of messages: {messages.length}
      </div>
      
      {/* Render messages with citations */}
      {messages.map((message) => (
        <div 
          key={message.id}
          className={`p-4 rounded-lg ${
            message.role === 'assistant' 
              ? 'bg-gray-100 ml-4' 
              : 'bg-blue-100 mr-4'
          }`}
        >
          <div className="prose dark:prose-invert">
            {message.role === 'assistant' && message.citations 
              ? message.content.split(/(\[[0-9]+\])/).map((part, index) => {
                  const citationMatch = part.match(/\[([0-9]+)\]/);
                  if (citationMatch) {
                    const citationId = citationMatch[1];
                    const citation = message.citations?.find(c => c.id === citationId);
                    return citation ? (
                      <button
                        key={index}
                        onClick={() => handleCitationClick(citation)}
                        className="text-blue-500 hover:underline"
                      >
                        {part}
                      </button>
                    ) : part;
                  }
                  return part;
                })
              : message.content
            }
          </div>
        </div>
      ))}

      {/* Citation viewer modal */}
      <Dialog open={isPdfOpen} onOpenChange={setIsPdfOpen}>
        <DialogContent className="max-w-4xl w-full h-[80vh]">
          <DialogHeader>
            <DialogTitle>Source Document</DialogTitle>
            <DialogDescription>
              {selectedCitation?.text}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCitation && (
            <PDFViewer 
              fileUrl={selectedCitation.fileUrl}
              initialPage={selectedCitation.page}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 