import mongoose from 'mongoose';
import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs'
const userSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email:{
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
    },
    fullName:{
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    profileImage:{
        type: String, //cld yrl
    },
    publicId:{
        type: String
    },
    post:[{
        type: String,
    }],
    password:{
        type: String,
        required: [true, 'Password required'],
    },
    score:{
        type: Number,
        default: 0
    },
    refreshToken:{
        type: String,
    }
}, {timestamps: true});

userSchema.pre("save", async function(next){
    if (!this.isModified('password')){
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    next()
})

userSchema.methods.comparePassword = async function(password){
   return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function(){
    return  jwt.sign({
        _id: this._id,
        email: this.email,
        fullName: this.fullName,
        username: this.username,
    }, process.env.ACCESS_TOKEN_SECRET,{expiresIn: process.env.ACCESS_TOKEN_EXPIRY});
}
userSchema.methods.generateRefreshToken = async function(){
    return  jwt.sign({
        _id: this._id,
    }, process.env.REFRESH_TOKEN_SECRET,{expiresIn: process.env.REFESH_TOKEN_EXPIRY});
}
export const User = mongoose.model('User', userSchema);