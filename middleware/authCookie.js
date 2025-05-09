import jwt from 'jsonwebtoken';
// import { UnauthenticatedError } from '../Errors/customError.js';

export const checkCookie = async (req, res, next) => {
  try {
    const token = req.signedCookies?.login;

    if (!token) {
    return res.status(401).json({msg:'invalid user....'});
    }

    const payload = jwt.verify(token,"secret");
    
    // You now have access to payload.id and payload.name
    req.user = {
      id: payload.userId,
      name: payload.name,
    };

    next();
  } catch (err) {
    return res.status(400).json({msg:err})
  }
};


