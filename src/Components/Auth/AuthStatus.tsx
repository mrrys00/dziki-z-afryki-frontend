import React, { Component } from 'react'
import { useAuth } from './AuthProvider'

const AuthStatus: React.FC = () => {
    const auth = useAuth()

    if (auth.user === null) {
        return <p>You are not logged in.</p>
    }

    return (
        <p>
            Welcome {auth.user.email}!{' '}
        </p>
    )
}

export default AuthStatus
