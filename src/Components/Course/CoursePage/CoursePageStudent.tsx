/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { Card, Container } from 'react-bootstrap'
import { type Course } from '../../../Types/Types'
import CoursePageDatesForm from './CoursePageDatesForm'
import { useParams } from 'react-router-dom'
import { PATH_COURSE } from '../../../Constants/Paths.d'
import axios from 'axios'

const getCourseRequest = (courseId: string): any => axios({
    url: `${PATH_COURSE}/${courseId}`,
    method: 'get'
})

const CoursePageStudent: React.FC = () => {
    const courseId = useParams().courseId as string
    const [course, setCourse] = useState<Course>(
        {
            courseId: '',
            name: '',
            description: '',
            isCalculated: false,
            teacher: '',
            students: [],
            dates: []
        }
    )

    const handleGetCourse = async (): Promise<any> => {
        try {
            const resp = await getCourseRequest(courseId)
            const responseCourse: Course = resp.data
            console.log(responseCourse)
            setCourse({
                courseId: responseCourse.courseId,
                name: responseCourse.name,
                description: responseCourse.description,
                isCalculated: responseCourse.isCalculated,
                teacher: responseCourse.teacher,
                students: [...responseCourse.students],
                dates: [...responseCourse.dates]
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        const fetchData = async (): Promise<any> => {
            await handleGetCourse()
        }
        fetchData().catch((e) => { console.log(e) })
    }, [])

    return (
        <Container style={{ marginTop: '1rem' }}>
            <Card>
                <Card.Header>
                    <Card.Title>{course.name}</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Card.Subtitle>Description</Card.Subtitle>
                    <Card.Text>
                        {course.description}
                    </Card.Text>
                    <Card.Subtitle>Owner</Card.Subtitle>
                    <Card.Text>{course.teacher}</Card.Text>
                </Card.Body>
            </Card>
            <br/>
            <CoursePageDatesForm course={course}/>
        </Container>
    )
}

export default CoursePageStudent
