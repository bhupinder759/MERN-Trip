import { Menu, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import Image from '../assets/logo.svg'

const menuOptions = [
    { name: "Home", path: '/' },
    { name: 'Planning', path: '/planning' },
    { name: 'Contact us', path: '/contact-us' }
];

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4">
            <div className='relative max-w-5xl mx-auto bg-white/6 backdrop-blur-lg border border-white/10 rounded-full shadow-lg'>
                <div className='flex justify-between items-center px-4 sm:px-6 py-3'>
                    {/* Logo and Title */}
                    <Link to="/" className='flex items-center gap-2'>
                        <img src={Image} className='w-8 h-8' alt="" />
                        <h2 className='font-bold text-white text-xl hidden sm:block'>AI Trip Planner</h2>
                    </Link>

                    {/* Desktop Menu Options */}
                    <nav className='hidden md:flex gap-8 items-center'>
                        {menuOptions.map((menu, index) => (
                            <Link to={menu.path} key={index}>
                                <h2 className='text-lg text-white/80 hover:text-[#ff4404] hover:scale-105 transition-all duration-300'>{menu.name}</h2>
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Get Started Button */}
                    <div className='hidden md:block'>
                        <Button className="bg-blue-600 hover:bg-blue-700 rounded-full">Get Started</Button>
                    </div>

                    {/* Mobile Menu using Shadcn Sheet */}
                    <div className='md:hidden'>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="bg-transparent border-0 hover:bg-white/10">
                                    <Menu className="h-6 w-6 text-white" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <div className="flex flex-col h-full m-6">
                                    <div className="flex justify-between items-center mb-8">
                                         <Link to="/" className='flex items-center gap-2'>
                                            <img src={Image} className='w-8 h-8' alt="" />
                                            <h2 className='font-bold text-white text-xl'>AI Planner</h2>
                                        </Link>
                                    </div>
                                    <nav className='flex flex-col items-start gap-6 text-lg'>
                                        {menuOptions.map((menu, index) => (
                                            <Link to={menu.path} key={index} className="w-full text-left">
                                                <h2 className='text-white/80 hover:text-white py-2 transition-all duration-300'>{menu.name}</h2>
                                            </Link>
                                        ))}
                                    </nav>
                                    <div className="mt-auto">
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-full border-b-blue-700">Get Started</Button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
  )
}

export default Navbar