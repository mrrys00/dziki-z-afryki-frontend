import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../Auth/AuthProvider'
import { type UserInputAuthentication } from '../../../Types/Types'

import './Authentication.css'
import { PATH_AUTH_AUTHENTICATION } from '../../../Constants/Paths.d'
import { ROUTE_HOME } from '../../../Constants/Routes.d'
import { trueObject } from '../../../Utils/Utils'
import { LOGIN_FAILED } from '../../../Constants/Errors.d'

import { emailValidator, passwordValidator } from '../../Validation/Validator'

const AuthenticationPage: React.FC = () => {
    const [showAlert, setShowAlert] = useState(false)
    const [alertMess, setAlertMess] = useState('')
    const [input, setInput] = useState<UserInputAuthentication>(() => ({
        email: '',
        password: ''
    }))
    const [inputValidator, setInputValidator] = useState({
        email: false,
        password: false
    })
    const [inputDirty, setInputDirty] = useState({
        email: false,
        password: false
    })

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

    async function loginUser (): Promise<any> {
        return await axios({
            url: PATH_AUTH_AUTHENTICATION,
            method: 'post',
            data: input
        }).catch(error => {
            return error
        })
    }

    const handleSubmit = async (): Promise<void> => {
        const resp = await loginUser()

        if (resp.status === 200) {
            auth.signin(resp.data.jwt, () => {
                navigate(from, { replace: true })
            })
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            axios.defaults.headers.common.Authorization = 'Bearer ' + resp.data.jwt
        } else {
            setShowAlert(true)
            console.log(resp)
            setAlertMess(LOGIN_FAILED)
        }
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
                    <Button
                        variant="success"
                        onClick={handleSubmit}
                        disabled={!(trueObject(inputDirty) && trueObject(inputValidator))}>
                        Authentication
                    </Button>
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

export default AuthenticationPage
