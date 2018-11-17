export function isEmpty(value) {
    return value !== null ? value.trim() === '':false;
}
export function isEmail(value) {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(value);
}
export const validateMobileNumber = (mobNumber) => {
    const re = /^\+?([0-9]{2})?([0-9]{10})$/;
    return re.test(mobNumber);
};