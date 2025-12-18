import jwt from 'jsonwebtoken'
import User from "../models/user.model.js"
import  {asyncHandler} from '../utils/asyncHandler.js'

const authenticate = asyncHandler(async(req,res,next)=>{
  let token ;
  // read the jwt from cookies

  token = req.cookies.jwt
  // console.log("Token:", token);
  if(token) {
    try {
      const decoded = jwt.verify(token ,process.env.JWT_SECRET )
      // console.log("Decoded:", decoded);
      req.user = await User.findById(decoded.userId).select(
          "-password"
      );
      // console.log("User from DB:", req.user);
      next();
    } catch (error) {
      res.status(401)
      throw new Error("Not authorized ,  token failed")
    }
  }
  else{
    res.status(401)
    throw new Error("Not authorized , not token")
  }
})

// check for admin

const authorizeAdmin = asyncHandler(async(req,res,next )=>{
  // console.log(req.user); // Add this line to debug
  if(req.user && req.user.isAdmin){
    next()
  }else {
  res.status(401).send("Not authorized as admin")
}
})

export { authenticate ,authorizeAdmin};