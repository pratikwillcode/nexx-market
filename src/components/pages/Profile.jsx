import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import appwriteService from '../../appwrite/cart';
import { AiOutlineCloudUpload } from 'react-icons/ai'
// import Container from '../container/Container';
import authService from '../../appwrite/auth';
import { login } from '../../store/authSlice';
// import Loader from '../Loader';
import {Container, Loader} from '../index'



function Profile() {
    const user = useSelector(state => state.userData)
    const [profile, setProfile] = useState(null)
    const [profilePicture, setProfilePicture] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNo, setPhoneNo] = useState('')
    const [address, setAddress] = useState('')
    const [addressOverflow, setAddressOverflow] = useState(false)
    const [loading, setLoading] = useState(false)
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [inValidPassword, setInValidPassword] = useState(false)
    const [notMatchingPassword, setNotMatchingPassword] = useState(false)
    const [invalidNewPasswordLength, setInvalidNewPasswordLength] = useState(false)
    const [incorrectOldPassword, setIncorrectOldPassword] = useState(false)
    const [ShowNotification, setShowNotification] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState('')
    const [invalidPhoneNo, setInvalidPhoneNo] = useState(false)

    const dispatch = useDispatch()
    useEffect(() => {
        const fetchProfile = async () => {
            const Response = await appwriteService.getProfile(user.$id)
            if (Response) {
                setProfile(Response)
                setName(Response.name)
                setEmail(Response.email)
                setPhoneNo(Response.phoneNo)
                setAddress(Response.address)
                setProfilePicture(Response.profilePicture)

            }
        }
        if (user) {
            console.log(user)

            fetchProfile()
        }
    }, [])

    const handleChange = (e) => {
        const file = e.target.files[0]
        setProfilePicture(URL.createObjectURL(file))
        appwriteService.uploadFile(file).then((res) => {
            setProfilePicture(res.$id)
        }).catch((error) => {
            console.log("Upload Profile Picture Error", error)
        })
    }

    const uploadNewImage = () => {
        document.querySelector('input[type="file"]').click()
    }



    //   const updateProfile = () => {
    const data = {
        name,
        email,
        phoneNo,
        address,
        profilePicture
    }


    const updateProfile = async () => {
        try {
            if (phoneNo.length !== 10) {
                setInvalidPhoneNo(true)
                return
            }
            setInvalidPhoneNo(false)
            setLoading(true)
            const profile = await appwriteService.updateProfile(user.$id, data)
            if (profile) {
                const account = await authService.updateAccountName(name)
                dispatch(login(account))
            }
            setLoading(false)
            setNotificationMessage('Profile Updated Successfully')
            setShowNotification(true)
        } catch (error) {
            setLoading(false)
            console.log("Update Profile Error", error)
        }
    }

    const handlePasswordChange = (e) => {
        e.preventDefault()
        if (oldPassword === '' || newPassword === '' || confirmPassword === '') {
            setInValidPassword(true)
        } else if (newPassword !== confirmPassword) {
            setInValidPassword(false)
            setNotMatchingPassword(true)
        }
        else if (newPassword.length < 8 || confirmPassword.length < 8) {
            setInValidPassword(false)
            setNotMatchingPassword(false)
            setInvalidNewPasswordLength(true)
        }
        else if (oldPassword.length < 8) {
            setInValidPassword(false)
            setNotMatchingPassword(false)
            setInvalidNewPasswordLength(false)
            setIncorrectOldPassword(true)
        }
        else {
            setLoading(true)
            setInValidPassword(false)
            setNotMatchingPassword(false)
            setInvalidNewPasswordLength(false)

            authService.updatePassword(newPassword, oldPassword).then((res) => {
                setIncorrectOldPassword(false)
                setLoading(false)
                setNotificationMessage('Password Updated Successfully')
                setShowNotification(true)
            }).catch((error) => {
                setLoading(false)
                setIncorrectOldPassword(true)
            })
        }
    }

    return (
        <div>           
            {loading &&<Loader /> }
                <Container>


                    {profile &&
                        <div className={` lg:px-24 lg:p-8 flex gap-16 flex-col md:flex-row max-md:justify-center max-md:items-center ${loading ? 'hidden': ''} `}>
                            <div className='lg:w-1/6 md:w-1/6 sm:w-2/6 max-sm:w-3/6 py-4'>
                                {/* <img className=' rounded-full border-2' src={`${profileDetails.profilePicture ? profileDetails.profilePicture : 'default-profile.jpg'}`} alt='' /> */}
                                <div className='relative'>

                                    <img className=' rounded-full border-2 shadow-md' src={profilePicture ? appwriteService.getFilePreviewUrl(profilePicture) : 'image.png'} alt='' />
                                    <div onClick={uploadNewImage} className=' absolute bottom-0 right-0 bg-white rounded-full p-3 text-2xl z-10 border-2 shadow-lg'>
                                        <AiOutlineCloudUpload />
                                    </div>
                                </div>
                                <input className='hidden' type='file' onChange={(e) => handleChange(e)} />
                                <div className=' flex flex-col justify-center items-center'>
                                    <h1>{name}</h1>
                                    <p> {email}</p>
                                </div>

                            </div>
                            <div>
                                <h1 className='py-4'>Profile Settings</h1>
                                <div className=' flex flex-col gap-4'>
                                    <div className=' flex flex-col'>


                                        <label className=' text-xs font-bold'>Full Name</label>
                                        <input className=' border-2 p-1 rounded-md' type='text' maxLength={15} value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <div className=' flex flex-col'>
                                        <label className=' text-xs font-bold'>Email</label>
                                        {/* <input className=' border-2 p-1' type='text' value={email} onChange={(e) => setEmail(e.target.value)} /> */}
                                        <input className='  p-1 border-none rounded-md' type='text' value={email} readOnly />
                                    </div>
                                    <div className=' flex flex-col'>
                                        <label className=' text-xs font-bold'>Contact No.</label>
                                        {/* <input className=' border-2 p-1' type='text' value={email} onChange={(e) => setEmail(e.target.value)} /> */}
                                        <input className='  p-1 border-2 rounded-md' type='text' value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} />
                                        {invalidPhoneNo && <span className='text-xs text-red-600 px-1 font-semibold'>Phone number should be 10 digits long.</span>}
                                    </div>
                                    <div className=' flex flex-col'>
                                        <label className=' text-xs font-bold'>Address</label>
                                        {/* <input className='  p-1 border-2' type='text' value={address} onChange={(e) => setAddress(e.target.value)} /> */}

                                        <div className="relative mb-3 border-2 rounded-md" data-twe-input-wrapper-init
                                        >
                                            <textarea
                                                //   onSelect={setAddressOverflow('')}
                                                onFocus={() => setAddressOverflow(true)}
                                                onBlur={() => setAddressOverflow(false)}
                                                className={`peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:peer-focus:text-primary [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0 ${addressOverflow ? ' overflow-visible' : 'overflow-hidden'} `}
                                                id="exampleFormControlTextarea1"
                                                rows="2"
                                                placeholder="Your message"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                            >

                                            </textarea>

                                        </div>
                                    </div>


                                </div>
                                <div className=' py-4 '>
                                    <button onClick={updateProfile} className=' hover:bg-blue-600 hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer bg-blue-500 text-white p-2 rounded-md '>Update Profile</button>
                                    {/* <button onClick={() => setUpdatePassword(true)} className=' hover:bg-red-600 hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer bg-red-500 text-white p-2 rounded-md '>Update Password</button> */}
                                </div>
                            </div>
                            <div>
                                <h1 className='py-4'>Update Password</h1>
                                <div className=' flex flex-col gap-4'>
                                    <div className=' flex flex-col'>
                                        <label className=' text-xs font-bold '>Old Password</label>
                                        <input className=' border-2 p-1' type='password' value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                                    </div>
                                    <div className=' flex flex-col'>
                                        <label className=' text-xs font-bold '>New Password</label>
                                        <input className=' border-2 p-1' type='password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                    </div>
                                    <div className=' flex flex-col'>
                                        <label className=' text-xs font-bold '>Confirm Password</label>
                                        <input className=' border-2 p-1' type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                    </div>
                                    <div className=' py-4 flex flex-col gap-2'>
                                        {/* <button className=' hover:bg-blue-600 hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer bg-blue-500 text-white p-2 rounded-md '>Update Password</button> */}
                                        <button onClick={(e) => handlePasswordChange(e)} className=' hover:bg-red-600 hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer bg-red-500 text-white p-2 rounded-md '>Update Password</button>
                                        {inValidPassword && <span className='text-xs text-red-600 px-1 font-semibold'>All the fields are mandatory.</span>}
                                        {notMatchingPassword && <span className='text-xs text-red-600 px-1 font-semibold'>New password does not match.</span>}
                                        {invalidNewPasswordLength && <span className='text-xs text-red-600 px-1 font-semibold'> password should be atleast 8 characters long.</span>}
                                        {incorrectOldPassword && <span className='text-xs text-red-600 px-1 font-semibold'>Entered Old Password is incorrect.</span>}

                                    </div>




                                </div>

                            </div>

                        </div>}
                    <div className={`${ShowNotification ? 'fixed top-0 bottom-0 left-0 right-0 w-full h-screen z-50' : 'hidden'}`}>
                        <div onClick={(e) => {
                            setShowNotification(false)
                        }} className='bg-gray-800 bg-opacity-80  h-full flex justify-center items-center flex-col'>
                            
                                <div id="toast-success" className="flex items-center w-full max-w-sm p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
                                    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                        </svg>
                                        <span className="sr-only">Check icon</span>
                                    </div>
                                    <div className="ms-3 text-sm font-normal">{notificationMessage}</div>
                                    <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-success" aria-label="Close">
                                        <span className="sr-only">Close</span>
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                    </button>
                                </div>
                            

                        </div>
                    </div>





                </Container>
            
        </div>
    )
}

export default Profile