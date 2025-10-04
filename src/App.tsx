import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MergePage from './pages/MergePage'
import NotFoundPage from './pages/NotFoundPage'
import SplitPage from './pages/SplitPage'
import HomePage from './pages/HomePage'

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/split" element={<SplitPage />} />
          <Route path="/merge" element={<MergePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App
