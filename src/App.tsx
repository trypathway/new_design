import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import Home from '@/pages/Home'
import Chat from '@/pages/Chat'
import Library from '@/pages/Library'
import Research from '@/pages/Research'
import Playbooks from '@/pages/Playbooks'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/library" element={<Library />} />
        <Route path="/research/:title" element={<Research />} />
        <Route path="/playbooks" element={<Playbooks />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
