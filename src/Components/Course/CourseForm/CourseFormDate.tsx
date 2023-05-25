import React from 'react'
import { type CourseDate } from '../../../Types/Types'
import { Card } from 'react-bootstrap'

const CourseFormDate: React.FC<{ date: CourseDate }> = ({ date }) => {
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
