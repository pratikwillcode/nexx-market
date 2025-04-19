import React from 'react'
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

function PaymentGatewayCartItems({ item }) {
    const [expandDescription, setExpandDescription] = React.useState(false)
    const convertToDecimal = (str) => {
        if(str.length > 2){

            return "₹" + str.substring(0, str.length - 2) + "." + str.substring(str.length - 2);
        }else{
            return "₹" + str + ".00"
        }
    }

    return (
       
                    <div className='pb-4 border-b-2'>

                        <h3 className=''>{item.name}</h3>
                        <div className='flex items-center py-0.5'>
                            <h1 className='pr-2 text-3xl'>{convertToDecimal(item.price.toString())}</h1>
                            <h3> X{item.quantity}</h3>
                        </div>
                        <div className='flex w-3/4 pb-4 pr-4'>
                            <h3 className={`${expandDescription ? '' : 'line-clamp-2'} font-extralight text-sm`}>{item.description}</h3>
                            {!expandDescription ? <div className='flex flex-col justify-end'
                                onClick={(e) => { setExpandDescription(!expandDescription) }}>
                                <AiFillCaretDown />
                            </div> : 
                            <div className='flex flex-col justify-end'
                            onClick={(e) => { setExpandDescription(!expandDescription) }}>
                            <AiFillCaretUp />
                        </div>}
                        </div>
                        <div className=' w-1/2'>
                            <img src={item.image} alt={item.name} className='' />
                        </div>
                    </div>
            

    )
}

export default PaymentGatewayCartItems