import React, { useEffect, useState } from 'react'
import CourseForm from './CourseForm/CourseForm'
import { Card, CardGroup, Container } from 'react-bootstrap'
import { ROLE_STUDENT, ROLE_TEACHER } from '../../Constants/Auth.d'
import { getToken, useAuth } from '../Auth/AuthProvider'
import { type Course } from '../../Types/Types'
import axios from 'axios'
import { PATH_COURSE } from '../../Constants/Paths.d'
import { Link } from 'react-router-dom'
import { ROUTE_COURSES } from '../../Constants/Routes.d'
import CourseEnroll from './CourseEnroll'

const Courses: React.FC = () => {
    const auth = useAuth()
    const [courses, setCourses] = useState<Course[]>([])
    const [reloadCourses, setReloadCourses] = useState<boolean>(false)

    useEffect(() => {
        axios.get(
            PATH_COURSE,
            {
                headers:
                    {
                        Authorization: 'Bearer ' + getToken()
                    }
            }).then(resp => {
            setCourses(resp.data)
        }).catch(error => {
            return error
        })
    }, [reloadCourses])

    return (
        <Container style={{ marginTop: '1rem' }}>
            {(auth.user?.role === ROLE_TEACHER || auth.user?.role === ROLE_STUDENT) &&
                <CardGroup>
                    {courses.map((course, index) => {
                        return (
                            <Card as={Link} to={ROUTE_COURSES + '/' + course.courseId} key={index}
                                style={{ minWidth: '20%', flexGrow: 0 }}>
                                <Card.Header>
                                    <Card.Title>{course.name}</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <Card.Text>{course.description}</Card.Text>
                                </Card.Body>
                            </Card>
                        )
                    })}
                </CardGroup>
            }
            {auth.user?.role === ROLE_STUDENT &&
                <CourseEnroll setReloadCourse={setReloadCourses} />}
            {auth.user?.role === ROLE_TEACHER &&
                <CourseForm setReloadCourse={setReloadCourses} /> }
        </Container>
    )
}

export default Courses
