
export function isEmpty(value) {
    switch(typeof value){
        case 'string':{
            if( value &&  value.trim() !== ""){
                return false; 
            }else{
                return true;
            }
        }
        case 'number':{
            let val = value.toString();
            if(val && val.trim() !== ""){
                return false
            }else{
                return true;
            }
        }
        case 'undefined':
            return true;
        case 'object':{
            if(Array.isArray(value)){
                return value.length > 0? false:true;
            }else{
                if(value === null || Object.keys(value).length === 0){
                    return true;
                }
                return false;
            }
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
    const re = /^(\+91[\-\s]?)?(91)?[6789]\d{9}$/;
    return re.test(mobNumber);
};

export function isNull(value) {
    if (!value || value === null || typeof value === "undefined")
        return true;
    else
        return false;
};

export const sum = arr => arr.reduce((acc, n) => acc + n, 0);