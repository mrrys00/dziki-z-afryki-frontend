/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { type Course, type ResultDatesMapping } from '../../../Types/Types'
import axios from 'axios'
import { PATH_COURSE, PATH_COURSE_RESULTS } from '../../../Constants/Paths.d'
import { getToken } from '../../Auth/AuthProvider'
import { Alert, Button, Card, CardGroup, Container, Form } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import CourseFormDate from '../CourseForm/CourseFormDate'
import Loading from '../../Auth/Loading'
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

const getCourseRequest = (courseId: string): any => axios({
    url: `${PATH_COURSE}/${courseId}`,
    method: 'get'
})

const CoursePageTeacher: React.FC = () => {
    const courseId = useParams().courseId as string
    const navigate = useNavigate()
    const [course, setCourse] = useState<Course>(
        {
            courseId: '',
            name: '',
            description: '',
            isCalculated: false,
            teacher: '',
            students: [],
            dates: []
        }
    )
    const [showAlert, setShowAlert] = useState(false)
    const [alertMess, setAlertMess] = useState('')
    const [loaded, setLoaded] = useState<boolean>(true)
    const [results, setResults] = useState<Map<string, string[]>>(new Map())

    const handleDeleteCourse = (): void => {
        axios.delete(PATH_COURSE + '/' + course.courseId).then((resp) => {
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
            await calculateCourseRequest(course.courseId)
        } catch (e) {
            setShowAlert(true)
        }
    }

    const handleGetCourse = async (): Promise<boolean> => {
        try {
            const resp = await getCourseRequest(courseId)
            const responseCourse: Course = resp.data
            console.log(responseCourse)
            setCourse({
                courseId: responseCourse.courseId,
                name: responseCourse.name,
                description: responseCourse.description,
                isCalculated: responseCourse.isCalculated,
                teacher: responseCourse.teacher,
                students: [...responseCourse.students],
                dates: [...responseCourse.dates]
            })
            return responseCourse.isCalculated
        } catch (e) {
            console.log(e)
            return false
        }
    }

    const handleResults = async (): Promise<void> => {
        try {
            const resp = await getCourseResultsRequest(courseId)
            const respData = resp.data
            console.log(respData.dateToStudents)

            setResults(() => {
                const results = new Map<string, string[]>()
                Object.entries(respData.dateToStudents).forEach(([key, value]) => results.set(key, value as string[]))
                return results
            })
        } catch (e) {
            setShowAlert(true)
        }
    }

    const mapStudentIdToEmail = (dateId: string): string => {
        const studentIds = results.get(dateId)
        if (studentIds === undefined) {
            return ''
        }
        return studentIds.map((studentId) => course.students.find((s) => s.studentId === studentId)?.email).toString()
    }

    useEffect(() => {
        const fetchData = async (): Promise<any> => {
            const isCalculated = await handleGetCourse()
            if (isCalculated) {
                await handleResults()
            }
        }
        fetchData().catch((e) => { setShowAlert(true) })
        setLoaded(true)
    }, [])

    if (!loaded) {
        return <Loading />
    }

    return (
        <Container style={{ marginTop: '1rem' }}>
            <Card>
                <Card.Header>
                    <Card.Title>{course.name}</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Card.Subtitle>Description</Card.Subtitle>
                    <Card.Text>
                        {course.description}
                    </Card.Text>
                    <Card.Subtitle>Share code</Card.Subtitle>
                    <Card.Text>{course.courseId}</Card.Text>
                    <Card.Subtitle>Owner</Card.Subtitle>
                    <Card.Text>{course.teacher}</Card.Text>
                </Card.Body>
            </Card>
            {loaded && !course.isCalculated && <Card style={{ marginTop: '1rem', marginBottom: '1rem' }}>
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
            {loaded && !course.isCalculated &&
            <CardGroup style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                {course.dates.map((date, index) => {
                    return (
                        <>
                            <CourseFormDate key={index} date={date}/>
                        </>
                    )
                })
                }
            </CardGroup>}
            {loaded && !course.isCalculated && <Card>
                <Card.Subtitle style={{ minWidth: '100%', marginTop: '1rem', fontSize: 18 }}>
                    Enrolled students
                </Card.Subtitle>
            </Card>}
            {loaded && !course.isCalculated &&
            <CardGroup>
                {course.students.map((student, index) => {
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

            {loaded && course.isCalculated &&
            <Card style={{ minWidth: '33%', flexGrow: 0 }}>
                <Card.Text style={{ margin: 'auto', fontSize: 24 }}>
                    Enrollment has finished
                </Card.Text>
            </Card>}
            {loaded && course.isCalculated && course.dates.map((date) => {
                return (
                    <Form.Group key={date.dateId}>
                        <CardGroup>
                            <Card style={{ minWidth: '33%', flexGrow: 0 }}>
                                <Card.Text style={{ margin: 'auto' }}>
                                    {`${date.weekDay} ${date.startTime} - ${date.endTime}`}
                                </Card.Text>
                            </Card>
                            {
                                mapStudentIdToEmail(date.dateId)
                            }
                        </CardGroup>
                    </Form.Group>
                )
            })}
            <Button variant="danger" onClick={handleDeleteCourse}>Delete course</Button>
            <Button variant="success" disabled={course.isCalculated}
                onClick={handleCalculateCourse}>Calculate course</Button>
            <Alert show={showAlert} variant="danger">
                {alertMess}
            </Alert>
        </Container>
    )
}

export default CoursePageTeacher
