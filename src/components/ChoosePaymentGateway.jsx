import React from 'react'
// import Container from './container/Container'
import {Container} from './index'


function ChoosePaymentGateway() {
  return (
    <div>
        <Container>
            <div>
                <h1 className='text-3xl font-semibold text-center py-8'>Choose Payment Gateway</h1>
                <div className='flex justify-center gap-8'>
                    <button className='bg-blue-500 text-white px-4 py-2 rounded-sm'>Pay with Stripe</button>
                    <button className='bg-green-500 text-white px-4 py-2 rounded-sm'>Pay with Razorpay</button>
                </div>
            </div>
        </Container>
    </div>
  )
}

export default ChoosePaymentGateway