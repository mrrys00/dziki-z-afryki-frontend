import React, { useState } from 'react'
import { Alert, Button, CardGroup, Col, Container, Form, Row } from 'react-bootstrap'
import { type CourseInput, type CourseDate, DAYS_OF_WEEK } from '../../Types/Types.d'
import { getToken, useAuth } from '../Auth/AuthProvider'
import axios from 'axios'
import { PATH_COURSE } from '../../Constants/Paths.d'
import { truthyObject } from '../../Utils/Utils'
import CourseFormDate from './CourseFormDate'
import { DATE_FIELDS_REQUIRED, FIELDS_REQUIRED, INVALID_START_END_TIME }
    from '../../Constants/Errors.d'

// eslint-disable-next-line max-len
const CourseForm: React.FC<{ setReloadCourse: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setReloadCourse }) => {
    const [showAlert, setShowAlert] = useState(false)
    const [alertMess, setAlertMess] = useState('')
    const [input, setInput] = useState<CourseInput>(() => ({
        name: '',
        description: '',
        dates: []
    }))
    const [currentDate, setCurrentDate] = useState<CourseDate>(() => ({
        weekDay: DAYS_OF_WEEK.MONDAY,
        startTime: '',
        endTime: ''
    }))
    const auth = useAuth()

    const addCourse = async (): Promise<any> => {
        return await axios.post(
            PATH_COURSE,
            {
                name: input.name,
                description: input.description,
                code: '',
                ownerEmail: auth.user?.sub ?? '',
                dates: input.dates
            },
            {
                headers:
                    {
                        Authorization: 'Bearer ' + getToken()
                    }
            }
        ).catch(error => {
            return error
        })
    }

    const handleSubmit = async (): Promise<void> => {
        if (input.name === '' || input.description === '') {
            setShowAlert(true)
            setAlertMess(FIELDS_REQUIRED)
            return
        }

        const resp = await addCourse()
        if (resp.status === 200) {
            clearForm()
            setReloadCourse((s) => !s)
        } else {
            setShowAlert(true)
            console.log(resp)
            setAlertMess(resp.response.data)
        }
    }

    const handleAddDate = (): void => {
        if (currentDate.weekDay === '' || currentDate.startTime === '' ||
            currentDate.endTime === '') {
            setShowAlert(true)
            setAlertMess(DATE_FIELDS_REQUIRED)
            return
        }
        if (currentDate.startTime >= currentDate.endTime) {
            setShowAlert(true)
            setAlertMess(INVALID_START_END_TIME)
            return
        }
        setInput((s) => ({ ...s, dates: [...s.dates, currentDate] }))
        setCurrentDate(() => ({
            weekDay: DAYS_OF_WEEK.MONDAY,
            startTime: '',
            endTime: ''
        }))
        setAlertMess('')
        setShowAlert(false)
    }

    const clearForm = (): void => {
        setInput(() => ({
            name: '',
            description: '',
            dates: []
        }))
        setAlertMess('')
        setShowAlert(false)
    }

    return (
        <Container className="CourseForm">
            <Form>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="validationCustom01">
                        <Form.Label>Course name</Form.Label>
                        <Form.Control
                            required
                            value={input.name}
                            onChange={(val) => {
                                setInput((s) => ({ ...s, name: val.target.value }))
                            } }
                            type="text"
                            placeholder="Course name" />
                    </Form.Group>
                    <Form.Label>Course description</Form.Label>
                    <Form.Control
                        required
                        value={input.description}
                        onChange={(val) => {
                            setInput((s) => ({ ...s, description: val.target.value }))
                        } }
                        type="text"
                        placeholder="Course description" />
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
                </Row>
                <Button
                    variant="primary"
                    onClick={handleAddDate}
                    disabled={!(truthyObject(currentDate))}
                >Add date</Button>
                <Button variant="success" onClick={handleSubmit}>Add course</Button>
                <Button variant="danger" onClick={clearForm}>Clear</Button>
            </Form>
            {input.dates.length > 0 &&
            <Container>
                <h3>Entered dates</h3>
                <CardGroup>
                    {input.dates.map((date, index) => {
                        return (
                            <CourseFormDate date={date} key={index} />
                        )
                    })}
                </CardGroup>
            </Container>
            }

            <Alert show={showAlert} variant="danger">
                {alertMess}
            </Alert>
        </Container>
    )
}

export default CourseForm
