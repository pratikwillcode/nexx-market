import React from 'react'
import Logo from '../Logo'
import Nav from './Nav'

function Header2() {
  return (
    <header className='sticky top-0 z-[20] mx-auto flex w-full items-center  flex-wrap justify-between px-8 py-4 bg-gray-50 '>
      <Logo />
      <Nav />
    </header>
  )
}

export default Header2