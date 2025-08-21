import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Contact from './pages/Contact'
import Home from './pages/Home'
import Planning from './pages/Planning'
// import Header from './pages/Header'

const App = () => {
  return (
    <div className='absolute inset-0 w-full' >
      <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/planning" element={<Planning />} />
      <Route path="/contact-us" element={<Contact />} />
    </Routes>
    </div>
  )
}

export default App