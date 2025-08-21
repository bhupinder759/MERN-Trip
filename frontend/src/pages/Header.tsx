import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'

const Header = () => {
  return (
    <div className='flex flex-col items-center justify-center w-full'>
      <Navbar />
      <Outlet />
    </div>
  )
}

export default Header