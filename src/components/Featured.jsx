import React from 'react'
// import Container from './container/Container'
import { useSelector } from 'react-redux'
import Product from './Product'
import {Container} from './index'


function Featured() {
    let products = useSelector(state => state.products)
    const [loading, setLoading] = React.useState(true)
    const timeout = setTimeout(() => {
        setLoading(false)
    }
    , 1000)
    
    if (products) {
        products = products.filter(product => product.featured === true)
    }
    return (
        <div className='bg-gray-100'>
            <Container>
                {!loading ?
                    <div>
                        <h3 className='text-xs font-light'>CHECK NOW!</h3>
                        <h1 className='text-xl font-medium mb-8'>Our Featured Services</h1>
                        <div className='image-container flex justify-between gap-10 max-lg:flex-wrap'>
                            {products && products.map((product, index) => (
                                <Product key={index} {...product} />
                            ))}
                        </div>
                    </div> :
                    <div className=' flex justify-center items-center'>
                        <div
                            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                            role="status">
                            <span
                                className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                            >Loading...
                            </span>
                        </div>
                        <div>
                            Loading
                        </div>
                    </div>


                }
            </Container>
        </div>

    )
}

export default Featured