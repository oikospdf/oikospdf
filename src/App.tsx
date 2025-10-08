import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MergePage from './pages/MergePage'
import NotFoundPage from './pages/NotFoundPage'
import DeletePage from './pages/DeletePage'
import HomePage from './pages/HomePage'
import ExtractPage from './pages/ExtractPage'
import SplitPage from './pages/SplitPage'
import CompressPage from './pages/CompressPage'
import { Toaster } from 'sonner'
import PngToPdfPage from './pages/PngToPdfPage'
import SuperMergePage from './pages/SuperMergePage'
import JpgToPdfPage from './pages/JpgToPdfPage'

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
          <Route path="/compress" element={<CompressPage />} />
          <Route path="/png-to-pdf" element={<PngToPdfPage />} />
          <Route path="/jpg-to-pdf" element={<JpgToPdfPage />} />
          <Route path="/super-merge" element={<SuperMergePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
