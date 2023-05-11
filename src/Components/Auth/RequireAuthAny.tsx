import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTE_AUTHENTICATION } from '../../Constants/Routes.d'
import { useAuth } from './AuthProvider'
import Loading from './Loading'
import { ROLE_STUDENT, ROLE_TEACHER } from '../../Constants/Auth.d'

const RequireAuthAny = (): JSX.Element => {
    const auth = useAuth()
    const location = useLocation()

    if (!auth.isLoaded) {
        return <Loading />
    }

    if (!(auth.user?.role === ROLE_STUDENT || auth.user?.role === ROLE_TEACHER)) {
        auth.signout()
        return <Navigate to={ ROUTE_AUTHENTICATION } state={{ from: location }} />
    }

    return <Outlet />
}

export default RequireAuthAny
