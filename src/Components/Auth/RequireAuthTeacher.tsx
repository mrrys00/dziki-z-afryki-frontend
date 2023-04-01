import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROLE_TEACHER } from '../../Constants/Auth.d'
import { ROUTE_AUTHENTICATION } from '../../Constants/Routes.d'
import { useAuth } from './AuthProvider'
import Loading from './Loading'

export const RequireAuthTeacher = (): JSX.Element => {
    const auth = useAuth()
    const location = useLocation()

    if (!auth.isLoaded) {
        return <Loading />
    }

    if (auth.user?.role.includes(ROLE_TEACHER)) {
        auth.signout()
        return <Navigate to={ ROUTE_AUTHENTICATION } state={{ from: location }} />
    }

    return <Outlet />
}
