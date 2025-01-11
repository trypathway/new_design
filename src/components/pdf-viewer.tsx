'use client'

import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface PDFViewerProps {
  fileUrl: string
  initialPage?: number
  highlights?: Array<{
    page: number
    rect: { x1: number; y1: number; x2: number; y2: number; }
  }>
}

export function PDFViewer({ fileUrl, initialPage = 1, highlights }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState(initialPage)
  const [scale, setScale] = useState(1.0)
  const [error, setError] = useState<string | null>(null)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setError(null)
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error loading PDF:', error)
    setError('Failed to load PDF file. Please check if the file exists.')
  }

  return (
    <div className="flex flex-col items-center">
      {error ? (
        <div className="text-red-500 p-4">
          {error}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
              disabled={pageNumber <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                max={numPages}
                value={pageNumber}
                onChange={(e) => setPageNumber(Number(e.target.value))}
                className="w-16 text-center"
              />
              <span className="text-sm text-gray-500">
                of {numPages}
              </span>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
              disabled={pageNumber >= numPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setScale(scale - 0.1)}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-500">
                {Math.round(scale * 100)}%
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setScale(scale + 0.1)}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="overflow-auto max-h-[calc(80vh-12rem)] w-full">
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              className="flex justify-center"
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          </div>
        </>
      )}
    </div>
  )
}

