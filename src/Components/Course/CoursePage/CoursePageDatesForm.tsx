import React, { useEffect, useState } from 'react'
import { DecodedUser, type Course } from '../../../Types/Types'
import { Alert, Button, Card, CardGroup, Container, Form } from 'react-bootstrap'
import axios from 'axios'
import { PATH_COURSE_PREFERENCES, PATH_COURSE_RESULTS } from '../../../Constants/Paths.d'
import { getToken } from '../../Auth/AuthProvider'
import jwtDecode from 'jwt-decode'
import { error } from 'console'

const CoursePageDatesForm: React.FC<{ course: Course | null }> = ({ course }) => {
    const [comments, setComments] = useState<string[]>([])
    const [selected, setSelected] = useState<boolean[]>([])
    const [loaded, setLoaded] = useState<boolean>(false)
    const [showAlert, setShowAlert] = useState(false)
    const [alertMess, setAlertMess] = useState('')

    useEffect(() => {
        axios.get(
            `${PATH_COURSE_PREFERENCES}/all`
        ).then(resp => {
            const datesIds: string[] = []
            for (const coursePref of resp.data) {
                if (coursePref.courseId === course?.courseId) {
                    for (const dateId of coursePref.datesIds) {
                        datesIds.push(dateId)
                    }
                }
            }
            setSelected(course?.dates.map((date) => datesIds.includes(date.dateId)) ?? [])
        }).catch(error => {
            return error
        })
        setComments(course?.dates.map((date) => '') ?? [])
        setLoaded(true)
    }, [course])

    // useEffect(() => {
    //     axios.get(
    //         `${PATH_COURSE_RESULTS}/${course?.courseId}`
    //     ).then(resp => {
    //         // const userId: string = jwtDecode(getToken())
    //         const user: DecodedUser = jwtDecode<DecodedUser>(getToken())
    //         const userEmail: string = user.email
    //     }).catch(error => {
    //         return error
    //     })
    // })

    const clearForm = (): void => {
        setComments(course!.dates.map((date) => ''))
        setSelected(course!.dates.map((date) => false))
        setShowAlert(false)
        setAlertMess('')
    }

    const sendPreferences = async (dateIds: string[] | undefined): Promise<any> => {
        return await axios.post(
            PATH_COURSE_PREFERENCES,
            {
                courseId: course!.courseId,
                datesIds: dateIds
            }
        ).catch(error => {
            return error
        })
    }

    const handleSubmit = async (): Promise<void> => {
        const dateIds = course?.dates
            .filter((date, index) => selected[index])
            .map((date) => date.dateId)
        console.log(dateIds)
        console.log(comments)

        const resp = await sendPreferences(dateIds)
        if (resp.status === 200) {
            setShowAlert(false)
            setAlertMess('')
        } else {
            setShowAlert(true)
            console.log(resp)
            setAlertMess(JSON.stringify(resp.response.data))
        }
    }

    return (
        <Container>
            {loaded && <Form>
                <CardGroup>
                    <Card style={{ minWidth: '33%', flexGrow: 0 }}>
                        <Card.Header>Date</Card.Header>
                    </Card>
                    <Card style={{ minWidth: '16%', flexGrow: 0 }}>
                        <Card.Header>Select</Card.Header>
                    </Card>
                    <Card style={{ minWidth: '50%', flexGrow: 0 }}>
                        <Card.Header>Comment</Card.Header>
                    </Card>
                </CardGroup>
                {course?.dates.map((date, index) => {
                    return (
                        <Form.Group key={index}>
                            <CardGroup>
                                <Card style={{ minWidth: '33%', flexGrow: 0 }}>
                                    <Card.Text style={{ margin: 'auto' }}>
                                        {`${date.weekDay} ${date.startTime} - ${date.endTime}`}
                                    </Card.Text>
                                </Card>
                                <Card style={{ minWidth: '16%', flexGrow: 0 }}>
                                    <Form.Group style={{ margin: 'auto' }}>
                                        <Form.Check
                                            type="checkbox"
                                            checked={selected[index]}
                                            onChange={(val) => {
                                                const newSelected = [...selected]
                                                newSelected[index] = val.target.checked
                                                setSelected(newSelected)
                                            }}
                                        />
                                    </Form.Group>
                                </Card>
                                <Card style={{ minWidth: '50%', flexGrow: 0 }}>
                                    <Form.Control
                                        type="text"
                                        value={comments[index]}
                                        onChange={(val) => {
                                            const newComments = [...comments]
                                            newComments[index] = val.target.value
                                            setComments(newComments)
                                        }}
                                        style={{ margin: 'auto' }}
                                        disabled={true}
                                    />
                                </Card>
                            </CardGroup>
                        </Form.Group>
                    )
                })
                }
                <Container style={{ marginTop: '1rem' }}>
                    <Button
                        variant="success"
                        onClick={handleSubmit}
                        disabled={!selected?.some(el => el)}
                    >Submit
                    </Button>
                    <Button
                        variant="danger"
                        onClick={clearForm}
                    >Clear
                    </Button>
                </Container>
            </Form>}
            <Alert show={showAlert} variant="danger">
                {alertMess}
            </Alert>
        </Container>
    )
}

export default CoursePageDatesForm
