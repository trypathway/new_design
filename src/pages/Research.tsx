import { Button } from "@/components/ui/button"
import { useNavigate, useParams } from "react-router-dom"

export default function Research() {
  const navigate = useNavigate()
  const { title } = useParams()

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar-background border-r border-sidebar-border">
        <div className="p-6">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">{title}</h1>
          {/* Add research content here */}
        </div>
      </div>
    </div>
  )
}