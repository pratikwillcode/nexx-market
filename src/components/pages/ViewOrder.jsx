import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
// import Container from '../container/Container'
import {Container} from '../index'


function ViewOrder() {
  const { id } = useParams()
  const orders = useSelector(state => state.orderDetails)
  const [order, setOrder] = React.useState(null)
  const [items, setItems] = React.useState(null)
  React.useEffect(() => {
    if (orders) {
      const order = orders.find(order => order.$id === id)
      setOrder(order)
      if (order) {
        setItems(JSON.parse(order.orderDetails))
      }
    }
  }, [orders, id])

  const convertToDecimal = (str) => {
    if (str.length > 2) {

        return "₹" + str.substring(0, str.length - 2) + "." + str.substring(str.length - 2);
    } else {
        return "₹" + str + ".00"
    }
}

const getDate = (date) => {
  date = Date.parse(date)
  date = new Date(date)
  return date.toLocaleDateString('en-IN')
}

const getEstimateDeliveryDate = (date) => {
  date = Date.parse(date)
  date = new Date(date)
  date.setDate(date.getDate() + 7)
  let currentDate = new Date()
  if (currentDate > date) {
      return "Delivered"
  }
  return `Estimate delivery By: ${date.toLocaleDateString('en-IN')}`
}

  return (
    <div>
      <Container>
        {order &&
          <div className='px-8'>
            <div>
              <h1 className=' font-semibold text-xl py-2'>Order ID: {id}</h1>
              <div className='flex gap-8'>

              <h2><span className=' font-light'>Order Date:</span><span className=' font-medium'> {getDate(order.orderDate)}</span></h2>
              <h2 className=' text-green-600 font-medium'> {getEstimateDeliveryDate(order.orderDate)}</h2>
              </div>
            </div>
            <div>
              {items && items.map(item => {
                return (
                  <div key={item.id} className='flex justify-between py-8 border-b-2 flex-col sm:flex-row'>
                    <div className='flex gap-4 flex-col sm:flex-row'>
                      <img className='max-w-56' src={item.image} alt={item.name} />
                      <div className=' flex flex-col justify-center'>
                        <p>{item.name}</p>
                        <p>Price: {convertToDecimal(item.price.toString())}</p>
                        <div className='flex gap-2 items-center'><span>Color:</span><div className='w-2 h-2 p-2 rounded-full' style={{ backgroundColor: item.color }}></div></div>
                        {/* <p>Quantity: {item.quantity}</p>
                      <p>Subtotal: {convertToDecimal((item.price * item.quantity).toString())}</p> */}
                      </div>
                    </div>
                    <div className='flex flex-col justify-center'>

                      <p>Quantity: {item.quantity}</p>
                      <p>Subtotal: {convertToDecimal((item.price * item.quantity).toString())}</p>
                    </div>
                  </div>
                )
              })

              }
            </div>
          </div>
        }
      </Container>
    </div>
  )
}

export default ViewOrder