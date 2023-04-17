import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTE_AUTHENTICATION } from '../../Constants/Routes.d'
import { useAuth } from './AuthProvider'

const RequireAuthAny = (): JSX.Element => {
    const auth = useAuth()
    const location = useLocation()

    if (auth.user === null) {
        auth.signout()
        return <Navigate to={ ROUTE_AUTHENTICATION } state={{ from: location }} />
    }

    return <Outlet />
}

export default RequireAuthAny
