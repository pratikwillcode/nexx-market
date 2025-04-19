import React from 'react'
import { NavLink } from 'react-router-dom'

function Product({image, name, price, id}) {
  const convertToDecimal = (str) => {
    return "₹" + str.substring(0, str.length - 2) + "." + str.substring(str.length - 2);
}
  return (
    <NavLink to={`/product/${id}`} className='flex flex-col hover:scale-105 transition-all  ease-in-out '>
        <div>

        <img src = {image} className=' object-cover xl:min-h-48 lg:min-h-32 md:min-h-24' />
        </div>
        <div className='flex justify-between'>
            <h3>{name}</h3>
            <h3>{convertToDecimal(price.toString())}</h3>
        </div>
    </NavLink>
  )
}

export default Product