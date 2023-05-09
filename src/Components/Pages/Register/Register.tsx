import React, { useEffect, useState } from 'react'
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
import { trueObject } from '../../../Utils/Utils'
import { EMAIL_EXISTS, BASIC_ERROR } from '../../../Constants/Errors.d'

import { emailValidator, passwordValidator, nameValidator } from '../../Validation/Validator'

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
    const [inputValidator, setInputValidator] = useState(() => ({
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        indexNumber: false
    }))
    const [inputDirty, setInputDirty] = useState(() => ({
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        indexNumber: false
    }))

    const navigate = useNavigate()
    const location = useLocation()
    const auth = useAuth()

    const state = location.state as { from: Location }
    const from = state != null ? state.from.pathname : ROUTE_HOME

    useEffect(() => {
        const result = emailValidator(input.email.trim())
        setInputValidator((s) => ({ ...s, email: result }))
    }, [input.email])

    useEffect(() => {
        const result = passwordValidator(input.password.trim())
        setInputValidator((s) => ({ ...s, password: result }))
    }, [input.password])

    useEffect(() => {
        const result = nameValidator(input.firstName.trim())
        setInputValidator((s) => ({ ...s, firstName: result }))
    }, [input.firstName])

    useEffect(() => {
        const result = nameValidator(input.lastName.trim())
        setInputValidator((s) => ({ ...s, lastName: result }))
    }, [input.lastName])

    useEffect(() => {
        if (input.role === ROLE_STUDENT) {
            const result = input.indexNumber.toString().trim() !== '' &&
                input.indexNumber.toString().length === 6
            setInputValidator((s) => ({ ...s, indexNumber: result }))
        } else {
            setInputDirty((s) => ({ ...s, indexNumber: true }))
            setInputValidator((s) => ({ ...s, indexNumber: true }))
        }
    }, [input.role, input.indexNumber])

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
        } else if (resp.response.status === 409) {
            setShowAlert(true)
            setAlertMess(EMAIL_EXISTS)
        } else {
            setShowAlert(true)
            console.log(resp)
            setAlertMess(BASIC_ERROR)
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
                                isInvalid={inputDirty.email && !inputValidator.email}
                                onChange={(val) => {
                                    setInput((s) => ({ ...s, email: val.target.value }))
                                }}
                                onFocus={() => {
                                    setInputDirty((s) => ({ ...s, email: true }))
                                }}
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
                                isInvalid={inputDirty.password && !inputValidator.password}
                                onChange={(val) => {
                                    setInput((s) => ({ ...s, password: val.target.value }))
                                }}
                                onFocus={() => {
                                    setInputDirty((s) => ({ ...s, password: true }))
                                }}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid password.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} md="6" controlId="validationCustom01">
                            <Form.Label>First name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="First name"
                                required
                                value={input.firstName}
                                isInvalid={inputDirty.firstName && !inputValidator.firstName}
                                onChange={(val) => {
                                    setInput((s) => ({ ...s, firstName: val.target.value }))
                                }}
                                onFocus={() => {
                                    setInputDirty((s) => ({ ...s, firstName: true }))
                                }}
                            />
                            <Form.Control.Feedback type="invalid">
                                Provide a valid firstname!
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="6" controlId="validationCustom02">
                            <Form.Label>Last name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Last name"
                                required
                                value={input.lastName}
                                isInvalid={inputDirty.lastName && !inputValidator.lastName}
                                onChange={(val) => {
                                    setInput((s) => ({ ...s, lastName: val.target.value }))
                                }}
                                onFocus={() => {
                                    setInputDirty((s) => ({ ...s, lastName: true }))
                                }}
                            />
                            <Form.Control.Feedback type="invalid">
                                Provide a valid lastname!
                            </Form.Control.Feedback>
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
                                <option value={ROLE_STUDENT}>student</option>
                                <option value={ROLE_TEACHER}>teacher</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group as={Col} md="6" controlId="validationCustomUsername">
                            <Form.Label>Index number</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    type="number"
                                    aria-describedby="inputGroupPrepend"
                                    required
                                    value={input.indexNumber}
                                    isInvalid={input.role === ROLE_STUDENT &&
                                        inputDirty.indexNumber && !inputValidator.indexNumber}
                                    onChange={(val) => {
                                        setInput((s) => ({ ...s, indexNumber: val.target.value }))
                                    }}
                                    onFocus={() => {
                                        setInputDirty((s) => ({ ...s, indexNumber: true }))
                                    }}
                                    disabled={ input.role === ROLE_TEACHER } />
                                -<Form.Control.Feedback type="invalid">
                                    Please choose a valid index number.
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </Row>

                    <Button
                        variant="success"
                        onClick={handleSubmit}
                        disabled={!(trueObject(inputDirty) && trueObject(inputValidator))}>
                        Register
                    </Button>
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
