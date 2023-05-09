import React, { useEffect, useState } from 'react'
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap'
import { notEmptyValidator } from '../Validation/Validator'
import { FIELDS_REQUIRED } from '../../Constants/Errors.d'
import axios from 'axios'
import { PATH_COURSE_ENROLL } from '../../Constants/Paths.d'
import { getToken } from '../Auth/AuthProvider'

const CourseEnroll = (): JSX.Element => {
    const [input, setInput] = useState('')
    const [inputValidator, setInputValidator] = useState(false)
    const [inputDirty, setInputDirty] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [alertMess, setAlertMess] = useState('')

    useEffect(() => {
        const result = notEmptyValidator(input.trim())
        setInputValidator(result)
    }, [input])

    const handleChangeInput = (val: string): void => {
        setInput(val)
        setInputDirty(true)
    }

    const enroll = async (): Promise<any> => {
        return await axios.post(
            PATH_COURSE_ENROLL,
            {
                courseId: input
            },
            {
                headers:
                    {
                        Authorization: `Bearer ${getToken()}`
                    }
            }
        ).catch(error => {
            return error
        })
    }

    const handleEnroll = async (): Promise<void> => {
        if (input === '') {
            setShowAlert(true)
            setAlertMess(FIELDS_REQUIRED)
            return
        }

        const resp = await enroll()
        if (resp.status === 200) {
            clearForm()
        } else {
            setShowAlert(true)
            console.log(resp)
            setAlertMess(resp.message)
        }
    }

    const clearForm = (): void => {
        setInput('')
        setAlertMess('')
        setShowAlert(false)
    }

    return (
        <Container>
            <Form>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="validationCustom01">
                        <h2 style={{ margin: '2rem' }}>Enroll to course</h2>
                        <Form.Control
                            required
                            value={input}
                            isInvalid={inputDirty && !inputValidator}
                            onChange={(event) => {
                                handleChangeInput(event.target.value)
                            } }
                            type="text"
                            placeholder="Course code" />
                        <Form.Control.Feedback type="invalid">
                            Code cannot be empty
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Button variant="success" disabled={!inputValidator} onClick={handleEnroll}>
                    Enroll</Button>
            </Form>
            <Alert show={showAlert} variant="danger">
                {alertMess}
            </Alert>
        </Container>
    )
}

export default CourseEnroll
