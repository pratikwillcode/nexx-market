import React from 'react'
// import Container from '../container/Container'
import authService from '../../appwrite/auth'
import { useNavigate } from 'react-router-dom'
import { login } from '../../store/authSlice'
import { useDispatch } from 'react-redux'
import appwriteService from '../../appwrite/cart'
// import Loader from '../Loader'
import {Container, Loader} from '../index'



function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [name, setName] = React.useState('')
    const [error, setError] = React.useState('')
    const dispatch = useDispatch()
    const [loading, setLoading] = React.useState(false)
    const [validEmail, setValidEmail] = React.useState(true)
    const [validPassword, setValidPassword] = React.useState(true)
    const [validName, setValidName] = React.useState(true)
    const [validField, setValidField] = React.useState(true)

    const validateEmailFormat = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    const validatePassword = (password) => {
        return password.length > 6
    }

 

    const handleRegister = async (e) => {

        e.preventDefault()
        try {
            if(!name || !email || !password){
                setValidField(false)
                return
            }
            setValidField(true)
            if(!validateEmailFormat(email)){
                setValidEmail(false)
                return
            }
            setValidEmail(true)
            if(!name){
                setValidName(false)
                return
            }
            setValidName(true)
            if(!validatePassword(password)){
                setValidPassword(false)
                return
            }
            setValidPassword(true)
            setLoading(true)
            const user = await authService.createAccount({ email, password, name })
            if (user) {
                const userData = await authService.getCurrentuser()
                console.log('User created successfully')
                if (userData) {
                    const createProfile = await appwriteService.createProfile(userData.$id, {
                        name: userData.name,
                        email: userData.email
                    })
                    dispatch(login(userData));

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
                        <h1 className='text-3xl font-bold'>Register</h1>
                        <form className='flex flex-col gap-4 mt-4' onSubmit={handleRegister} >
                            <input type='text' placeholder='Name' className='p-2 border border-gray-300'
                                value={name} onChange={(e) => { setName(e.target.value) }} />
                                {!validName ? <p className='text-red-500'>Name is required</p> : null}
                            <input type='email' placeholder='Email' className='p-2 border border-gray-300' value={email}
                                onChange={(e) => setEmail(e.target.value)} />
                                {!validEmail && <p className='text-red-500'>Email is invalid</p>}

                            <input type='password' placeholder='Password' className='p-2 border border-gray-300' value={password} onChange={(e) => setPassword(e.target.value)} />
                            {!validPassword ? <p className='text-red-500'>Password length should be more than 6</p> : null}
                            <button onClick={handleRegister} className='bg-purple-600 text-white p-2 rounded hover:scale-105 transition-all duration-300 ease-in-out'>Register</button>
                            {!validField && <p className='text-red-500'>All fields are required</p>}
                        </form>
                    </div>
                </div>}
            </Container>
        </div>
    )
}

export default Register