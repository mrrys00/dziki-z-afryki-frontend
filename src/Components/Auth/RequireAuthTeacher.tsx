import React, { Component, useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROLE_TEACHER } from '../../Constants/Auth.d'
import { PATH_AUTH_AUTHENTICATION } from '../../Constants/Paths.d'
import { useAuth } from './AuthProvider'
import Loading from './Loading'

export const RequireAuthTeacher = (): JSX.Element | React.FC | React.ReactElement => {
    const auth = useAuth()
    const location = useLocation()

    if (!auth.isLoaded) {
        return <Loading />
    }

    if (!(auth.user?.role.includes(ROLE_TEACHER))) {
        auth.signout()
        return <Navigate to={ PATH_AUTH_AUTHENTICATION } state={{ from: location }} />
    }

    return <Outlet />
}
