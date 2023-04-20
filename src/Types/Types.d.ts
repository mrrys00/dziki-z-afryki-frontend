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
}

export interface AuthResponse {
    jwt: string
}
