import React, { Component } from 'react'
import { Container, Spinner } from 'react-bootstrap'

const Loading: React.FC = () => {
    return (
        <Container className="d-flex justify-content-center pt-5 pb-5">
            <Spinner animation="border" variant="info" />
        </Container>
    )
}

export default Loading
