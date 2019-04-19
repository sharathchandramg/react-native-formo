
export function isEmpty(value) {
    switch(typeof value){
        case 'string':
            if((value.trim() === "") || !value){
                return true;
            }
            return false; 
        case 'number':
            if (value.toString().trim() === "" || !value){
                return true;
            }
            return false
        case 'undefined':
            return true;
        case 'object':
            if(Array.isArray(value)){
                return value.length > 0? false:true;
            }else{
                if(value === null || Object.keys(value).length === 0){
                    return true;
                }
                return false;
            }
        default:
            return false 
    }
}

export function isEmail(value) {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(value);
}
export const validateMobileNumber = (mobNumber) => {
    const re = /^\+?([0-9]{2})?([0-9]{10})$/;
    return re.test(mobNumber);
};

export function isNull(value) {
    if (!value || value === null || typeof value === "undefined")
        return true;
    else
        return false;
};