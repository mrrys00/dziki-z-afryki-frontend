import React from 'react'
import { Card, Container } from 'react-bootstrap'
import { type Course } from '../../../Types/Types'
import CoursePageDatesForm from './CoursePageDatesForm'

const CoursePageStudent: React.FC<{ course: Course | null }> = ({ course }) => {
    return (
        <Container style={{ marginTop: '1rem' }}>
            <Card>
                <Card.Header>
                    <Card.Title>{course?.name}</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Card.Subtitle>Description</Card.Subtitle>
                    <Card.Text>
                        {course?.description}
                    </Card.Text>
                    <Card.Subtitle>Owner</Card.Subtitle>
                    <Card.Text>{course?.teacher}</Card.Text>
                </Card.Body>
            </Card>
            <br/>
            <CoursePageDatesForm course={course}/>
        </Container>
    )
}

export default CoursePageStudent
