export const trueObject = (obj: object): boolean => {
    if (obj === null || obj === undefined) {
        return false
    }
    return Object.values(obj)
        .every(item => item === true)
}
