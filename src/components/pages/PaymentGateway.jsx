import React from 'react'
// import Container from './container/Container'
import { useSelector, useDispatch } from 'react-redux'
// import PaymentGatewayCartItems from './PaymentGatewayCartItems';
import appwriteService from '../../appwrite/cart';
import { useNavigate } from 'react-router-dom';
// import Loader from './Loader';
import { setCart } from '../../store/authSlice';
import {Container, Loader, PaymentGatewayCartItems} from '../index'
import { MdArrowBack } from "react-icons/md";


function PaymentGateway() {
    const cartItems = useSelector(state => state.cart)
    const userInfo = useSelector(state => state.userData)
    const [loader, setLoader] = React.useState(false)
    const [subtotal, setSubtotal] = React.useState(0)
    const [cardName, setCardName] = React.useState('')
    const [cardNumber, setCardNumber] = React.useState('')
    const [securityCode, setSecurityCode] = React.useState('')
    const [isCardNumberValid, setIsCardNumberValid] = React.useState(true)
    const [isSecurityCodeValid, setIsSecurityCodeValid] = React.useState(true)
    const [isCarNameValid, setIsCarNameValid] = React.useState(true)
    const [expiryMonth, setExpiryMonth] = React.useState('01 - January')
    const [expiryYear, setExpiryYear] = React.useState('2025')
    const navigate = useNavigate()
    const dispatch = useDispatch()


    React.useEffect(() => {
        let total = 0
        if (cartItems) {

            cartItems.forEach(item => {
                total += item.price * item.quantity
            })
            setSubtotal(total)
        }
    }, [cartItems])

    const convertToDecimal = (str) => {
        if (str.length > 2) {

            return "₹" + str.substring(0, str.length - 2) + "." + str.substring(str.length - 2);
        } else {
            return "₹" + str + ".00"
        }
    }

    const getSubTotal = (shippingFee) => {
        let convertedSubtotal = subtotal.toString().substring(0, subtotal.toString().length - 2)
        return Number(convertedSubtotal) + shippingFee
    }

    const formatCardNumber = (cardNumber) => {
        if (cardNumber) {
            cardNumber = cardNumber.toString().replace(/\s/g, '');
            if (isNaN(cardNumber)) return
            setIsCardNumberValid(true)
            let formattedArray = cardNumber.match(/.{1,4}/g)
            cardNumber = formattedArray.join(' ')
            if (cardNumber.length < 20) {
                setCardNumber(cardNumber)
            }
        }
        else {
            setCardNumber('')
        }
    }

    const formatSecurityCode = (securityCode) => {
        if (isNaN(securityCode)) return
        setIsSecurityCodeValid(true)
        if (securityCode.length < 4) {
            setSecurityCode(securityCode)
        }
    }

    const payNow = async (e) => {
        e.preventDefault()
        try {


            if (cardNumber && isCardNumberValid && securityCode && isSecurityCodeValid && cardName && isCarNameValid) {
                setLoader(true)
                let date = new Date().toISOString()
                const order = await appwriteService.createOrder(userInfo.$id, JSON.stringify(cartItems), date)
                if (order) {
                    await appwriteService.deleteCart(userInfo.$id)
                    dispatch(setCart([]))
                    navigate('/orders')
                }

            } else {
                alert('Please fill in all the fields correctly')
            }
        }
        catch (e) {
            console.log(e.message)
            setLoader(false)
        }
    }


    const validateCardNumber = () => {
        if (cardNumber.length < 19) {
            setIsCardNumberValid(false)
        }
    }

    const validateSecurityCode = () => {
        if (securityCode.length < 3) {
            setIsSecurityCodeValid(false)
        }
    }

    const validateCardName = () => {
        if (cardName.length < 1) {
            setIsCarNameValid(false)
        }
    }

    return (
        <Container>
            {loader ? <Loader /> :
                <div className='flex  gap-4 md:flex-row flex-col'>
                    <div className='flex-1 flex flex-col max-md:px-5'>
                        <div className='text-lg py-3 '>
                        
                            <button onClick={() => navigate('/cart')} className='flex items-center gap-2 p-1 px-2 hover:scale-105 transition-all ease-in-out'><MdArrowBack /> <span>Back to Cart</span></button>
                        </div>
                        <div className='flex flex-col pb-4'>
                            {cartItems &&
                                cartItems.map(item => (
                                    <div className=' py-2' key={item.id}>
                                        <PaymentGatewayCartItems item={item} />
                                    </div>
                                ))
                            }
                        </div>
                        <div className='flex w-full  py-2 '>
                            <div className='flex  flex-col gap-4 bg-gray-100 p-6 text-sm px-8  font-light w-full sm:w-2/3 shadow-lg '>

                                <div className=' border-b-2 border-black pb-3'>
                                    <div className='py-1 flex justify-between'><span className=' '>Subtotal:</span> <span className='font-medium'> {convertToDecimal(subtotal.toString())}</span> </div>
                                    <div className='py-1 flex justify-between'><span className=' '>Shipping Fee:</span> <span className='font-medium'> {convertToDecimal('5')}</span> </div>
                                </div>
                                <div>
                                    <div className='py-1 gap-4 flex justify-between'><span className=''>Order Total :</span> <span className='font-medium'>  {convertToDecimal(getSubTotal(5))}</span></div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className='flex-1 '>


                        <div className="min-w-screen h-screen  flex items-center justify-center px-5 pb-10 pt-16">
                            <div className="w-full mx-auto rounded-lg bg-white drop-shadow-[0_0px_10px_rgba(0,0,0,0.10)] p-5 text-gray-700" style={{ maxwidth: "600px" }}>
                                <div className="w-full pt-1 pb-5">
                                    <div className="bg-indigo-500 text-white overflow-hidden rounded-full w-20 h-20 -mt-16 mx-auto shadow-lg flex justify-center items-center">
                                        <i className="mdi mdi-credit-card-outline text-3xl"></i>
                                    </div>
                                </div>
                                <div className="mb-10">
                                    <h1 className="text-center font-bold text-xl uppercase">Secure payment info</h1>
                                </div>
                                <div className="mb-3 flex -mx-2">
                                    <div className="px-2">
                                        <label htmlFor="type1" className="flex items-center cursor-pointer">
                                            <input type="radio" className="form-radio h-5 w-5 text-indigo-500" name="type" id="type1" defaultChecked />
                                            <img src="https://leadershipmemphis.org/wp-content/uploads/2020/08/780370.png" className="h-6 ml-3" />
                                        </label>
                                    </div>
                                    <div className="px-2">
                                        <label htmlFor="type2" className="flex items-center cursor-pointer">
                                            <input type="radio" className="form-radio h-5 w-5 text-indigo-500" name="type" id="type2" />
                                            <img src="https://www.sketchappsources.com/resources/source-image/PayPalCard.png" className="h-6 ml-3" />
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="font-bold text-sm mb-2 ml-1">Name on card</label>
                                    <div>
                                        <input onBlur={validateCardName} value={cardName}
                                            onChange={(e) => {
                                                setCardName(e.target.value)
                                                if (e.target.value.length > 0) {
                                                    setIsCarNameValid(true)
                                                }
                                            }}
                                            className="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors" placeholder="John Smith" type="text" />
                                        {!cardName && !isCarNameValid && <p className='text-xs text-red-500'>Your card name is incomplete.</p>}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="font-bold text-sm mb-2 ml-1">Card number</label>
                                    <div>
                                        <input onBlur={validateCardNumber} value={cardNumber} onChange={(e) => formatCardNumber(e.target.value)} className="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors" placeholder="0000 0000 0000 0000" type="text" />
                                        {cardNumber && !isCardNumberValid && <p className='text-xs text-red-500'>Your card number is incomplete.</p>}
                                    </div>
                                </div>
                                <div className="mb-3 -mx-2 flex items-end">
                                    <div className="px-2 w-1/2">
                                        <label className="font-bold text-sm mb-2 ml-1">Expiration date</label>
                                        <div>
                                            <select className="form-select w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer" value={expiryMonth} onChange={(e) => setExpiryMonth(e.target.value)}>
                                                <option value="01">01 - January</option>
                                                <option value="02">02 - February</option>
                                                <option value="03">03 - March</option>
                                                <option value="04">04 - April</option>
                                                <option value="05">05 - May</option>
                                                <option value="06">06 - June</option>
                                                <option value="07">07 - July</option>
                                                <option value="08">08 - August</option>
                                                <option value="09">09 - September</option>
                                                <option value="10">10 - October</option>
                                                <option value="11">11 - November</option>
                                                <option value="12">12 - December</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="px-2 w-1/2">
                                        <select className="form-select w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                                            value={expiryYear} onChange={(e) => setExpiryYear(e.target.value)}>

                                            <option value="2025">2025</option>
                                            <option value="2026">2026</option>
                                            <option value="2027">2027</option>
                                            <option value="2028">2028</option>
                                            <option value="2029">2029</option>
                                            <option value="2020">2030</option>
                                            <option value="2021">2031</option>
                                            <option value="2022">2032</option>
                                            <option value="2023">2033</option>
                                            <option value="2024">2034</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-10">
                                    <label className="font-bold text-sm mb-2 ml-1">Security code</label>
                                    <div>
                                        <input onBlur={validateSecurityCode} value={securityCode} onChange={(e) => formatSecurityCode(e.target.value)} className="w-32 px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors" placeholder="000" type="text" />
                                        {securityCode && !isSecurityCodeValid && <p className='text-xs text-red-500'>Your card's security code is incomplete.</p>}

                                    </div>
                                </div>
                                <div>
                                    <button onClick={payNow} className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold"><i className="mdi mdi-lock-outline mr-1"></i> PAY NOW</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-end justify-end fixed bottom-0 right-0 mb-4 mr-4 z-10">
                        <div>
                            <a title="Buy me a beer" href="https://www.buymeacoffee.com/scottwindon" target="_blank" className="block w-16 h-16 rounded-full transition-all shadow hover:shadow-lg transform hover:scale-110 hover:rotate-12">
                                <img className="object-cover object-center w-full h-full rounded-full" src="https://i.pinimg.com/originals/60/fd/e8/60fde811b6be57094e0abc69d9c2622a.jpg" />
                            </a>
                        </div>
                    </div>
                </div>}
        </Container>
    )
}

export default PaymentGateway

{/* <div classNameName='h-screen px-32'>
            {cartItems && <Container>
                <div classNameName='flex'>
                    <div classNameName='flex flex-col flex-1'>
                        <div classNameName='flex flex-col'>
                            <h1>Order Summary</h1>
                            <div classNameName='flex gap-16'>
                                <div classNameName='flex flex-col'>
                                    <p>Subtotal</p>
                                    <p>Shipping</p>
                                    <p>Total</p>
                                    <p>Promotion Applied</p>
                                </div>
                                <div classNameName='flex flex-col'>
                                    <p>$100</p>
                                    <p>$10</p>
                                    <p>$110</p>
                                    <p>$10</p>
                                </div>
                            </div>
                        </div>

                        <div classNameName='flex flex-col pt-8'>
                            <h1 classNameName='p-2'>Cart Items</h1>
                            <div classNameName='flex flex-col'>
                                {cartItems.map(item => (
                                    <div classNameName='flex  w-full  '>
                                        <div classNameName=' flex  border-b-2 gap-4 p-2 '>
                                            <div classNameName=' '>
                                                <img src={item.image} alt={item.name} classNameName='w-12 h-12 rounded-full' />
                                            </div>
                                            <div classNameName='flex flex-col w-32 border-r-2'>
                                                <p>{item.name}</p>
                                                <p>{item.price}</p>
                                            </div>
                                            <div classNameName=' border-r-2 w-8'> x {item.quantity}</div>
                                            <div classNameName='  w-24'>{item.price * item.quantity}</div>

                                        </div>
                                    </div>
                                ))}
                                
                        </div>
                    </div>

                </div>
                <div classNameName="flex flex-col items-center justify-center   py-2 flex-1">
                    <div classNameName="max-w-md w-full space-y-8">
                        <div>
                            <h2 classNameName="mt-6 text-center text-3xl font-extrabold text-gray-900">
                                Payment Details
                            </h2>
                        </div>
                        <form classNameName="mt-8 space-y-6">
                            <input type="hidden" name="remember" value="true" />
                            <div classNameName="rounded-md shadow-sm -space-y-px">
                                <div>
                                    <label htmlFor="card-name" classNameName="sr-only">
                                        Card Holder Name
                                    </label>
                                    <input
                                        id="card-name"
                                        name="card-name"
                                        type="text"
                                        required
                                        classNameName="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Card Holder Name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="card-number" classNameName="sr-only">
                                        Card Number
                                    </label>
                                    <input
                                        id="card-number"
                                        name="card-number"
                                        type="text"
                                        required
                                        classNameName="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Card Number"
                                    />
                                </div>
                                <div classNameName="flex justify-between">
                                    <input
                                        id="expiry-date"
                                        name="expiry-date"
                                        type="text"
                                        required
                                        classNameName="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Expiry Date (MM/YY)"
                                    />
                                    <input
                                        id="cvv"
                                        name="cvv"
                                        type="text"
                                        required
                                        classNameName="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="CVV"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    classNameName="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Pay
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
            </Container>}
        </div > */}
