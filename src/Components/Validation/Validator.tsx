export const emailValidator = (email: string): boolean => /^[^@\s]+@[^@\s]+.[^@\s]+$/.test(email)

export const nameValidator = (name: string): boolean => name.length > 1

export const passwordValidator = (pass: string): boolean => pass.length > 4

export const courseNameValidator = (name: string): boolean => name.length >= 3

export const courseDescriptionValidator = (name: string): boolean => name.length >= 3

export const notEmptyValidator = (val: string): boolean => val != null && val.length > 0
