import React, { useState, createContext, useEffect } from 'react'

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [aaId, setAaId] = useState(null)
    const [accessToken, setAccessToken] = useState(null)
    const [sessionValidity, setSessionValidity] = useState(null);

    return (
        <AuthContext.Provider value={{ user, setUser, accessToken, setAccessToken, sessionValidity, setSessionValidity, aaId, setAaId }}>
            {children}
        </AuthContext.Provider>
    )
}
