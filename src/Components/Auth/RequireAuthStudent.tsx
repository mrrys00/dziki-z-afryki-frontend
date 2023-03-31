import React, { Component, useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROLE_STUDENT } from '../../Constants/Auth.d'
import { PATH_AUTH_AUTHENTICATION } from '../../Constants/Paths.d'
import { useAuth } from './AuthProvider'
import Loading from './Loading'

export const RequireAuthStudent = (): JSX.Element => {
    const auth = useAuth()
    const location = useLocation()

    if (!auth.isLoaded) {
        return <Loading />
    }

    if (!auth.user?.role.includes(ROLE_STUDENT)) {
        auth.signout()
        return <Navigate to={ PATH_AUTH_AUTHENTICATION } state={{ from: location }} />
    }

    return <Outlet />
}
