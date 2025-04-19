import React from 'react'
import { useDispatch } from 'react-redux'
import authService from '../../appwrite/auth'
import { logout, setLoader } from '../../store/authSlice'
import { useNavigate } from 'react-router-dom'
import Loader from '../Loader'


function LogoutBtn() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = React.useState(false)
    const logoutHandler = () => {
        dispatch(setLoader(true))
        authService.logout()
            .then(() => {
                dispatch(logout());
            }).then(() => {
                navigate('/')
                dispatch(setLoader(false))
                window.location.reload()
            })
            .catch((e) => {
                console.log(e)
                setLoading(false)
            })
    }
    return (
        <div>
            
                <button className='max-md:mb-3 md:ml-2 p-2 px-3 bg-purple-600 mt-2 md:mt-0 text-white hover:scale-105 transition-all duration-300 ease-in-out rounded-sm '
                    onClick={logoutHandler}>Logout</button>
        </div>

    )
}

export default LogoutBtn