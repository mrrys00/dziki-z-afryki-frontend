
export function emailValidator (email: string): boolean {
    return /^[^@\s]+@[^@\s]+.[^@\s]+$/.test(email)
}

export function nameValidator (name: string): boolean {
    return name.length > 1
}

export function passwordValidator (pass: string): boolean {
    return pass.length > 4
}

export function courseNameValidator (name: string): boolean {
    return name.length >= 3
}

export function courseDescriptionValidator (name: string): boolean {
    return name.length >= 3
}
