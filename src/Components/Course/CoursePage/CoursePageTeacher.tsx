/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { type Course } from '../../../Types/Types'
import axios from 'axios'
import { PATH_COURSE, PATH_COURSE_RESULTS } from '../../../Constants/Paths.d'
import { getToken } from '../../Auth/AuthProvider'
import { Alert, Button, Card, CardGroup, Container, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import CourseFormDate from '../CourseForm/CourseFormDate'
import { ROUTE_COURSES } from '../../../Constants/Routes.d'
import { wait } from '@testing-library/user-event/dist/utils'

const calculateCourseRequest = (courseId: string): any => axios({
    url: `/course-results/calculate/${courseId}`,
    method: 'post'
})

const getCourseResultsRequest = (courseId: string): any => axios({
    url: `/course-results/${courseId}`,
    method: 'get'
})

const CoursePageTeacher: React.FC<{ course: Course | null }> = ({ course }) => {
    const [showAlert, setShowAlert] = useState(false)
    const [alertMess, setAlertMess] = useState('')
    const navigate = useNavigate()
    const [loaded, setLoaded] = useState<boolean>(false)
    const [dateStudents, setDateStudents] = useState(new Map<string, string[]>())
    const [isCalculated, setIsCalculated] = useState<boolean>(false)
    const datesStudents = new Map<string, string[]>([])

    const [studentIDEmailMap, setStudentIDEmailMap] = useState<Map<string, string>>()

    const handleDeleteCourse = (): void => {
        axios.delete(PATH_COURSE + '/' + course!.courseId).then((resp) => {
            navigate(ROUTE_COURSES)
            return resp
        })
            .catch(error => {
                setShowAlert(true)
                setAlertMess(error.response.data)
            })
    }

    const handleCalculateCourse = async (): Promise<any> => {
        try {
            await calculateCourseRequest(course!.courseId)
        } catch (e) {
            setShowAlert(true)
        }
    }

    useEffect(() => {
        if (course === null) {
            return
        }
        axios.get(
            `${PATH_COURSE_RESULTS}/${course.courseId}`
        ).then(resp => {
            console.log(resp.data)
            if (resp.status === 200) {
                setIsCalculated(true)
            }
            const datesIds: string[] = []
            // const datesStudents = new Map<string, string[]>([])
            datesStudents.set('aaa', ['aaa'])
            for (const coursePref of resp.data) {
                if (coursePref.courseId === course?.courseId) {
                    for (const dateId of coursePref.datesIds) {
                        datesIds.push(dateId)
                        // tutaj poległem z mapowaniem - mapa wyświetla się jako undefined
                        datesStudents.set(dateId.toString(), [])
                        for (const studentObj of course.students) {
                            if (resp.data[dateId].indexOf(studentObj.studentId) > -1) {
                                datesStudents.get(dateId)?.push(studentObj.email)
                            }
                        }
                    }
                }
            }
        }).catch(error => {
            return error
        })
        setLoaded(true)
    }, [course])

    // useEffect(() => { console.log(course) }, [course])
    useEffect(() => { console.log(datesStudents) }, [datesStudents])

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
            {loaded && !isCalculated && <Card style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                <Card.Subtitle
                    style={{
                        minWidth: '100%',
                        fontSize: 18,
                        marginTop: '1rem',
                        marginBottom: '1rem'
                    }}>
                    Course dates
                </Card.Subtitle>
            </Card>}
            {loaded && !isCalculated &&
            <CardGroup style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                {course?.dates.map((date, index) => {
                    return (
                        <>
                            <CourseFormDate key={index} date={date}/>
                        </>
                    )
                })
                }
            </CardGroup>}
            {loaded && !isCalculated && <Card>
                <Card.Subtitle style={{ minWidth: '100%', marginTop: '1rem', fontSize: 18 }}>
                    Enrolled students
                </Card.Subtitle>
            </Card>}
            {loaded && !isCalculated &&
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
            </CardGroup>}

            {loaded && isCalculated &&
            <Card style={{ minWidth: '33%', flexGrow: 0 }}>
                <Card.Text style={{ margin: 'auto', fontSize: 24 }}>
                    Enrollment has finished
                </Card.Text>
            </Card>}
            {loaded && isCalculated && course?.dates.map((date, index) => {
                return (
                    <Form.Group key={index}>
                        <CardGroup>
                            <Card style={{ minWidth: '33%', flexGrow: 0 }}>
                                <Card.Text style={{ margin: 'auto' }}>
                                    {`${date.weekDay} ${date.startTime} - ${date.endTime}`}
                                </Card.Text>
                            </Card>
                            <Card style={{ minWidth: '67%', flexGrow: 0 }}>
                                <Card.Text style={{ margin: 'auto' }}>
                                    {`${datesStudents?.get(date.dateId)?.toString()}`}
                                </Card.Text>
                            </Card>
                        </CardGroup>
                    </Form.Group>
                )
            })
            }
            <Button variant="danger" onClick={handleDeleteCourse}>Delete course</Button>
            <Button variant="success" disabled={isCalculated}
                onClick={handleCalculateCourse}>Calculate course</Button>
            <Alert show={showAlert} variant="danger">
                {alertMess}
            </Alert>
        </Container>
    )
}

export default CoursePageTeacher
