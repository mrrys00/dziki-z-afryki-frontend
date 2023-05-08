import React, { useEffect, useState } from 'react'
import { type Course, type CourseDate, DAYS_OF_WEEK } from '../../Types/Types.d'
import axios from 'axios'
import { PATH_COURSE } from '../../Constants/Paths.d'
import { getToken } from '../Auth/AuthProvider'
import { Alert, Button, Card, CardGroup, Col, Container, Form } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import CourseFormDate from './CourseFormDate'
import { DATE_FIELDS_REQUIRED, INVALID_START_END_TIME } from '../../Constants/Errors.d'
// import { truthyObject } from '../../Utils/Utils'
import { ROUTE_COURSES } from '../../Constants/Routes.d'

const CoursePage: React.FC = () => {
    const { courseId } = useParams()
    const [course, setCourse] = useState<Course | null>(null)
    const [dates, setDates] = useState<CourseDate[]>([])
    const [description, setDescription] = useState('')
    // const [editDescription, setEditDescription] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [alertMess, setAlertMess] = useState('')
    const [currentDate, setCurrentDate] = useState<CourseDate>(() => ({
        weekDay: DAYS_OF_WEEK.MONDAY,
        startTime: '',
        endTime: ''
    }))
    const [reload, setReload] = useState(false)
    const navigate = useNavigate()

    // const handleAddDate = (): void => {
    //     if (currentDate.weekDay === '' || currentDate.startTime === '' ||
    //         currentDate.endTime === '') {
    //         setShowAlert(true)
    //         setAlertMess(DATE_FIELDS_REQUIRED)
    //         return
    //     }
    //     if (currentDate.startTime >= currentDate.endTime) {
    //         setShowAlert(true)
    //         setAlertMess(INVALID_START_END_TIME)
    //         return
    //     }
    //     setReload(true)
    //     setDates((s) => ([...s, currentDate]))
    //     setCurrentDate({
    //         weekDay: DAYS_OF_WEEK.MONDAY,
    //         startTime: '',
    //         endTime: ''
    //     })
    //     setAlertMess('')
    //     setShowAlert(false)
    // }

    // const handleDeleteDate = (index: number): void => {
    //     setReload(true)
    //     const newDates = dates.filter((date, i) => i !== index)
    //     setDates(newDates)
    // }

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

    // const handleChangeDescription = (): void => {
    //     axios.put(
    //         PATH_COURSE + '/' + courseId!,
    //         {
    //             description
    //         },
    //         {
    //             headers:
    //                 {
    //                     Authorization: 'Bearer ' + getToken()
    //                 }
    //         }
    //     ).then(resp => {
    //         if (resp.status === 200) {
    //             // setEditDescription(false)
    //             setShowAlert(false)
    //             setAlertMess('')
    //         }
    //     }).catch(error => {
    //         setShowAlert(true)
    //         console.log(error)
    //         setAlertMess(error.response.data)
    //     })
    // }

    useEffect(() => {
        if (reload) {
            axios.put(
                PATH_COURSE + '/' + courseId!,
                {
                    dates
                },
                {
                    headers:
                        {
                            Authorization: 'Bearer ' + getToken()
                        }
                }
            ).then(resp => {
                if (resp.status === 200) {
                    setReload((s) => !s)
                    setShowAlert(false)
                    setAlertMess('')
                }
            }).catch(error => {
                setShowAlert(true)
                console.log(error)
                setAlertMess(error.response.data)
            })
        }
        setReload(false)
    }, [dates, description])

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
            setDates(dates)
            setDescription(resp.data.description)
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
                        {description}
                        {/* {editDescription
                            ? (<>
                                <input type="text" value={description}
                                    onChange={(e) => { setDescription(e.target.value) }} />
                                <Button variant="primary"
                                    style={{ float: 'right' }}
                                    onClick={() => { handleChangeDescription() }}>
                                    Save</Button>
                            </>)
                            : (<>
                                <>
                                    {description}
                                </>
                                <Button variant="primary"
                                    style={{ float: 'right' }}
                                    onClick={() => { setEditDescription(true) }}>
                                    Edit</Button>
                            </>)} */}
                    </Card.Text>
                </Card.Body>
                <Card.Body>
                    <Card.Subtitle>Share code</Card.Subtitle>
                    <Card.Text>{course?.courseId}</Card.Text>
                    <Card.Subtitle>Owner</Card.Subtitle>
                    <Card.Text>{course?.teacher}</Card.Text>
                </Card.Body>
            </Card>
            <CardGroup>
                {dates.map((date, index) => {
                    return (
                        <>
                            <CourseFormDate key={index} date={date}/>
                            {/* <Button variant="danger"
                                onClick={() => { handleDeleteDate(index) }}>
                                Delete</Button> */}
                        </>
                    )
                })
                }
            </CardGroup>
            {/* <Form>
                <Form.Group as={Col}>
                    <Form.Label>Day of week</Form.Label>
                    <Form.Select
                        value={currentDate.weekDay}
                        onChange={(val) => {
                            setCurrentDate((s) => ({ ...s, weekDay: val.target.value }))
                        }}
                    >
                        {Object.keys(DAYS_OF_WEEK).map((day) => {
                            return <option key={day} value={day}>{day}</option>
                        })}
                    </Form.Select>
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Time from</Form.Label>
                    <Form.Control
                        value={currentDate.startTime}
                        onChange={(val) => {
                            setCurrentDate((s) => ({ ...s, startTime: val.target.value }))
                        } }
                        type="time"
                    />
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Time to</Form.Label>
                    <Form.Control
                        value={currentDate.endTime}
                        onChange={(val) => {
                            setCurrentDate((s) => ({ ...s, endTime: val.target.value }))
                        } }
                        type="time"
                    />
                </Form.Group>
                <Button
                    variant="primary"
                    onClick={handleAddDate}
                    disabled={!(truthyObject(currentDate))}
                >Add date</Button>
                <Alert show={showAlert} variant="danger">
                    {alertMess}
                </Alert>
            </Form> */}
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
        </Container>
    )
}

export default CoursePage
