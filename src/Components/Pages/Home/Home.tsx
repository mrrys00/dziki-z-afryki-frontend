import React from 'react'
import './Home.css'
import { Container } from 'react-bootstrap'

const Home = (): JSX.Element => {
    return (
        <Container className="Home-container">
            <div className="Home-title">
                Welcome
            </div>
        </Container>
    )
}

export default Home
