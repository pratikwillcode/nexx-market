import React, { useState } from 'react'
import LogoutBtn from './LogoutBtn'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Menu, X } from "lucide-react"
import { FiShoppingCart } from "react-icons/fi";

function Nav() {
    const authStatus = useSelector(state => state.status)
    const userData = useSelector(state => state.userData)
    const navItems = [
        { name: 'Home', path: '/', active: true },
        { name: 'About', path: '/about', active: true },
        { name: 'Products', path: '/products', active: true },
        { name: 'Login', path: '/login', active: !authStatus },
        { name: 'Sign Up', path: '/signup', active: !authStatus },
        {name: 'Orders', path: '/orders', active: authStatus}
    ]

    const [isOpen, setIsOpen] = useState(false)
    const toggleNavbar = () => {
        setIsOpen(!isOpen)
    }

    const cartItems = useSelector(state => state.cart)
    const [totalItems, setTotalItems] = useState(0)

    React.useEffect(() => {

        if (cartItems) {
            const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0)
            setTotalItems(totalItems)
        }
    }, [cartItems])

    return (
        <>
            <nav className=''>
                <div className=''>
                    <div className='hidden md:flex justify-between items-center'>
                        {navItems.map((item, index) => item.active &&
                            <NavLink key={index} to={item.path}
                                className={`px-3 py-1 hover:scale-105 hover:text-purple-600 transition-all duration-300 ease-in-out ${item.name == 'Sign Up' || item.name == 'Login' ?
                                    'bg-purple-600 mx-2 text-white rounded-sm hover:text-white' : ''} `}>{item.name}</NavLink>
                        )}
                        <NavLink to='/profile' className='text-2xl font-bold text-purple-600'>
                        {userData &&
                            <div className='text-sm font-light px-3 capitalize  hover:scale-105 hover:text-purple-600 transition-all duration-300 ease-in-out'>
                                Welcome, {userData.name}
                            </div>
                        }
                        </NavLink>
                        

                        {authStatus && <LogoutBtn />}
                        <NavLink to='/cart' className='p-2 px-3 flex text-xl relative pr-3 hover:scale-110 transition-all duration-300 ease-in-out'>
                            <FiShoppingCart className='hover:text-purple-600 ' />
                            <div className=' absolute left-5 top-0 text-xs bg-purple-600 rounded-full px-1 pt-1 text-white  '>
                                {totalItems}
                            </div>
                        </NavLink>
                    </div>
                    <div className='md:hidden'>
                        <button onClick={toggleNavbar}>
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </nav>
            {isOpen &&
                <div className='flex flex-col items-center basis-full md:hidden'>
                    {navItems.map((item, index) => item.active &&
                        <NavLink key={index} to={item.path} className={`px-2 py-1 ${item.name == 'Sign Up' || item.name == 'Login' ?
                            'bg-purple-600 my-2 text-white' : ''}`}>{item.name}</NavLink>
                    )}
                    {userData &&
                            <div className='text-sm font-light p-2 capitalize  hover:scale-105 hover:text-purple-600 transition-all duration-300 ease-in-out'>
                                Welcome, {userData.name}
                            </div>
                        }
                    {authStatus && <LogoutBtn />}
                    <NavLink to='/cart' className='p-2 flex text-xl relative pr-3'>
                        <FiShoppingCart className='' />
                        <div className=' absolute left-5 top-0 text-xs bg-purple-600 rounded-full px-1 pt-1 text-white'>
                            {totalItems}
                        </div>
                    </NavLink>
                </div>
            }
        </>

    )
}

export default Nav