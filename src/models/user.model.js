import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt" 

const userSchema = new Schema(
    {
      username:{
        type: String,
        required : true,
        unique: true,
        lowercase : true,
        trim : true,
        index : true  // it make easy for searching
      },
      email:{
        type: String,
        required : true,
        unique: true,
        lowercase : true,
        trim : true,
       
      },
      fullname:{
        type: String,
        required : true,
        trim : true,
        index : true
       
      },
      avatar:{
        type: String, // cloudinary url
        required : true,
       
      },
      password:{
        type: String, // cloudinary url
        required : true
       
      },
      coverImage:{
        type: String, // cloudinary url
      },
      watchHistory:[{
        type: Schema.Types.ObjectId,
        ref :"Video"
      }],
      
      refreshToken:{   
        type : String,
      }
   },
   {
    timestamps : true
   }
)

userSchema.pre("save",async function(next){
  // here we don't use arrow function bacause we unable to use this and here we pass next becuse to next flag of middleware and amy function async bacuse it take time to encrypt the data

  // here this know every field of user
  if(!this.isModified("password")) return next(); // pass word not change
     // here we check if password modified change password
  this.password = await bcrypt.hash(this.password,10)
  next()
})

// here we create own method to check password is correc or not using mongoose

userSchema.methods.isPasswordCorrect = async function(password){
  console.log("Plain password:", password); // should log the plain-text password from the user input
console.log("Hashed password:", this.password);

  return await bcrypt.compare(password, this.password)

}


userSchema.methods.generateAccessTokenn= function(){
  return jwt.sign(
    {
      _id : this._id,  // this all enformation is coming from database
      email : this.email,
      username : this.username,
      fullname: this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}
userSchema.methods.generateRefreshTokenn= function(){
 return jwt.sign(
    {
      _id : this._id,  // this all enformation is coming from database
     
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}


export const User = mongoose.model("User" , userSchema)