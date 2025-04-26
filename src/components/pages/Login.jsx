import React from 'react'
import { Container, Loader } from '../index'
import { NavLink, useNavigate } from 'react-router-dom'
import authService from '../../appwrite/auth'
import { login as authLogin, setCart } from '../../store/authSlice'
import { useDispatch } from 'react-redux'
import appwriteService from '../../appwrite/cart'

function Login() {
    const [loginEmail, setLoginEmail] = React.useState('')
    const [loginPassword, setLoginPassword] = React.useState('')
    const [error, setError] = React.useState('')
    const [message, setMessage] = React.useState('') // for success messages
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = React.useState(false)
    const [validField, setValidField] = React.useState(true)

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            if (!loginEmail || !loginPassword) {
                setValidField(false)
                return
            }
            setValidField(true)
            setLoading(true)
            const session = await authService.login({ email: loginEmail, password: loginPassword })
            if (session) {
                const userData = await authService.getCurrentuser()
                if (userData) {
                    dispatch(authLogin(userData))
                    localStorage.setItem('cart', "")
                    const cart = await appwriteService.getCart(userData.$id)
                    if (cart) {
                        dispatch(setCart(JSON.parse(cart.cartProducts)))
                    } else {
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

    const handleForgotPassword = async () => {
        if (!loginEmail) {
            setError('Please enter your email to reset password.')
            return
        }

        try {
            setLoading(true)
            setError('')
            setMessage('')

            // Using Appwrite account recovery
            await authService.createRecovery(loginEmail, `${window.location.origin}/reset-password`)
            setMessage('Password reset link has been sent to your email.')
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <Container>
                {loading ? <Loader /> :
                    <div className='flex justify-center py-44 h-screen'>
                        <div className='w-96'>
                            <h1 className='text-2xl font-bold mb-6'>Login</h1>
                            <form className='flex flex-col gap-4 mt-4' onSubmit={handleLogin}>
                                <input
                                    type='email'
                                    placeholder='Email'
                                    className='p-2 border border-gray-300'
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                />
                                <input
                                    type='password'
                                    placeholder='Password'
                                    className='p-2 border border-gray-300'
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                />
                                <button className='bg-purple-600 text-white p-2 rounded hover:scale-105 transition-all duration-300 ease-in-out'>
                                    Login
                                </button>

                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className='text-blue-500 hover:underline text-left'
                                >
                                    Forgot Password?
                                </button>

                                {!validField && <p className='text-red-500'>All fields are required</p>}
                                {error && <p className='text-red-500'>{error}</p>}
                                {message && <p className='text-green-500'>{message}</p>}

                                <NavLink
                                to="/signup"
                                className="text-blue-500 hover:underline cursor-pointer "
                                >
                                Don't have an account? Register
                                </NavLink>

                            </form>
                        </div>
                    </div>
                }
            </Container>
        </div>
    )
}

export default Login
