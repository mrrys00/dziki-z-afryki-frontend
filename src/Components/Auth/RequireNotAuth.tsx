import React from 'react'
import { Alert, Button, Col, Container, Row } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import { useAuth } from './AuthProvider'

import './RequireNotAuth.css'

export const RequireNotAuth = (): JSX.Element => {
    const auth = useAuth()

    if (auth.user !== null) {
        return (
            <Container className="Alert-container p-5">
                <Alert show={true} variant="warning">
                    <Row>
                        <Col md="10">
                            You are currently signed in. Would you like to sign out?
                        </Col>
                        <Col md="2">
                            <Button variant="primary" onClick={() => { auth.signout() }}>
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
