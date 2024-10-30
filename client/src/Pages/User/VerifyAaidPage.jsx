import React, { useContext, useState } from 'react';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
// import { makeRequest } from '../../Axios';
import { useNavigate } from 'react-router-dom';
// import moment from 'moment';
import moment from 'moment-timezone';
import { AuthContext } from '../../Context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';
import qs from 'qs';
import { Buffer } from 'buffer';

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
        // const reqdate = moment.utc().format('DDMMYYYYHHmmss');
        const txnid = uuidv4();
        const srcRef = "113d4b92-13e4-4452-82d7-b420410e2897";
        const redirectUrl = `${window.location.origin}/user/status`;
        // console.log("reqdate: " + reqdate);
    
        const requestorType = "FIU"; 
        const fipid = "fid1";
        const email = "user@example.com";
        const dob = "01011990";
        const pan = "BLOPJ9807C";
      
        // axiosPrivate.post('http://localhost:8080/api/redirect/generateredirecturl',
        axiosPrivate.post('http://43.204.108.73:8344/api/redirect/generateredirecturl',
            qs.stringify({
                aaId,
                // reqdate,
                sessionId: user.sessionId,
                txnid,
                srcRef,
                redirectUrl,
                requestorType,
                fipid,
                email,
                dob,
                pan
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        )
            .then((res) => {
                const redirectUrl = res.data.redirectUrl;
                console.log("redirectUrl"+redirectUrl);
                
                const url = new URL(redirectUrl);
    
                const fi = url.searchParams.get('fi');
                const reqdate = url.searchParams.get('reqdate');
                const ecreq = url.searchParams.get('ecreq');
                // const requestorType = url.searchParams.get('requestorType');
    
                console.log("fi: " + fi);
                console.log("ecreq: " + ecreq);
                console.log("requestorType: " + requestorType);
    
                const encodedEcreq = encodeURIComponent(ecreq);
                console.log("encodedEcreq: " + encodedEcreq);
    
                // Construct the final redirect URL conditionally
                let finalRedirectUrl = `${url.origin}${url.pathname}?fi=${fi}&reqdate=${reqdate}&ecreq=${encodedEcreq}`;
    
                // Append requestorType only if it has a value
                // if (requestorType) {
                    // const encodedRequestorType = encodeURIComponent(requestorType);
                    // finalRedirectUrl += `&requestorType=${encodedRequestorType}`;
                    // finalRedirectUrl += `&requestorType=${requestorType}`;
                // }
    
                console.log("finalRedirectUrl: " + finalRedirectUrl);
                window.location.href = finalRedirectUrl;
                // window.location.href = res.data.redirectUrl;
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
