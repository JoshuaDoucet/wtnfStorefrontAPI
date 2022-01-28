
// Copies an object and replaces any null values with undefined and returns the copy
const objectNullValsToUndefined = (inObj: object): object => {
    let copyObj = JSON.parse(JSON.stringify(inObj)); 
    Object.entries(inObj)
        .forEach(([key, value]) => {
            if(value == null){
                copyObj[key] = undefined;
            }
        }
    )
    return copyObj;
}

export default objectNullValsToUndefined;