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
        const authHeader = req.headers.authorization
        if(authHeader){
            const token = authHeader.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
            next();
        }else{
            res.status(401)
                .json("Authorization Token not Found. Please Sign-In or Sign-Up")
        }
    } catch (error) {
        res.status(401)
            .json(`Invalid token provided with request. Please sign-in or reauthenticate. <br> ERR -- ${error}`)
    }
}

export default {
    objectNullValsToUndefined,
    verifyAuthJWT
};