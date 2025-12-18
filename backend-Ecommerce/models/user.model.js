import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new Schema(
  {
    username : {
      type : String,
      required : true,
    },
    email:{
      type:String,
      required : true,
      unique:true,
    },
    password:{
      type:String,
      required: [true, "Password is required "],
    },
    isAdmin:{
      type : Boolean,
      required : true,
      default : false
    }

  },{
    timestamps : true,
  }
)
const User = mongoose.model('User',userSchema)



export default User;
