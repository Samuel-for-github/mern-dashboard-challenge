import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/uploadCloudinary.js";
import {Post} from "../models/post.model.js";

const createPost=asyncHandler(async (req, res) => {
    const {title, description} = req.body;
    if(!(title && description)){
        throw new ApiError(400, "All fields are required");
    }
    const postImageLocalPath = req.file?.path
    if(!postImageLocalPath){
        throw new ApiError(400, "Please enter a valid postImageLocalPath");
    }
    const postImage = await uploadOnCloudinary(postImageLocalPath)
    if(!postImage){
        throw new ApiError(400, "No Post Image uploaded");
    }
    const publicId = postImage.public_id
    const post = await Post.create({
        postFile: postImage?.url,
        publicId,
        owner: req.user?._id,
        title,
        description
    })
    if(!post){
        throw new ApiError(400, "No post uploaded");
    }

    await User.findByIdAndUpdate(req.user?._id,{
        $set:{
            score: req.user.score+10,
        },
        $addToSet:{
            post: post._id
        }
    },{new: true})

    return res.status(200).json(new ApiResponse(200, post, "Post created"))
})
const getAllPosts=asyncHandler(async (req, res)=>{
const posts = await Post.find({})
    return res.status(200).json(new ApiResponse(200, posts, "All posts"))
})
const deletePost = asyncHandler(async (req, res)=>{
    const {postId}=req.params
    await User.findByIdAndUpdate(req.user?._id, {
        $pull:{
            post: postId
        },
        $set:{
            score: req.user.score-10,
        }
    })
    const deletePost=await Post.findByIdAndDelete(postId)
    if(!deletePost){
        throw new ApiError(500, "Post deletion failed")
    }
    return res.status(200).json(new ApiResponse(200, deletePost, "Post deleted"))
})
const updatePost=asyncHandler(async (req,res)=>{
    const {postId} = req.params
    if (!postId){
        throw new ApiError(400, "No post id")
    }
    console.log(req.body)
    const {title, description} = req.body
    if(!(title && description)){
        throw new ApiError(400, "All fields are required");
    }
    const postImageLocalPath = req.file?.path
    if(!postImageLocalPath){
        throw new ApiError(400, "Please enter a valid postImageLocalPath");
    }
    const postImage = await uploadOnCloudinary(postImageLocalPath)
    if(!postImage){
        throw new ApiError(400, "No Post Image uploaded");
    }
    const publicId = postImage?.public_id
    const updatePost=await Post.findByIdAndUpdate(postId,{
        title,description,postFile: postImage.url,publicId
    })
    if(!updatePost){
        throw new ApiError(500, "Post update failed");
    }
    await User.findByIdAndUpdate(req.user._id, {
        $set:{
            postId: updatePost._id
        }
    })
    return res.status(200).json(new ApiResponse(200, updatePost, "Post updated"))
})
export {createPost, getAllPosts, deletePost, updatePost}