import { useState } from 'react'
import './App.css'
import Header from './components/Header/Header'
import { Outlet, json } from 'react-router-dom'
import Footer from './components/Footer/Footer'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from './store/authSlice'
import { login, logout } from './store/authSlice'
import authService from './appwrite/auth'
import { setCart, setOrderDetails } from './store/authSlice'
import cartService from './appwrite/cart'


function App() {
  const [loading, setLoading] = useState(true)

  const dispatch = useDispatch()
  const isLoggedIn = useSelector(state => state.status)
  const [userId, setUserId] = useState("")
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
    authService.getCurrentuser()
      .then((userData) => {
        if (userData) {
          setUserId(userData.$id)
          dispatch(login(userData))
        } else {
          dispatch(logout())
        }
      }).catch((e) => {
        console.log("Get Current User Failed" + e.message);
      }).finally(() => {
        setLoading(false)
      })

  }, [])

  useEffect(() => {
    if (isLoggedIn && userId) {
      cartService.getCart(userId).then((cart) => {
        if (cart) {
          dispatch(setCart(JSON.parse(cart.cartProducts)))
        }
        else {
          dispatch(setCart(""))
        }
      }).catch((e) => {
        console.log("Get Cart Failed" + e.message);
      })
    } else {
      let cart = localStorage.getItem('cart')

      if (cart) {
        cart = JSON.parse(cart)


        dispatch(setCart(cart))
      } else {
        dispatch(setCart(""))
      }
    }

  }, [isLoggedIn, userId])

  useEffect(() => {
    if (isLoggedIn && userId) {
      cartService.getUserOrders(userId).then((orders) => {
        if (orders) {
          dispatch(setOrderDetails(orders.documents))
        }
        else {
          dispatch(setOrderDetails(null))
        }
      }).catch((e) => {
        console.log("Get Order Details Failed" + e.message);
      })
    }
  }, [isLoggedIn, userId])


  return !loading ? (

    <div className='min-h-screen flex content-between font-body'>
      <div className='w-full '>
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>

  ) : null
}

export default App
