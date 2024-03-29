import React, { Component, useEffect } from 'react'
import { type DecodedUser } from '../../Types/Types'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { JWT } from '../../Constants/Auth.d'

interface AuthContextType {
    user: DecodedUser | null
    signin: (jwt: string, callback?: VoidFunction) => void
    signout: (callback?: VoidFunction) => void
    isLoaded: boolean
}

const AuthContext = React.createContext<AuthContextType>(null!)

export const AuthProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
    const [user, setUser] = React.useState<DecodedUser | null>(null)
    const [isLoaded, setIsLoaded] = React.useState<boolean>(false)

    const signin = (jwt: string, callback?: VoidFunction): void => {
        axios.defaults.headers.common.Authorization = `Bearer ${jwt}`
        localStorage.setItem(JWT, jwt)
        const newUser = jwtDecode<DecodedUser>(jwt)
        setUser(newUser)
        setIsLoaded(true)
        if (callback != null) callback()
    }

    const signout = (callback?: VoidFunction): void => {
        delete axios.defaults.headers.common.Authorization
        localStorage.removeItem(JWT)
        setUser(null)
        setIsLoaded(true)
        if (callback != null) callback()
    }

    useEffect(() => {
        function checkToken (): void {
            const jwt = localStorage.getItem(JWT)
            if (jwt !== null) {
                signin(jwt)
            }
        }

        checkToken()
    }, [])

    const value = { user, isLoaded, signin, signout }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth (): AuthContextType {
    return React.useContext(AuthContext)
}

export const getToken = (): string => {
    return localStorage.getItem(JWT) ?? ''
}
