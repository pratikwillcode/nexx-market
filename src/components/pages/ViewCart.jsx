import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
// import Container from '../container/Container';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCart } from '../../store/authSlice';
// import CartItem from '../CartItem'
import MobileCartItem from '../MobileCartItem';
import appwriteService from '../../appwrite/cart';
import conf from "../../conf/config";
import { loadStripe } from '@stripe/stripe-js';
import {Container, CartItem} from '../index'




function Cart() {
    const isLoggedIn = useSelector(state => state.status)
    const cartItemsData = useSelector(state => state.cart);
    const [cartItems, setCartItems] = React.useState(cartItemsData)
    const dispatch = useDispatch()
    const userData = useSelector(state => state.userData);
    const tableHeader = ['ITEM', 'PRICE', 'QUANTITY', 'SUBTOTAL', 'REMOVE']
    const [subtotal, setSubtotal] = React.useState(0)
    const stripePromise = loadStripe(conf.stripePublishKey);
    const [stripeError, setStripeError] = React.useState(null)
    const [payementGatewayVisible, setPayementGatewayVisible] = React.useState(false)
    const navigate = useNavigate()
    const stripeProducts = [
        {
            id: '6604df14983e0271ce3f1a6f',
            key: "price_1P14LtSA6IxWBXQ15QE6U7y5"
        },
        {
            id: '6604df9d983e0271ce3f1a70',
            key: "price_1P2Y2bSA6IxWBXQ15Ix3YLPI"
        },
        {
            id: '6604dff2983e0271ce3f1a71',
            key: "price_1P2Y5lSA6IxWBXQ1nxGGH0yi"
        },
        {
            id: '6604e02c983e0271ce3f1a72',
            key: "price_1P2Y8DSA6IxWBXQ13VNux83T"
        },
        {
            id: '6604e04a983e0271ce3f1a73',
            key: "price_1P2YEjSA6IxWBXQ1aLbiwDdc"
        },
        {
            id: '6604e073983e0271ce3f1a74',
            key: "price_1P2YIASA6IxWBXQ1oDKuoPyQ"
        },
        {
            id: '6604e119983e0271ce3f1a75',
            key: "price_1P2YJWSA6IxWBXQ1NZyXpFZT"
        },
        {
            id: '6604e1cd983e0271ce3f1a76',
            key: "price_1P2YL0SA6IxWBXQ1odXC9zTt"
        },
        {
            id: '6604e1ea983e0271ce3f1a77',
            key: "price_1P2YMQSA6IxWBXQ1xI6rNlcj"
        },
        {
            id: '6604e233983e0271ce3f1a78',
            key: "price_1P2YNISA6IxWBXQ1gwiEPmBi"
        },
        {
            id: '6604e261983e0271ce3f1a79',
            key: "price_1P2YNySA6IxWBXQ12ygRyRf2"
        },
        {
            id: '6604e281983e0271ce3f1a7a',
            key: "price_1P2YOWSA6IxWBXQ11ZjQ2gM5"
        }
    ]


    useEffect(() => {
        if (cartItemsData) {
            setCartItems(cartItemsData)
            if (cartItems) {

                let total = 0
                cartItems.forEach(item => {
                    total += item.price * item.quantity
                })
                setSubtotal(total)
            }
        }
    }, [cartItemsData, cartItems])

    const deleteCartItem = (id, color) => {
        const newCartItems = cartItems.filter(item => item.id !== id || item.color !== color)
        if (isLoggedIn) {
            if (newCartItems.length === 0) {
                appwriteService.deleteCart(userData.$id)
            }
            else {

                appwriteService.updateCart(userData.$id, JSON.stringify(newCartItems))
            }
        } else {
            localStorage.setItem('cart', JSON.stringify(newCartItems))
        }

        dispatch(setCart(newCartItems))
        setCartItems(newCartItems)
    }

    const clearCart = async () => {
        if (isLoggedIn) {
            await appwriteService.deleteCart(userData.$id)
        } else {
            localStorage.setItem('cart', "")
        }
        dispatch(setCart([]))
        setCartItems([])
    }

    const makeStripePayment = async () => {
        const stripe = await stripePromise;
        const lineItems = cartItems.map(item => {
            const product = stripeProducts.find(product => product.id === item.id)
            return {
                price: product.key,
                quantity: item.quantity
            }
        })
        const { error } = await stripe.redirectToCheckout({
            lineItems,
            mode: 'payment',
            cancelUrl: `${window.location.origin}/cart`,
            successUrl: `${window.location.origin}/orders`,
            // customerEmail: userData.email

        });

        if (error) {
            setStripeError(error)
        }
    }

    const redirectToCheckout = () => {
        navigate('/payment')
    }


    return (
        <div className=''>
            {stripeError && <div>{stripeError.message}</div>}
            <Container>
                {cartItems && cartItems.length > 0 ? (
                    <div>
                        {/* PC View */}
                        {userData ?
                            <div className='flex justify-between flex-col sm:flex-row py-4 gap-4 items-center'>
                                <h1 className=' text-2xl'>
                                    <span className=' capitalize py-2'>{userData.name}'s </span>
                                    Cart Items</h1>
                                <div className=''>
                                    <button onClick={(e) => { setPayementGatewayVisible(!payementGatewayVisible) }} className='w-full text-white bg-green-600 px-2 p-2 hover:bg-green-700 transition-all ease-in-out hover:scale-105'> Proceed to Checkout   </button>
                                </div>
                            </div> : <h1 className=' text-2xl'>Cart Items</h1>

                        }

                        <div className='md:py-8 text-sm sm:block hidden'>


                            <div className=''>
                                <table className=' table-auto w-full'>
                                    <thead className=' text-left font-thin border-b-2'>

                                        <tr className='' >
                                            {tableHeader.map((header) => (
                                                <th className={`font-light ${header !== "ITEM" ? 'text-end' : ''} ${header === 'REMOVE' ? 'text-end' : ''}`} key={header}>{header}</th>
                                            ))}

                                        </tr>
                                    </thead>

                                    <tbody className=' border-b-2'>
                                        {cartItems && cartItems.map((item) => (

                                            <CartItem item={item} deleteCartItem={deleteCartItem} userId={userData?.$id} key={item.id + item.color} />
                                        ))}
                                    </tbody>
                                </table>

                            </div>
                        </div>
                        {/* Mobile view */}
                        <div className=' max-sm:block hidden'>
                            {cartItems && cartItems.map((item) => (
                                <MobileCartItem item={item} deleteCartItem={deleteCartItem} userId={userData?.$id} key={item.id + item.color} />
                            ))}

                        </div>
                        <div className='w-full flex justify-between gap-2 py-2  mb-2 text-center'>
                            <NavLink to='/products' className='bg-purple-600 text-white p-2 sm:shadow-xl shadow-lg hover:bg-purple-700 transition-all ease-in-out hover:scale-105'>CONTINUE SHOPPING</NavLink>
                            <button onClick={clearCart} className=' bg-orange-600 text-white p-2 shadow-lg transition-all ease-in-out hover:scale-105'>CLEAR CART</button>
                        </div>
                        <div className='flex w-full justify-end py-2 '>
                            <div className='flex  flex-col gap-4 bg-gray-100 p-6 text-sm px-8  font-light max-sm:w-2/3 shadow-lg'>

                                <div className=' border-b-2 border-black pb-3'>
                                    <div className='py-1 flex justify-between'><span className=' '>Subtotal:</span> <span className='font-medium'> {subtotal}</span> </div>
                                    <div className='py-1 flex justify-between'><span className=' '>Shipping Fee:</span> <span className='font-medium'> {5}</span> </div>
                                </div>
                                <div>
                                    <div className='py-1 gap-4 flex justify-between'><span className=''>Order Total :</span> <span className='font-medium'> {subtotal + 5}</span></div>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className='flex py-4 gap-4 h-screen lg:flex-row flex-col items-center '>
                        <div>

                            <img src='/emptyCart.jpg' alt='empty cart' className='w-96 mx-auto' />
                        </div>
                        <div className='flex flex-col justify-center items-center'>
                            <div className=''>Your Cart is empty</div>
                            <NavLink to='/featured' className='text-blue-600 pb-4'>Shop today’s deals from our featured products</NavLink>
                            <div>
                                {isLoggedIn ?
                                    <NavLink to='/products' className='bg-purple-600 text-white px-2 py-1 shadow-lg'>CONTINUE SHOPPING</NavLink>
                                    :
                                    <div className='flex gap-2 '>
                                        <NavLink to='/login' className='bg-purple-600 text-white px-2 py-1 border-purple-600 border-2 shadow-lg rounded-sm '>LOGIN IN TO YOUR ACCOUNT</NavLink>
                                        <NavLink to='/signup' className=' px-2 py-1 shadow-lg border-2 rounded-sm'>SIGN UP NOW</NavLink>

                                    </div>}

                            </div>
                        </div>
                    </div>
                )}

                <div className={`${payementGatewayVisible ? 'fixed top-0 bottom-0 left-0 right-0 w-full h-screen' : 'hidden'}`}>
                    <div onClick={(e) => {
                        setPayementGatewayVisible(false)
                    }} className='bg-gray-800 bg-opacity-80  h-full flex justify-center items-center flex-col'>
                        <Container>
                            <h1 className='text-3xl font-semibold text-center py-8 text-white'>Choose Payment Gateway</h1>
                            <div className='flex justify-center gap-8'>

                                <button onClick={(e) => {
                                    redirectToCheckout()
                                    e.stopPropagation()
                                }} className='bg-green-500 text-white px-4 py-2 rounded-sm hover:bg-green-600 transition-all ease-in-out hover:scale-105'>Pay with Our Gateway</button>
                                <button onClick={(e) => {
                                    makeStripePayment()
                                    e.stopPropagation()
                                }} className='bg-blue-500 text-white px-4 py-2 rounded-sm hover:bg-blue-600 transition-all ease-in-out hover:scale-105'>Pay with Stripe</button>
                            </div></Container>

                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Cart