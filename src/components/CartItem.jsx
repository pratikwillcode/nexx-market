import React from 'react'
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from 'react-redux';
import { setCart } from '../store/authSlice';
import appwriteService from '../appwrite/cart'



function CartItem( { item, deleteCartItem, userId }) {

    const [quantity, setQuantity] = React.useState(1)
    const dispatch = useDispatch()
    const cartItems = useSelector(state => state.cart)
    
    React.useEffect(() => {
        if(cartItems){
            const currentItem = cartItems.find(cartItem => cartItem.id === item.id && cartItem.color === item.color)
            if(currentItem){
                setQuantity(currentItem.quantity)
            }
        }
    }, [cartItems])
    const isLoggedIn = useSelector(state => state.status)
    
    const convertToDecimal = (str) => {
        return "₹" + str.substring(0, str.length - 2) + "." + str.substring(str.length - 2);
    }
    const updateQuantity = (action) => {
       

            action === 'add' ? setQuantity(quantity + 1) : quantity > 1 ? setQuantity(quantity > 1 ? quantity - 1 : 1) : 1
            if(cartItems){
                const currentItem = cartItems.find(cartItem => cartItem.id === item.id && cartItem.color === item.color)
                let updatedQuantity = currentItem.quantity + (action === 'add' ? 1 : quantity > 1 ? -1 : 0)
                const updatedCurrentItem = { ...currentItem, quantity:updatedQuantity };
                const newCartItems = cartItems.map(cartItem => cartItem.id === item.id && cartItem.color === item.color ? updatedCurrentItem : cartItem)
                
                if(isLoggedIn){
                    const updateCart = appwriteService.updateCart(userId, JSON.stringify(newCartItems))
                    if(updateCart){
                        dispatch(setCart(newCartItems))
                    }
                }
                else{
                    localStorage.setItem('cart', JSON.stringify(newCartItems))
                    dispatch(setCart(newCartItems))
                    
                }
            }
       
    }
    return (
            <tr key={item.id + item.color} className=' font-light '>
                <td className='py-4'>
                    <div className='flex gap-2 '>
                        <img className=' max-w-24' src={item.image} alt={item.name} />
                        <div className='flex flex-col justify-center'>
                            <p>{item.name}</p>
                            <div className='flex gap-2 items-center'><span>Color:</span><div className='w-2 h-2 p-2 rounded-full' style={{ backgroundColor: item.color }}></div></div>
                        </div>
                    </div>
                </td>
                <td className='text-end'>{convertToDecimal(item.price.toString())}</td>
                <td className=' pr-3 text-end'> <button onClick={(e)=>{updateQuantity('remove')}}>-</button><span className='px-2'>{quantity}</span><button onClick={(e)=>{updateQuantity('add')}}>+</button> </td>
                <td className='text-end'>{convertToDecimal((item.price * item.quantity).toString())}</td>
                <td className=' text-end text-orange-600 text-lg pr-2'><button onClick={(e) => deleteCartItem(item.id, item.color)}><AiFillDelete /></button></td>
            </tr>
            
    )
}

export default CartItem