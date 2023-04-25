import React from 'react'
import CourseForm from './CourseForm'
import { Container } from 'react-bootstrap'
import { ROLE_TEACHER } from '../../Constants/Auth.d'
import { useAuth } from '../Auth/AuthProvider'

const Courses: React.FC = () => {
    const auth = useAuth()

    return (
        <Container>
            {auth.user?.role === ROLE_TEACHER && <CourseForm /> }
        </Container>
    )
}

export default Courses
