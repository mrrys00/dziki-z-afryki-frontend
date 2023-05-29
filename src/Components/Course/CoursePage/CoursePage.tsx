import React, { useEffect, useState } from 'react'
import { getToken, useAuth } from '../../Auth/AuthProvider'
import { useParams } from 'react-router-dom'
import { ROLE_STUDENT, ROLE_TEACHER } from '../../../Constants/Auth.d'
import CoursePageTeacher from './CoursePageTeacher'
import CoursePageStudent from './CoursePageStudent'
import NotFound from '../../Pages/NotFound/NotFound'
import axios from 'axios'
import { PATH_COURSE } from '../../../Constants/Paths.d'
import { type Course } from '../../../Types/Types'

const CoursePage: React.FC = () => {
    const { courseId } = useParams()
    const [course, setCourse] = useState<Course | null>(null)
    const auth = useAuth()

    useEffect(() => {
        axios.get(`${PATH_COURSE}/${courseId!}`).then(resp => {
            const dates = resp.data.dates.map((date: any) => {
                const startHour: string = date.startTime[0].toString()
                const startMinute: string = date.startTime[1].toString()
                const endHour: string = date.endTime[0].toString()
                const endMinute: string = date.endTime[1].toString()
                return {
                    dateId: date.dateId,
                    weekDay: date.weekDay,
                    startTime: startHour + ':' +
                        (startMinute.length > 1 ? startMinute : '0' + startMinute),
                    endTime: endHour + ':' +
                        (endMinute.length > 1 ? endMinute : '0' + endMinute)
                }
            })
            setCourse((s) => ({
                ...s,
                courseId: resp.data.courseId,
                name: resp.data.name,
                description: resp.data.description,
                teacher: resp.data.teacher,
                students: resp.data.students,
                dates
            }))
        }).catch(error => {
            return error
        })
    }, [])

    if (auth.user?.role === ROLE_TEACHER) {
        return (
            <CoursePageTeacher course={course}/>
        )
    }

    if (auth.user?.role === ROLE_STUDENT) {
        return (
            <CoursePageStudent course={course}/>
        )
    }

    return (
        <NotFound />
    )
}

export default CoursePage
