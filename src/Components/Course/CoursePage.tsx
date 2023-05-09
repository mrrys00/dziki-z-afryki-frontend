import React, { useEffect, useState } from 'react'
import { type Course } from '../../Types/Types.d'
import axios from 'axios'
import { PATH_COURSE } from '../../Constants/Paths.d'
import { getToken } from '../Auth/AuthProvider'
import { Alert, Button, Card, CardGroup, Col, Container, Form } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import CourseFormDate from './CourseFormDate'
import { ROUTE_COURSES } from '../../Constants/Routes.d'

const CoursePage: React.FC = () => {
    const { courseId } = useParams()
    const [course, setCourse] = useState<Course | null>(null)
    const [showAlert, setShowAlert] = useState(false)
    const [alertMess, setAlertMess] = useState('')
    const navigate = useNavigate()

    const handleDeleteCourse = (): void => {
        axios.delete(
            PATH_COURSE + '/' + courseId!, {
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

    useEffect(() => {
        axios.get(
            `${PATH_COURSE}/${courseId!}`,
            {
                headers:
                    {
                        Authorization: 'Bearer ' + getToken()
                    }
            }).then(resp => {
            const dates = resp.data.dates.map((date: any) => {
                const startHour: string = date.startTime[0].toString()
                const startMinute: string = date.startTime[1].toString()
                const endHour: string = date.endTime[0].toString()
                const endMinute: string = date.endTime[1].toString()
                return {
                    weekDay: date.weekDay,
                    startTime: startHour + ':' +
                        (startMinute.length > 1 ? startMinute : '0' + startMinute),
                    endTime: endHour + ':' +
                        (endMinute.length > 1 ? endMinute : '0' + endMinute)
                }
            })
            setCourse((s) => ({
                ...s,
                courseId: resp.data.courseId,
                name: resp.data.name,
                description: resp.data.description,
                teacher: resp.data.teacher,
                students: resp.data.students,
                dates
            }))
        }).catch(error => {
            return error
        })
    }, [])

    return (
        <Container>
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
            <CardGroup>
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
                                <Card.Title>{student}</Card.Title>
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

export default CoursePage
