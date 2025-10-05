import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MergePage from './pages/MergePage'
import NotFoundPage from './pages/NotFoundPage'
import DeletePage from './pages/SplitPage'
import HomePage from './pages/HomePage'
import ExtractPage from './pages/ExtractPage'
import SplitPage from './pages/SplitPage'
import { Toaster } from 'sonner'


function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/split" element={<SplitPage />} />
          <Route path="/merge" element={<MergePage />} />
          <Route path="/extract" element={<ExtractPage />} />
          <Route path="/delete" element={<DeletePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
