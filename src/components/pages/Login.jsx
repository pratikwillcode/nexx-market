import React from 'react'
import {Container, Loader} from '../index'

// import Container from '../container/Container'
import { useNavigate } from 'react-router-dom'
import authService from '../../appwrite/auth'
import { login as authLogin, setCart } from '../../store/authSlice'
import { useDispatch } from 'react-redux'
import appwriteService from '../../appwrite/cart' 
// import Loader from '../Loader'


function Login() {
    
    const [loginEmail, setLoginEmail] = React.useState('')
    const [loginPassword, setLoginPassword] = React.useState('')
    const [error, setError] = React.useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false)
    const [validEmail, setValidEmail] = React.useState(true)
    const [validPassword, setValidPassword] = React.useState(true)
    const [validField, setValidField] = React.useState(true)
    const handleLogin = async (e) => {
    
        e.preventDefault()
        try {
            if(!loginEmail || !loginPassword){
                setValidField(false)
                return
            }
            setValidField(true)
            setLoading(true)
            const session = await authService.login({email:loginEmail, password:loginPassword})
            if (session) {
                const userData = await authService.getCurrentuser()
                if (userData) {
                    dispatch(authLogin(userData))
                    localStorage.setItem('cart', "")
                    const cart = await appwriteService.getCart(userData.$id)
                    if(cart){
                        dispatch(setCart(JSON.parse(cart.cartProducts)))
                    }
                    else{
                        dispatch(setCart(""))
                    }
                    navigate('/')
                }
            }
        } catch (error) {
            setLoading(false)
            setError(error.message)
        }
    }
  return (
    <div>
        <Container>
            {loading ? <Loader />: 
            <div className='flex justify-center py-44  h-screen'>
                <div className='w-96'>
                    <h1 className='text-3xl font-bold'>Login</h1>
                    <form className='flex flex-col gap-4 mt-4' onSubmit={handleLogin}>
                        <input type='email' placeholder='Email' className='p-2 border border-gray-300' value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)} />
                        <input type='password' placeholder='Password' className='p-2 border border-gray-300' value={loginPassword}
                         onChange={(e) => setLoginPassword(e.target.value)}/>
                        <button className='bg-purple-600 text-white p-2 rounded hover:scale-105 transition-all duration-300 ease-in-out'>Login</button>
                        {!validField && <p className='text-red-500'>All fields are required</p>}
                        {error && <p className='text-red-500'>{error}</p>}
                        <button  className='text-blue-500'>Don't have an account? Register</button>
                        
                    </form>
                </div>
            </div>}
        </Container>
    </div>
    
  )
}

export default Login