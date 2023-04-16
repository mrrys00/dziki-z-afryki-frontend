export const trueObject = (obj): boolean => {
    if (obj === null || obj === undefined) {
        return false
    }
    return Object.values(obj)
        .every(item => item === true)
}
