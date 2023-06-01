/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { type Course } from '../../../Types/Types'
import axios from 'axios'
import { PATH_COURSE, PATH_COURSE_RESULTS } from '../../../Constants/Paths.d'
import { getToken } from '../../Auth/AuthProvider'
import { Alert, Button, Card, CardGroup, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import CourseFormDate from '../CourseForm/CourseFormDate'
import { ROUTE_COURSES } from '../../../Constants/Routes.d'

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
    const [courseId] = useState<string>(course!.courseId)
    let isCalculated = false

    isCalculated = true
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
        // getCourseResultsRequest(courseId)
        axios.get(
            // `${PATH_COURSE_RESULTS}/${courseId}`
            `${PATH_COURSE_RESULTS}/${course!.courseId}`
        ).then(resp => {
            if (resp.status === 200) {
                isCalculated = true
            }
            // const datesIds: string[] = []
            // for (const coursePref of resp.data) {
            //     if (coursePref.courseId === course?.courseId) {
            //         for (const dateId of coursePref.datesIds) {
            //             datesIds.push(dateId)
            //         }
            //     }
            // }
            // setSelected(course?.dates.map((date) => datesIds.includes(date.dateId)) ?? [])
        }).catch(error => {
            return error
        })
        setLoaded(true)
    })

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
            {loaded && !isCalculated && <CardGroup>
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
            <CardGroup style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                {course?.dates.map((date, index) => {
                    return (
                        <>
                            <Button> TO DO </Button>
                            <CourseFormDate key={index} date={date}/>
                        </>
                    )
                })
                }
            </CardGroup>}
            {loaded && isCalculated && <CardGroup>
                {course?.students.map((student, index) => {
                    return (
                        <Card key={index} style={{ minWidth: '20%', flexGrow: 0 }}>
                            <Button> TO DO </Button>
                            <Card.Body>
                                <Card.Title>{student.email}</Card.Title>
                            </Card.Body>
                        </Card>
                    )
                })
                }
            </CardGroup>}
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
