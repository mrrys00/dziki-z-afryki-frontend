import React, { useState } from 'react'
import { type Course } from '../../../Types/Types'
import axios from 'axios'
import { PATH_COURSE } from '../../../Constants/Paths.d'
import { getToken } from '../../Auth/AuthProvider'
import { Alert, Button, Card, CardGroup, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import CourseFormDate from '../CourseForm/CourseFormDate'
import { ROUTE_COURSES } from '../../../Constants/Routes.d'

const CoursePageTeacher: React.FC<{ course: Course | null }> = ({ course }) => {
    const [showAlert, setShowAlert] = useState(false)
    const [alertMess, setAlertMess] = useState('')
    const navigate = useNavigate()

    const handleDeleteCourse = (): void => {
        axios.delete(
            PATH_COURSE + '/' + course!.courseId, {
                headers:
                    {
                        Authorization: 'Bearer ' + getToken()
                    }
            }).then((resp) => {
            navigate(ROUTE_COURSES)
            return resp
        })
            .catch(error => {
                setShowAlert(true)
                setAlertMess(error.response.data)
            })
    }

    return (
        <Container style={{ marginTop: '1rem' }}>
            <Card>
                <Card.Header>
                    <Card.Title>{course?.name}</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Card.Subtitle>Description</Card.Subtitle>
                    <Card.Text>
                        {course?.description}
                    </Card.Text>
                    <Card.Subtitle>Share code</Card.Subtitle>
                    <Card.Text>{course?.courseId}</Card.Text>
                    <Card.Subtitle>Owner</Card.Subtitle>
                    <Card.Text>{course?.teacher}</Card.Text>
                </Card.Body>
            </Card>
            <CardGroup style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                {course?.dates.map((date, index) => {
                    return (
                        <>
                            <CourseFormDate key={index} date={date}/>
                        </>
                    )
                })
                }
            </CardGroup>
            <CardGroup>
                {course?.students.map((student, index) => {
                    return (
                        <Card key={index} style={{ minWidth: '20%', flexGrow: 0 }}>
                            <Card.Body>
                                <Card.Title>{student.email}</Card.Title>
                            </Card.Body>
                        </Card>
                    )
                })
                }
            </CardGroup>
            <Button variant="danger" onClick={handleDeleteCourse}>Delete course</Button>
            <Alert show={showAlert} variant="danger">
                {alertMess}
            </Alert>
        </Container>
    )
}

export default CoursePageTeacher
