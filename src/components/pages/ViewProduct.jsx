import React from 'react'
// import Container from '../container/Container'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
// import Star from '../Star'
import { FaTruckFast } from "react-icons/fa6";
import { RiRefundFill } from "react-icons/ri";
import { BiShieldQuarter } from "react-icons/bi";
import { TbReplaceFilled } from "react-icons/tb";
import appwriteService from '../../appwrite/cart'
import { setCart } from '../../store/authSlice'
import { Container, Star } from '../index'
import { MdArrowBack } from "react-icons/md";



function ViewProduct() {
    const { id } = useParams()
    const dispatch = useDispatch()
    const [product, setProduct] = React.useState(null)
    const products = useSelector((state) => state.products)
    const [color, setColor] = React.useState('')
    const [quantity, setQuantity] = React.useState(1)
    const isLoggedIn = useSelector(state => state.status)
    const userData = useSelector(state => state.userData)
    const cartItems = useSelector(state => state.cart)
    const navigate = useNavigate()


    React.useEffect(() => {
        if (products) {
            const foundProduct = products.find(product => product.id === id)
            console.log(foundProduct.rating.rate)
            setProduct(foundProduct)
            setColor(foundProduct.colors[0])
        }
    }, [products, id])

    const convertToDecimal = (str) => {
        return "₹" + str.substring(0, str.length - 2) + "." + str.substring(str.length - 2);
    }





    const getDiscountedPrice = (price, discount) => {
        price = price - (price * discount / 100)
        return price.toFixed(2)
    }

    const addItemsToCart = async () => {
        const item = {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            color: color,
            image: product.image,
            description: product.description
        }
        if (!isLoggedIn) {
            const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []

            if (cart) {
                if (cart.find((cartItem) => cartItem.id === item.id && cartItem.color === item.color)) {

                    cart.find((cartItem) => cartItem.id === item.id && cartItem.color === item.color).quantity += item.quantity

                } else {
                    cart.push(item)
                }
                localStorage.setItem('cart', JSON.stringify(cart))
            } else {
                localStorage.setItem('cart', JSON.stringify([item]))
            }
            dispatch(setCart(JSON.parse(localStorage.getItem('cart'))))

        } else {
            if (cartItems && cartItems.length > 0) {
                let cart = [...cartItems]
                const existingCartItem = cart.find((cartItem) => cartItem.id === item.id && cartItem.color === item.color);
                if (existingCartItem) {
                    const updatedCartItem = { ...existingCartItem, quantity: existingCartItem.quantity + item.quantity };
                    cart = cart.map(cartItem => cartItem === existingCartItem ? updatedCartItem : cartItem);
                } else {
                    cart.push(item)
                }
                if (userData) {
                    // let user = userData
                    const dbCartItems = await appwriteService.updateCart(userData.$id, JSON.stringify(cart))
                    if (dbCartItems) {
                        dispatch(setCart(JSON.parse(dbCartItems.cartProducts)))
                    }
                }

            }
            else {
                if (userData) {
                    // let user = userData
                    const dbCartItems = await appwriteService.addEntryToCart(userData.$id, JSON.stringify([item]))
                    if (dbCartItems) {
                        dispatch(setCart(JSON.parse(dbCartItems.cartProducts)))
                    }
                }
            }
        }
        navigate('/cart')
    }


    return (

        <div className=''>
            <Container>
                <div className='text-lg  '>

                    <button onClick={() => navigate('/products')} className='flex items-center gap-2 bg-gray-200 p-1 px-2 hover:scale-105 transition-all ease-in-out'><MdArrowBack /> <span>Back to Products</span></button>
                </div>
                {product && <div className="flex md:py-16 gap-12 flex-col md:flex-row items-center ">

                    <div className='flex-1'>
                        <img src={product.image} alt={product.name} />
                    </div>
                    <div className='flex-1 flex flex-col gap-4'>
                        <h1 className='text-2xl'>{product.name}</h1>
                        <Star stars={product.rating.rate} reviews={product.rating.count} />
                        <p>MRP: <span className='line-through'>{convertToDecimal(product.price.toString())}</span></p>
                        <p className=' text-purple-600'>Deal of the Day: ₹{getDiscountedPrice(product.price, 10)} </p>
                        <p className='text-sm font-light'>{product.description}</p>
                        <div className='flex gap-4 max-lg:text-xs text-center  border-b-2'>
                            <div className='flex flex-col items-center'>
                                <div className='p-2 rounded-full bg-gray-100'>

                                    <FaTruckFast />
                                </div>
                                <div className='text-sm'>Free Delivery</div>
                            </div>
                            <div className='flex flex-col items-center'>
                                <div className='p-2 rounded-full bg-gray-100'>

                                    <RiRefundFill />
                                </div>
                                <div className='text-sm'>30-Days Replacement</div>
                            </div>
                            <div className='flex flex-col items-center'>
                                <div className='p-2 rounded-full bg-gray-100'>

                                    <BiShieldQuarter />
                                </div>
                                <div className='text-sm'>2 Year Warranty</div>
                            </div>
                            <div className='flex flex-col items-center '>
                                <div className='p-2 rounded-full bg-gray-100'>

                                    <TbReplaceFilled />
                                </div>
                                <div className='text-sm'>Easy Return Policy</div>
                            </div>
                        </div>
                        <div className='text-sm border-b-2 border-black'>
                            <p className='pb-2'><span className='font-light'>Available: </span><span>In Stock</span></p>
                            <p className='pb-2'><span className='font-light'>Brand: </span><span>{product.company}</span></p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div>Color</div>
                            {product.colors.map((item, index) => (
                                <div key={index} onClick={() => setColor(item)} style={{ backgroundColor: item }}
                                    className={`p-2 w-2 h-2 rounded-full flex justify-center items-center text-white text-xs`} >{color === item ? '✔'
                                        : ''}</div>
                            ))}
                        </div>
                        <div className='flex gap-6'>
                            <button className=' hover:scale-150 transition-all ease-in-out' onClick={(e) => setQuantity(quantity > 1 ? quantity - 1 : 1)}>-</button>
                            <span>{quantity}</span>
                            <button className=' hover:scale-150 transition-all ease-in-out' onClick={(e) => setQuantity(quantity + 1)}>+</button>
                        </div>
                        <div>

                            <button onClick={addItemsToCart} className='bg-purple-600 text-white text-sm p-2 rounded hover:scale-105 hover:bg-purple-700 transition-all ease-in-out'>ADD TO CART</button>
                        </div>
                    </div>

                </div>}
            </Container>
        </div>
    )
}

export default ViewProduct