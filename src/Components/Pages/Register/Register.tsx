import React, { useState } from 'react'
import { Button, Col, Form, InputGroup, Row, Container, Alert } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

import { useAuth } from '../../Auth/AuthProvider'
import Home from '../Home/Home'

import { type UserInputRegister } from '../../../Types/Types'
import { PATH_AUTH_REGISTER } from '../../../Constants/Paths.d'

import './Register.css'
import { ROLE_STUDENT, ROLE_TEACHER } from '../../../Constants/Auth.d'
import { ROUTE_HOME } from '../../../Constants/Routes.d'

const RegisterPage = (): JSX.Element => {
    const [showAlert, setShowAlert] = useState(false)
    const [alertMess, setAlertMess] = useState('')

    const [input, setInput] = useState<UserInputRegister>(() => ({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: ROLE_STUDENT,
        indexNumber: 0
    }))

    const navigate = useNavigate()
    const location = useLocation()
    const auth = useAuth()

    const state = location.state as { from: Location }
    const from = state != null ? state.from.pathname : ROUTE_HOME

    async function registerUser (): Promise<any> {
        console.log(input)
        input.indexNumber = input.role === ROLE_TEACHER ? null : input.indexNumber

        return await axios({
            url: PATH_AUTH_REGISTER,
            method: 'post',
            data: input
        }).catch(error => {
            return error
        })
    }

    async function handleSubmit (): Promise<void> {
        const resp = await registerUser()

        if (resp.status === 200) {
            auth.signin(resp.data.jwt, () => {
                navigate(from, { replace: true })
            })
        } else {
            setShowAlert(true)
            setAlertMess(resp.response.data)
        }
    }

    if (auth.user === null) {
        return (
            <Container className="Register">
                <Form>
                    <Row className="mb-3">
                        <Form.Group as={Col} md="6" controlId="validationCustom03">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Email"
                                required
                                value={input.email}
                                // isInvalid={!inputValidator.email}
                                onChange={(val) => {
                                    setInput((s) => ({ ...s, email: val.target.value }))
                                } } />
                            {/* <Form.Control.Feedback type="invalid">
                                Please provide a valid email.
                            </Form.Control.Feedback> */}
                        </Form.Group>
                        <Form.Group as={Col} md="6" controlId="validationCustom04">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                required
                                value={input.password}
                                // isInvalid={!inputValidator.password}
                                onChange={(val) => {
                                    setInput((s) => ({ ...s, password: val.target.value }))
                                } } />
                            {/* <Form.Control.Feedback type="invalid">
                                Please provide a valid password.
                            </Form.Control.Feedback> */}
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} md="6" controlId="validationCustom01">
                            <Form.Label>First name</Form.Label>
                            <Form.Control
                                required
                                value={input.firstName}
                                // isInvalid={!inputValidator.firstName}
                                onChange={(val) => {
                                    setInput((s) => ({ ...s, firstName: val.target.value }))
                                } }
                                type="text"
                                placeholder="First name" />
                            {/* <Form.Control.Feedback type="invalid">
                                Provide a valid firstname!
                            </Form.Control.Feedback> */}
                        </Form.Group>
                        <Form.Group as={Col} md="6" controlId="validationCustom02">
                            <Form.Label>Last name</Form.Label>
                            <Form.Control
                                required
                                value={input.lastName}
                                // isInvalid={!inputValidator.lastName}
                                onChange={(val) => {
                                    setInput((s) => ({ ...s, lastName: val.target.value }))
                                } }
                                type="text"
                                placeholder="Last name" />
                            {/* <Form.Control.Feedback type="invalid">
                                Provide a valid lastname!
                            </Form.Control.Feedback> */}
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} md="6" controlId="validationCustomRole">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                required
                                value={input.role}
                                onChange={(val) => {
                                    setInput((s) => ({ ...s, role: val.target.value }))
                                }}
                            >
                                <option value="STUDENT">student</option>
                                <option value="TEACHER">teacher</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group as={Col} md="6" controlId="validationCustomUsername">
                            <Form.Label>Index number</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    type="text"
                                    placeholder="Username"
                                    aria-describedby="inputGroupPrepend"
                                    required
                                    value={input.indexNumber}
                                    // isInvalid={!inputValidator.indexNumber}
                                    onChange={(val) => {
                                        setInput((s) => ({ ...s, indexNumber: val.target.value }))
                                    } }
                                    disabled={ input.role === ROLE_TEACHER } />
                                {/* <Form.Control.Feedback type="invalid">
                                    Please choose a index number.
                                </Form.Control.Feedback> */}
                            </InputGroup>
                        </Form.Group>
                    </Row>

                    <Button variant="success" onClick={handleSubmit}>Register</Button>
                </Form>

                <Alert show={showAlert} variant="danger">
                    {alertMess}
                </Alert>
            </Container>
        )
    }

    return <Home />
}

export default RegisterPage
