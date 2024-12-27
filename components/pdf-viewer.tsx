'use client'

interface PDFViewerProps {
  pdfUrl: string
  highlights?: Array<{
    page: number
    rect: {
      x1: number
      y1: number
      x2: number
      y2: number
    }
  }>
}

export function PDFViewer({ pdfUrl, highlights }: PDFViewerProps) {
  return (
    <div className="w-full h-full">
      <img 
        src={pdfUrl} 
        alt="PDF Preview" 
        className="w-full h-full object-contain"
      />
    </div>
  )
}

