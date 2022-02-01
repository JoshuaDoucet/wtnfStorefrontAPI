import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Copies an object and replaces any null values with undefined and returns the copy
const objectNullValsToUndefined = (inObj: object): object => {
  let copyObj = JSON.parse(JSON.stringify(inObj));
  Object.entries(inObj).forEach(([key, value]) => {
    if (value == null) {
      copyObj[key] = undefined;
    }
  });
  return copyObj;
};

// Extracts a user id from a JWT Bearer token
// it is asumed that the user identity
// has been verified before extracting the user id from the JWRT
// enbedded in the req parameter
const getAuthUserId = (_req: Request): string | undefined => {
  var userId: string | undefined = undefined;
  // Remove "Bearer " from front of JWT
  const token = _req.headers.authorization?.split(' ')[1];
  if (token) {
    // decode payload
    const payload = jwt.decode(token);
    if (payload != null && typeof payload === 'object') {
      if ('user' in payload) {
        var user = payload.user;
        if ('id' in user) {
          userId = user.id;
        }
      }
    }
  }
  return userId;
};

// Routing middleware to verify a JWT enbedded in a request.
// verifies JWT and calls next or throws an error if JWT is not verified
const verifyAuthJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      next();
    } else {
      res
        .status(401)
        .json('Authorization Token not Found. Please Sign-In or Sign-Up');
    }
  } catch (error) {
    res
      .status(401)
      .json(
        `Invalid token provided with request. Please sign-in or reauthenticate. <br> ERR -- ${error}`
      );
  }
};

export default {
  getAuthUserId,
  objectNullValsToUndefined,
  verifyAuthJWT
};
