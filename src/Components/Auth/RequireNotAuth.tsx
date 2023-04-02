import React from 'react'
import { Alert, Button, Col, Container, Row } from 'react-bootstrap'
import { Outlet, useNavigate } from 'react-router-dom'
import { ROUTE_AUTHENTICATION } from '../../Constants/Routes.d'
import { useAuth } from './AuthProvider'

import './RequireNotAuth.css'

export const RequireNotAuth = (): JSX.Element => {
    const navigate = useNavigate()
    const auth = useAuth()

    if (auth.user !== null) {
        return (
            <Container className="Alert-container p-5">
                <Alert show={true} variant="warning">
                    <Row>
                        <Col md="9">
                            You are currently signed in. Would you like to sign out?
                        </Col>
                        <Col md="3">
                            <Button variant="primary" onClick={() => {
                                auth.signout(() => {
                                    navigate(ROUTE_AUTHENTICATION, { replace: true })
                                })
                            }}>
                                Sign out
                            </Button>
                        </Col>
                    </Row>
                </Alert>
            </Container>
        )
    }

    return <Outlet />
}
