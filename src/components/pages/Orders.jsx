import React, { useEffect } from 'react'
// import Container from '../container/Container'
import appwriteService from '../../appwrite/cart'
import { useSelector, useDispatch } from 'react-redux'
import {setOrderDetails} from '../../store/authSlice'
import { useNavigate, Link } from 'react-router-dom'
import {Container} from '../index'


function Orders() {
    const userInfo = useSelector(state => state.userData)
    const [orders, setOrders] = React.useState(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {

        
        if (userInfo) {
            appwriteService.getUserOrders(userInfo.$id).then((orders) => {
                if (orders) {
                    dispatch(setOrderDetails(orders.documents))

                    setOrders(orders.documents)
                }
            })
        }
    }, [])


    const convertToDecimal = (str) => {
        if (str.length > 2) {

            return "₹" + str.substring(0, str.length - 2) + "." + str.substring(str.length - 2);
        } else {
            return "₹" + str + ".00"
        }
    }

    const getTotal = (orderDetails) => {
        const orderTotal = JSON.parse(orderDetails).reduce((acc, item) => acc + item.price * item.quantity, 0)
        return convertToDecimal(orderTotal.toString())
    }

    const getTotalItemsCount = (orderDetails) => {
        return JSON.parse(orderDetails).reduce((acc, item) => acc + item.quantity, 0)
    }

    const getDate = (date) => {
        date = Date.parse(date)
        date = new Date(date)
        return date.toLocaleDateString('en-IN')
    }

    const handleViewOrder = (order) => {
        navigate(`/order/${order.$id}`)
    }

    const checkDeliveryStatus = (date) => {
        date = Date.parse(date)
        date = new Date(date)
        date.setDate(date.getDate() + 7)
        let currentDate = new Date()
        if (currentDate > date) {
            return "Delivered"
        }
        return `Order Processing`
      }

    return (
        <div>
            <Container>
                <div className='px-4 pb-8'>
                    <h1 className='text-2xl '>Your Orders History</h1>
                    { orders && orders.length > 0 ? <div className='py-6 md:block hidden'>
                        <table className='w-full '>
                            <thead className=' text-left border-b-2'>
                                <tr className='text-md'>
                                    <th className='font-light px-2'>Order ID</th>
                                    <th className='font-light'>Items</th>
                                    <th className='font-light'>Order Placed Date</th>
                                    <th className='font-light'>Order Total</th>
                                    <th className='font-light'>Order Status</th>

                                </tr>
                            </thead>
                            <tbody>
                                {orders && orders.map(order => {
                                    return (
                                        <tr onClick={(e)=>handleViewOrder(order)}  key={order.$id} className=' cursor-pointer font-light text-sm hover:bg-gray-100 transition-all duration-300 ease-in-out border-b-2'>
                                            <td className='py-4 px-2 font-medium'>#{order.$id}</td>
                                            <td className=''>{getTotalItemsCount(order.orderDetails) + ' items'}</td>
                                            <td>{getDate(order.orderDate)}</td>
                                            <td className='pl-1'>{getTotal(order.orderDetails)}</td>
                                            <td className=' text-green-600 font-normal'>{checkDeliveryStatus(order.orderDate)}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div> : 
                    <div className='py-6 flex flex-col gap-2  border-t-2'>
                        <h1 className='text-xl font-light'>No Orders Found</h1>
                        <div>
                        <Link to='/products' className='bg-purple-600 text-white p-1'>Shop Now</Link>
                        </div>
                        </div>
                    }
                    <div className='py-6 hidden max-md:block '>
                        {orders && orders.map(order => {
                            return (
                                <div key={order.$id} className='py-4 border-b-2 '>
                                        <div className='flex gap-1 flex-col    justify-between'>
                                            <h3 className=''><span className=' font-semibold text-xl'>Order ID:</span> #{order.$id}</h3>
                                            <h3 className=''><span className=' font-semibold '>Order Date:</span> {getDate(order.orderDate)}</h3>


                                            <h3 className=''><span className=' font-semibold '>Items:</span> {getTotalItemsCount(order.orderDetails) + ' items'}</h3>
                                            <h3 className=''><span className=' font-semibold '>Order Total:</span> {getTotal(order.orderDetails)}</h3>

                                            <h3 className=''><span className=' font-semibold'>Order Status:</span> <span className=' text-green-600'>{checkDeliveryStatus(order.orderDate)}</span></h3>
                                            <div className='py-2' onClick={(e)=>handleViewOrder(order)}>
                                                    <button className=' bg-purple-600 text-white px-2 py-1'>View</button>
                                            </div>
                                        </div>
                                    </div>
                            )
                        })}
                    </div>

                </div>
            </Container>
        </div>
    )
}

export default Orders