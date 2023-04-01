import React, { Component } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Container, Nav, Navbar } from 'react-bootstrap'

import { useAuth } from '../Auth/AuthProvider'
import { ROLE_STUDENT, ROLE_TEACHER } from '../../Constants/Auth.d'
import { ROUTE_AUTHENTICATION, ROUTE_HOME, ROUTE_REGISTER } from '../../Constants/Routes.d'

export const NavbarComponent = (): JSX.Element => {
    const navigate = useNavigate()
    const location = useLocation()
    const auth = useAuth()

    const state = location.state as { from: Location }
    const from = state != null ? state.from.pathname : ROUTE_HOME

    return (
        <Navbar style={{ position: 'sticky', top: 0, zIndex: 10 }}
            bg="light" variant="light" fixed="top">
            <Container>
                <Navbar.Brand as={Link} to="/">SYSTEM</Navbar.Brand>

                {auth.user?.role.includes(ROLE_STUDENT) &&
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to={ROUTE_HOME}>Home</Nav.Link>
                    </Nav>}

                {auth.user?.role.includes(ROLE_TEACHER) &&
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to={ROUTE_HOME}>Home</Nav.Link>
                    </Nav>}

                {auth.user === null &&
                    <Nav>
                        <Nav.Link as={Link} to={ROUTE_AUTHENTICATION}>Login</Nav.Link>
                        <Nav.Link as={Link} to={ROUTE_REGISTER}>Register</Nav.Link>
                    </Nav>}

                {auth.user?.role.includes(ROLE_STUDENT) &&
                    <Nav>
                        <Nav.Link disabled={true}>Welcome {auth.user?.email}!</Nav.Link>
                        <Nav.Link onClick={() => {
                            auth.signout(() => { navigate(from, { replace: true }) })
                        } }>
                            Sign out
                        </Nav.Link>
                    </Nav>}

                {(auth.user?.role.includes(ROLE_TEACHER)) &&
                    <Nav>
                        <Nav.Link disabled={true}>Welcome {auth.user.email}!</Nav.Link>
                        <Nav.Link onClick={() => {
                            auth.signout(() => { navigate(from, { replace: true }) })
                        } }>
                            Sign out
                        </Nav.Link>
                    </Nav>}

            </Container>
        </Navbar>
    )
}
