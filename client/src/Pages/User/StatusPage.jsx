import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
// import { makeRequest } from '../../Axios';
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';
import moment from 'moment'
import { AuthContext } from '../../Context/AuthContext';
// import { View, Text, StyleSheet } from 'react-native';
// import { Divider } from 'react-native-paper';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const StatusPage = () => {
    const [searchParams] = useSearchParams();
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(true)
    const { user } = useContext(AuthContext)
    const axiosPrivate = useAxiosPrivate();
    const fi = searchParams.get('fi');
    const resdate = searchParams.get('resdate');
    const ecres = searchParams.get('ecres');

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await axiosPrivate.post('/api/redirect/showresult', { fi, resdate, ecres });
                if (res.status === 200) {
                    setResult(res.data.result)
                }
            } catch (error) {
                console.error('Error fetching status:', error);
            } finally {
                setLoading(false)
            }
        };

        fetchStatus();
    }, []);

    const handleLogout = () => {
        axiosPrivate.get('/auth/logout')
            .then((res) => {
                window.location.reload();
            }).catch((error) => {
                console.log(error)
            })
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen translate-y-[-5em]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    // if ((result && result.sessionid) !== (user && user.sessionId)) {
    //     return (
    //         <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    //             <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
    //             <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
    //                 <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
    //                     <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
    //                         <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
    //                             <div className="sm:flex sm:items-start">
    //                                 <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
    //                                     <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
    //                                         <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    //                                     </svg>
    //                                 </div>
    //                                 <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
    //                                     <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Session Expired</h3>
    //                                     <div className="mt-2">
    //                                         <p className="text-sm text-gray-500">Your session has expired. Please login again to continue.</p>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                         <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
    //                             <button
    //                                 type="button"
    //                                 className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
    //                                 onClick={handleLogout}
    //                             >
    //                                 Login
    //                             </button>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     )
    // }

    return (
        <>
            {/* <div className='flex items-center justify-center h-screen'>
                <div className='flex flex-col w-[20em] bg-gray-100 p-4 gap-2 rounded-lg translate-y-[-5em]'>
                    <div className='flex items-center '>
                        <p className='w-[8em] text-start font-semibold'>FI</p>
                        <span>:</span>
                        <p className='ms-2'>{result.fi}</p>
                    </div>
                    <hr />
                    <div className='flex items-center'>
                        <p className='w-[8em] text-start font-semibold'>Status</p>
                        <span>:</span>
                        <p className='ms-2'>{result.status === "S" ? "Success" : "Failure"}</p>
                    </div>
                    <hr />
                    <div className='flex items-center'>
                        <p className='w-[8em] text-start font-semibold'>Response Date</p>
                        <span>:</span>
                        <p className='ms-2'>{moment(parseInt(resdate, 10)).format('DD/MM/YYYY')}</p>
                    </div>
                    <hr />
                    <div className='flex items-center'>
                        <p className='w-[8em] text-start font-semibold'>Transaction Id</p>
                        <span>:</span>
                        <p className='ms-2'>{`${result.txnid.substring(0, 8)}...`}</p>
                    </div>
                </div>
            </div> */}

            <TableContainer component={Paper} className="w-[20em] mx-auto mt-10">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" colSpan={2} style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                                Result Details
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell style={{ fontWeight: 'bold', width: '50%' }}>FI</TableCell>
                            <TableCell>{result.fi}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell>{result.status === "S" ? "Success" : "Failure"}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>Response Date</TableCell>
                            <TableCell>{moment(parseInt(resdate, 10)).format('DD/MM/YYYY')}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>Transaction Id</TableCell>
                            <TableCell>{`${result.txnid.substring(0, 8)}...`}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
};

export default StatusPage;
