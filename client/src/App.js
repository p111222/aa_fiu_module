import React, { useState, useEffect, useContext } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './Pages/Auth/LoginPage';
import NotFound from './Pages/Error/NotFound';
import LandingPage from './Pages/Common/LandingPage';
import FiuLayout from './Layout/FiuLayout.jsx';
import VerifyAaidPage from './Pages/User/VerifyAaidPage.jsx';
import StatusPage from './Pages/User/StatusPage.jsx'
// import { makeRequest } from './Axios.js';
import { AuthContext } from './Context/AuthContext';
import useAxiosPrivate from './Hooks/useAxiosPrivate.js';
// import {axiosPrivate}  from "./Axios";
const App = () => {

  const { user, setUser, sessionValidity, setSessionValidity, setAccessToken } = useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const sessionResponse = await axiosPrivate.get('/api/auth/check-session');
        console.log("sessionResponse.data.valid"+sessionResponse.data);
        setSessionValidity(sessionResponse.data)
        const regenerateTokenResponse = await axiosPrivate.get('/api/auth/regenerate-accesstoken');
        console.log("regenerateTokenResponse.data"+regenerateTokenResponse.data);
        setAccessToken(regenerateTokenResponse.data);
        const userResponse = await axiosPrivate.get('/api/auth/logged-in-user');
        console.log("userResponse.data"+userResponse.data.id);
        // const userResponse = await axiosPrivate.get('/auth/get-loggedin-user');
        setUser(userResponse.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, [user, setUser]);

  console.log("user"+user);
  

  useEffect(() => {
    if (sessionValidity === "invalid" && window.location.href.includes("user")) {
      setShowModal(true)
    } else {
      setShowModal(false)
    }
  }, [sessionValidity])

  const handleLogout = () => {
    axiosPrivate.post('/api/auth/logout')
      .then((res) => {
        console.log("Logged Out");
        window.location.href = '/login';
      }).catch((error) => {
        console.log(error)
      })
  }

  // useEffect(() => {
  //   const handleBeforeUnload = () => {
  //     makeRequest.get('/auth/logout')
  //       .then(() => {
  //         // Optional: You might want to perform some cleanup or additional actions before the page is unloaded
  //       });
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []);

  // useEffect(() => {
  //   const handleBackButton = () => {
  //     makeRequest.get('/auth/logout')
  //       .then(() => {
  //         window.location.reload()
  //       })
  //   };

  //   window.addEventListener('popstate', handleBackButton);

  //   return () => {
  //     window.removeEventListener('popstate', handleBackButton);
  //   };
  // }, []);

  const ProtectedRoute = ({ children, layout: Layout }) => {
    if (loading) {
      return null;
    }

    if (!user) {
      return <Navigate to="/login" />;
    }

    if (user && Layout === FiuLayout) {
      return children
    }

    else {
      return <Navigate to="/login" />;
    }
  };

  const router = createBrowserRouter([
    {
      path: '/user',
      element: (
        <ProtectedRoute layout={FiuLayout}>
          <FiuLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: '/user/verifyaaid',
          element: <VerifyAaidPage />,
        },
        {
          path: '/user/status',
          element: <StatusPage />,
        },
      ],
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/',
      element: <LandingPage />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);

  if (showModal == true) {
    return (
      <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Session Expired</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Your session has expired. Please login again to continue.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  onClick={handleLogout}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  )
}

export default App