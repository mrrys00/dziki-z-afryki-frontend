import React from 'react'
import { Container } from 'react-bootstrap'

import './NotFound.css'
const NotFound: React.FC = () => {
    return (
        <Container className="NotFound-Container p-5 fs-1 fw-bold text-center">
            Page not found
        </Container>
    )
}

export default NotFound
