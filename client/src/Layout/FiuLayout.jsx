import React from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
// import { makeRequest } from '../Axios';
import useAxiosPrivate from '../Hooks/useAxiosPrivate';

const FiuLayout = () => {

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const handleLogout = () => {
        axiosPrivate.get('/auth/logout')
            .then((res) => {
                console.log("Logged Out");
                window.location.reload();
            }).catch((error) => {
                console.log(error)
            })
    }

    return (
        <div>
            <div className='bg-neutral-50 w-full shadow-md fixed py-4 px-20'>
                <div className="flex items-center justify-between">
                    <div className='flex items-center gap-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z" />
                        </svg>
                        <span className='font-bold'>FIU</span>
                    </div>

                    <div className='cursor-pointer flex items-center gap-1'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                        </svg>
                        <span onClick={handleLogout}>Logout</span>
                    </div>
                </div>
            </div>
            <main className='pt-20' style={{ background: '#fafbfd', minHeight: '100vh' }}>
                <Outlet />
            </main>
        </div >
    )
}


export default FiuLayout