import React, { useEffect, useState } from 'react'
import { type Course } from '../../Types/Types'
import axios from 'axios'
import { PATH_COURSE } from '../../Constants/Paths.d'
import { getToken } from '../Auth/AuthProvider'
import { Card, CardGroup, Container } from 'react-bootstrap'
import { useParams } from 'react-router-dom'

const CoursePage: React.FC = () => {
    const { courseId } = useParams()
    const [course, setCourse] = useState<Course | null>(null)

    useEffect(() => {
        axios.get(
            `${PATH_COURSE}/${courseId!}`,
            {
                headers:
                    {
                        Authorization: 'Bearer ' + getToken()
                    }
            }).then(resp => {
            setCourse((s) => ({
                ...s,
                courseId: resp.data.courseId,
                name: resp.data.name,
                description: resp.data.description,
                code: resp.data.code,
                ownerEmail: resp.data.ownerEmail,
                students: resp.data.users,
                dates: resp.data.dates.map((date: any) => {
                    console.log(date)
                    const startHour: string = date.startTime[0]
                    const startMinute: string = date.startTime[1]
                    const endHour: string = date.endTime[0]
                    const endMinute: string = date.endTime[1]
                    return {
                        weekDay: date.weekDay,
                        startTime: startHour + ':' +
                            (startMinute.length > 1 ? startMinute : '0' + startMinute),
                        endTime: endHour + ':' +
                            (endMinute.length > 1 ? endMinute : '0' + endMinute)
                    }
                })
            }))
        }).catch(error => {
            return error
        })
    }, [])

    return (
        <Container>
            <Card>
                <Card.Header>
                    <Card.Title>{course?.name}</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Card.Subtitle>Description</Card.Subtitle>
                    <Card.Text>{course?.description}</Card.Text>
                    <Card.Subtitle>Code</Card.Subtitle>
                    <Card.Text>{course?.code}</Card.Text>
                    <Card.Subtitle>Owner</Card.Subtitle>
                    <Card.Text>{course?.ownerEmail}</Card.Text>
                </Card.Body>
            </Card>
            <CardGroup>
                {course?.dates.map((date, index) => {
                    return (
                        <Card key={index} style={{ minWidth: '20%', flexGrow: 0 }}>
                            <Card.Body>
                                <Card.Title>{date.weekDay}</Card.Title>
                                <Card.Text>Start time: {date.startTime}</Card.Text>
                                <Card.Text>End time: {date.endTime}</Card.Text>
                            </Card.Body>
                        </Card>
                    )
                })
                }
            </CardGroup>
            <CardGroup>
                {course?.students.map((student, index) => {
                    return (
                        <Card key={index} style={{ minWidth: '20%', flexGrow: 0 }}>
                            <Card.Body>
                                <Card.Title>{student}</Card.Title>
                            </Card.Body>
                        </Card>
                    )
                })
                }
            </CardGroup>
        </Container>
    )
}

export default CoursePage
