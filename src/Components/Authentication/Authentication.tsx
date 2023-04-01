import axios from 'axios'
import React, { Component, useState } from 'react'
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../Auth/AuthProvider'
import { type UserInputAuthentication } from '../../Types/Types'

import './Authentication.css'
import { PATH_AUTH_AUTHENTICATION } from '../../Constants/Paths.d'

const AuthenticationPage: React.FC = () => {
    const [showAlert, setShowAlert] = useState(false)
    const [alertMess, setAlertMess] = useState('')
    const [input, setInput] = useState<UserInputAuthentication>(() => ({
        email: '',
        password: ''
    }))

    // const [inputValidator, setInputValidator] = useState<Record<string, boolean>>(() => ({
    //     email: true,
    //     password: true
    // }))

    const navigate = useNavigate()
    const location = useLocation()
    const auth = useAuth()

    const state = location.state as { from: Location }
    const from = state ? state.from.pathname : '/'

    const loginUser = async () => await axios({
        url: PATH_AUTH_AUTHENTICATION,
        method: 'post',
        data: input
    }).catch(error => {
        return error
    })

    async function handleSubmit (): Promise<void> {
        // const validator = {
        //     username: nameValidator(input.username),
        //     password: passwordValidator(input.password)
        // }

        // setInputValidator(validator)
        // if (!Object.values(validator).includes(false)) {
        const resp = await loginUser()

        if (resp.status === 200) {
            auth.signin(resp.data.token, () => {
                navigate(from, { replace: true })
            })
        } else {
            setShowAlert(true)
            setAlertMess(resp.response.data)
            console.log(`resp${resp.response.data}`)
        }
        // }
    }

    if (auth.user === null) {
        return (
            <Container className="Authentication">
                <Form>
                    <Row className="mb-3">
                        <Form.Group as={Col} md="6" controlId="validationCustom03">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Password"
                                required
                                value={input.email}
                                // isInvalid={!inputValidator.username}
                                onChange={(val) => { setInput((s) => ({ ...s, email: val.target.value })) }}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid email.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="6" controlId="validationCustom04">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                required
                                value={input.password}
                                // isInvalid={!inputValidator.password}
                                onChange={(val) => { setInput((s) => ({ ...s, password: val.target.value })) }}/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid password.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Button variant="success" onClick={handleSubmit}>Authentication</Button>
                </Form>

                <Alert show={showAlert} variant="danger">
                    {alertMess}
                </Alert>
            </Container>
        )
    }

    return (
        <Container>
            <Alert show={showAlert} variant="danger">
                {alertMess}
            </Alert>
        </Container>
    )
}

export { AuthenticationPage }
