import { type ROLES } from '../Constants/Paths.d'

export interface UserInputRegister {
    firstName: string
    lastName: string
    email: string
    password: string
    role: ROLES
    indexNumber: int | null
}

export interface UserInputAuthentication {
    email: string
    password: string
}

export interface DecodedUser {
    email: string
    role: ROLES
    sub: string
}

export interface AuthResponse {
    jwt: string
}

export interface CourseDate {
    weekDay: string
    startTime: string
    endTime: string
}

export interface CourseInput {
    name: string
    description: string
    dates: CourseDate[]
    code: string
}

export interface Course {
    id: number
    name: string
    description: string
    dates: CourseDate[]
    code: string
    ownerEmail: string
    students: string[]
}

export enum DAYS_OF_WEEK {
    MONDAY = 'MONDAY',
    TUESDAY = 'TUESDAY',
    WEDNESDAY = 'WEDNESDAY',
    THURSDAY = 'THURSDAY',
    FRIDAY = 'FRIDAY',
    SATURDAY = 'SATURDAY',
    SUNDAY = 'SUNDAY'
}
