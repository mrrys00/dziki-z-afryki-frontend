/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { useAuth } from '../../Auth/AuthProvider'
import { ROLE_STUDENT, ROLE_TEACHER } from '../../../Constants/Auth.d'
import CoursePageTeacher from './CoursePageTeacher'
import CoursePageStudent from './CoursePageStudent'
import NotFound from '../../Pages/NotFound/NotFound'

const CoursePage: React.FC = () => {
    const auth = useAuth()

    if (auth.user?.role === ROLE_TEACHER) {
        return (
            <CoursePageTeacher/>
        )
    }

    if (auth.user?.role === ROLE_STUDENT) {
        return (
            <CoursePageStudent/>
        )
    }

    return (
        <NotFound />
    )
}

export default CoursePage
