import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/uploadCloudinary.js";
import {option} from "../constants.js";
import jwt from "jsonwebtoken";
import {Post} from "../models/post.model.js";



const generateAccessAndRefreshTokens = async (userId)=>{
    try{
        const user = await User.findById(userId);
       const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false})
        return {accessToken, refreshToken}
    }catch (e) {
        throw new ApiError(500, "Something Went Wrong while generating tokens")
    }
}

const registerUser = asyncHandler(async (req,res)=>{
    //get user details
    const {username, password, email, fullName} = req.body;
    if(!(username && password && email && fullName)){
        throw new ApiError(400, "All fields are required");
    }

    if (!email.includes("@")){
        throw new ApiError(400, "Please enter a valid email");
    }
    if (password.length < 8){
        throw new ApiError(400, "Password must be at least 8 characters");
    }

    const userExist = await User.findOne({
        $or: [{username}, {email}]
    })

    if(userExist){
        res.status(409).json(
            new ApiResponse(409,null,"User already exist")
        )
    }
    const profileImageLocalPath = req.file?.path

   const profileImage = await uploadOnCloudinary(profileImageLocalPath)
    const pubicId = profileImage?.public_id
   const user = await User.create({
       fullName,
       profileImage: profileImage?.url || "",
       publicId: pubicId || "",
       email,
       password,
       username: username.toLowerCase()
   })
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
   if (!createdUser){
       throw new ApiError(500, "Something Went Wrong while creating the user");
   }
    return res.status(200).json(
        new ApiResponse(200, user,"User registered successfully.")
    )

})
const loginUser = asyncHandler(async (req,  res)=>{
    const {username, password, email} = req.body
    if(!(username || email )){
    throw new ApiError(400, "Please enter a username or email");
    }
    const userExist = await User.findOne({
        $or: [{username}, {email}]
    })
    if (!userExist){
        throw new ApiError(400, "User does not exists");
    }
   const validUser = await userExist.comparePassword(password)
    if(!validUser){
        throw new ApiError(401, "Password is incorrect");
    }

const {accessToken, refreshToken} =  await generateAccessAndRefreshTokens(userExist._id)
   const loggedInUser = await User.findById(userExist._id).select("-password -refreshToken")



   return res
       .status(200)
       .cookie("accessToken", accessToken, option)
       .cookie("refreshToken", refreshToken, option)
       .json(
           new ApiResponse(200, {
               userExist: loggedInUser, accessToken, refreshToken
           },"User logged in Successfully")
       )
})
const logoutUser = asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(req.user._id, {
        $set:{
            refreshToken: null
        }
    },{new :true})
    return res
        .status(200)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json(
            new ApiResponse(200,{}, "User logged out Successfully")
        )
})
const refreshAccessToken = asyncHandler(async (req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken|| req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorised request")
    }
   const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user=await User.findById(decodedToken?._id)
    if (!user){
        throw new ApiError(401, "User not found")
    }
    if (incomingRefreshToken!==user?.refreshToken){
        throw new ApiError(401, "Refresh token is expired or used")
    }
   const {accessToken, refreshToken}= await generateAccessAndRefreshTokens(user._id)
    return res
        .status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponse(200, {accessToken, refreshToken}, "Access token refreshed")
        )
})
const userInfo=asyncHandler(async (req, res)=>{
    const user = await User.findById(req.user?._id).select("-password -publicId -refreshToken")
    if (!user){
        throw new ApiError(401, "User not found")
    }
    return res.status(200).json(
        new ApiResponse(200, user, "User details")
    )
})
const changePassword=asyncHandler(async (req,res)=>{
    const {newPassword,oldPassword} = req.body
    const user = await User.findById(req.user?._id)
    const validatePassword = await user.comparePassword(oldPassword);
    if(!validatePassword){
        throw new ApiError(401, "Invalid password");
    }
    user.password=newPassword
    await user.save({validateBeforeSave: false})
    return res.status(200).json(
        new ApiResponse(
            200,null,"Password changed successfully"
        )
    )
})
const updateUserDetails=asyncHandler(async (req,res)=>{
    const {fullName, email, username}=req.body
    if (!(fullName && email && username)){
        throw new ApiError(401, "All fields are require")
    }
  const user = await User.findByIdAndUpdate(req.user?._id, {
      $set:{
          fullName,
          email,
          username
      }
  }, {new:true}).select("-password -refreshToken")
    return res.status(200).json(new ApiResponse(200, user, "User details updated"))
})
const updateUserProfileImage=asyncHandler(async (req, res)=>{
    const profileImageLocalPath = req.file?.path
    if(!profileImageLocalPath){
        throw new ApiError(401, "No image local path");
    }
   const profileImage= await uploadOnCloudinary(profileImageLocalPath)
    if(!profileImage.url){
        throw new ApiError(401, "No image url");
    }
    const user =await User.findByIdAndUpdate(req.user?._id, {
        $set:{
            profileImage: profileImage.url,
            publicId: profileImage.public_id
        }
    }, {new: true}).select("-password")
    return res.status(200).json(new ApiResponse(200, user, "User profile image updated"))
})
const getMyPost=asyncHandler(async (req, res)=>{

    const myPost = await Post.aggregate([{
     $match:{
         owner: req.user._id,
     }
    }
    ])
    return res.status(200).json(new ApiResponse(200, myPost, "User Posts"))
})
export {registerUser,getMyPost, loginUser, logoutUser, refreshAccessToken, userInfo, changePassword, updateUserDetails, updateUserProfileImage}