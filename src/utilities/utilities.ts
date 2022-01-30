import express, { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

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

const verifyAuthJWT = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization
        if(authorizationHeader){
            const token = authorizationHeader.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
            next();
        }else{
            throw new Error("auth header must be defined")
        }
    } catch (error) {
        res.status(401)
    }
}

export default {
    objectNullValsToUndefined,
    verifyAuthJWT
};