import React from 'react'
import { type CourseDateInput } from '../../../Types/Types'
import { Card } from 'react-bootstrap'

const CourseFormDate: React.FC<{ date: CourseDateInput }> = ({ date }) => {
    return (
        <Card style={{ minWidth: '20%', flexGrow: 0 }}>
            <Card.Body>
                <Card.Text>{date.weekDay}</Card.Text>
                <Card.Text>{date.startTime}</Card.Text>
                <Card.Text>{date.endTime}</Card.Text>
            </Card.Body>
        </Card>
    )
}

export default CourseFormDate
