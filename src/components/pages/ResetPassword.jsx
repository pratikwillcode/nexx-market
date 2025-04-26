import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import authService from '../../appwrite/auth'; // adjust path if needed
import { Container, Loader } from '../index'; // or adjust if needed

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const userId = searchParams.get('userId');
    const secret = searchParams.get('secret');

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            setError('All fields are required.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setMessage('');

            await authService.updateRecovery(userId, secret, password, password);
            setMessage('Password updated successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            {loading ? <Loader /> : 
            <div className='flex justify-center py-44 h-screen'>
                <div className='w-96'>
                    <h1 className='text-2xl font-bold mb-6'>Reset Password</h1>
                    <form className='flex flex-col gap-4' onSubmit={handleResetPassword}>
                        <input
                            type='password'
                            placeholder='New Password'
                            className='p-2 border border-gray-300'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            type='password'
                            placeholder='Confirm New Password'
                            className='p-2 border border-gray-300'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button className='bg-purple-600 text-white p-2 rounded hover:scale-105 transition-all duration-300 ease-in-out'>
                            Reset Password
                        </button>
                        {error && <p className='text-red-500'>{error}</p>}
                        {message && <p className='text-green-500'>{message}</p>}
                    </form>
                </div>
            </div>}
        </Container>
    );
}

export default ResetPassword;
