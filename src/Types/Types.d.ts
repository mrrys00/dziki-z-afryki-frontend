import { type ROLES } from '../Constants/Paths.d'

export interface UserInputRegister {
    firstName: string
    lastName: string
    email: string
    password: string
    indexNumber: int
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
