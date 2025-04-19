import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setCart } from '../store/authSlice';
import appwriteService from '../appwrite/cart'


function MobileCartItem({ item, deleteCartItem, userId }) {

  const [quantity, setQuantity] = React.useState(1)
  const dispatch = useDispatch()
  const cartItems = useSelector(state => state.cart)
  const isLoggedIn = useSelector(state => state.status)
  const convertToDecimal = (str) => {
    return "₹" + str.substring(0, str.length - 2) + "." + str.substring(str.length - 2);
  }
  React.useEffect(() => {
    if(cartItems){
        const currentItem = cartItems.find(cartItem => cartItem.id === item.id && cartItem.color === item.color)
        if(currentItem){
            setQuantity(currentItem.quantity)
        }
    }
}, [cartItems])
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
    <div className=' py-4 border-b-2 mb-1'>
      <div className='flex gap-4 mb-4'>
        <div className=' pt-2 min-w-16 flex-1 min-h-12'>

          <img src={item.image} alt={item.name} className='' />
        </div>
        <div className='flex flex-col gap-1 flex-1'>
          <p className='text-lg'>{item.name}</p>

          <div className='text-xl'>{convertToDecimal(item.price.toString())}</div>
          <div className='flex gap-2 items-center'><span>Color:</span><div className='w-2 h-2 p-2 rounded-full' style={{ backgroundColor: item.color }}></div></div>



        </div>
      </div>
      <div className='flex items-center'>
        <div className=' text-xl flex-1 '>
          <div className=' '>
            <button className=' border-2 px-2 rounded-md shadow-lg' onClick={(e) => { updateQuantity('remove') }}>-</button>
            <span className='px-3 border-y-2 shadow-lg'>{quantity}</span>
            <button className=' border-2 px-2 rounded-md shadow-lg' onClick={(e) => { updateQuantity('add') }}>+</button>
          </div>
        </div>
        <div className='text-sm  flex-1'>
          <button onClick={(e) => deleteCartItem(item.id, item.color)} className='border-2 p-1 px-2 shadow-lg rounded-md '>Delete</button>
        </div>
      </div>

    </div>
  )
}

export default MobileCartItem