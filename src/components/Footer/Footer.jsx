import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
    return (

        <div className='p-2 md:p-24  bg-[#000435] text-white md:pl-48'>
            <div className='flex max-md:flex-wrap max-lg:flex-wrap gap-4 '>
                <div className='flex justify-between w-full flex-wrap'>
                    <div className='flex flex-col flex-1 p-2 w-full gap-4'>
                        <h2>Pratik Awari</h2>
                        <div className='text-xs'>Lorem, ipsum dolor sit amet consectetur adipisicing.</div>
                    </div>
                    <div className='flex flex-col flex-1 p-2 w-full gap-4 items-start'>
                        <h2>Subscribe to get important updates</h2>
                        <input type='email' className='md:p-2 text-black' placeholder='YOUR E-MAIL' autoComplete='off' aria-autocomplete='off' />
                        <button className='bg-purple-600 p-2'>SUBSCRIBE</button>
                    </div>
                </div>
                <div className='flex justify-between w-full flex-wrap '>
                    <div className='flex flex-col flex-1 pl-2 md:p-2 gap-4 lg:pl-10'> 
                        <h2>Follow Us</h2>
                        <div className='flex gap-2  text-2xl '>
                            <Link href='#'><i className="fa fa-github"></i></Link>
                            <Link href='#'><i className="fa fa-twitter"></i></Link>
                            <Link href='#'><i className="fa fa-linkedin"></i></Link>
                        </div>
                    </div>
                    <div className='flex flex-col flex-1 p-2 gap-4 items-start'>
                        <h2>Call Us</h2>
                        <p>+91 1234567890</p>
                    </div>
                </div>
            </div>
        </div>


    )
}

export default Footer