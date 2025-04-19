import React,{useEffect} from 'react'
// import Container from '../container/Container'
import {Container, Featured, Services, Loader} from '../index'

// import Featured from '../Featured'
// import Services from '../Services'
import { NavLink } from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
// import Loader from '../Loader'
import { setProducts } from '../../store/authSlice'


function Home() {
  const loader = useSelector(state => state.loader)
  const dispatch = useDispatch()
  // useEffect(() => {
  //   try {
  //     fetch('https://fake-products.azurewebsites.net/api/Products').then(res => res.json()).then(products => {
  //       if (products) {
  //         dispatch(setProducts(products))
  //       }
  //     })
  //   } catch (e) {
  //     console.log(e)
  //     console.log("Failed to fetch products")
  //   }
  // }, [])

  useEffect(() => {
    try {
      const localProducts = localStorage.getItem('products');
      if (localProducts) {
        dispatch(setProducts(JSON.parse(localProducts)));
      } else {
        fetch('https://fake-products.azurewebsites.net/api/Products')
          .then(res => res.json())
          .then(products => {
            if (products) {
              dispatch(setProducts(products));
              localStorage.setItem('products', JSON.stringify(products));
            }
          });
      }
    } catch (e) {
      console.log(e);
      console.log("Failed to fetch products");
    }
  }, []);

  return (
    <>
      {loader ? <Loader /> : <div>
        
   
      <Container>
        <div className='flex flex-col'>
          {/* Home Entry */}
          <div className='flex max-md:flex-wrap items-center py-8 gap-2'>
            <div className='w-full md:p-4'>
              <div className='text-xs font-extralight'>WECLOME TO</div>
              <h1 className='text-3xl'>Pratik's Store</h1>
              <p className=' text-xs font-light pb-4'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatem exercitationem nostrum ullam vero architecto optio, mollitia saepe reiciendis aliquid facilis laborum suscipit nihil nulla quam deserunt repellendus earum culpa? Atque!</p>
              <NavLink to='/products' className='p-1 px-2 bg-purple-600 text-white text-sm my-2 rounded-sm'>SHOP NOW</NavLink>
            </div>
            <div className='w-full'>
              <img src='shopping.jpg' />


            </div>
          </div>

        </div>

      </Container>
     
      <Featured />
      <Container>

      <Services />
      </Container>
      </div>}
    </>
  )
}

export default Home