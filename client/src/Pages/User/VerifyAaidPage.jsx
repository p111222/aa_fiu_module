import React, { useContext, useState } from 'react';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
// import { makeRequest } from '../../Axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { AuthContext } from '../../Context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';

const VerificationPage = () => {
    const [aaId, setAaId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const { user } = useContext(AuthContext);

    const handleAaId = (e) => {
        const aaIdValue = e.target.value;
        setAaId(aaIdValue);
    }

    const handleAaIdSearch = () => {
        const aaIdPattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+$/;
        if (!aaIdPattern.test(aaId)) {
            setError('Invalid AA ID format. Please use the format alphanumeric@alphanumeric.');
            return;
        }

        setError('');
        const reqDate = moment.utc(Date.now()).format('DDMMYYYYHHmmSSS');
        const srcRef = uuidv4();
        const redirectUrl = `${window.location.origin}/user/status`;

        axiosPrivate.post('/redirect/generateredirecturl', { aaId, reqDate, sessionId: user.sessionId, srcRef, redirectUrl })
            .then((res) => {
                window.location.href = res.data.redirectUrl;
            }).catch((error) => {
                console.log(error);
            });
    }

    return (
        <>
            <div className='flex justify-center'>
                <div className='w-1/2'>
                    <div className='flex flex-col gap-1'>
                        <h1 className='text-4xl text-start font-extrabold'>Verify your details</h1>
                        <p className='text-start'>Please enter AAID</p>
                    </div>
                    <div className='flex flex-col gap-2 mt-5 mb-5'>
                        <label className='text-start' htmlFor="aaid">AA ID :</label>
                        <div className='flex items-center gap-2 justify-between mb-2'>
                            <input
                                type="text"
                                id="aaid"
                                style={{
                                    background: '#e7eef3',
                                    padding: '10px',
                                }}
                                placeholder='Enter your AAID'
                                className={`outline-none border-2 text-black-500 rounded-lg w-full focus:ring-0 focus:ring-offset-0 ${error ? 'border-red-500' : 'border-transparent focus:border-blue-500'}`}
                                onChange={handleAaId}
                            />
                            <button onClick={handleAaIdSearch} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl">
                                <ManageSearchIcon />
                            </button>
                        </div>
                        {error && <p className='text-red-500'>{error}</p>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default VerificationPage;
