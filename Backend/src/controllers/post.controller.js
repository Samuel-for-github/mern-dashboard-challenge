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
        throw new ApiError(400, "Please enter a valid Post Image Local Path");
    }
    const postImage = await uploadOnCloudinary(postImageLocalPath)
    if(!postImage) {
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
    if (!postId){
        throw new ApiError(400, "No post id")
    }

    if(!req.user.post.includes(postId)){
        throw new ApiError(403, "No post post found with id "+postId)
    }

    await User.findByIdAndUpdate(req.user?._id, {
        $pull:{
            post: postId
        },
        $set:{
            score: req.user.score-10,
        }
    })
    const deleteP = await Post.findByIdAndDelete(postId)
    if(!deleteP){
        throw new ApiError(500, "Post deletion failed")
    }
    return res.status(200).json(new ApiResponse(200, deleteP, "Post deleted successfully"))
})
const updatePost=asyncHandler(async (req,res)=>{
    const {postId} = req.params
    if (!postId){
        throw new ApiError(400, "No post id")
    }
    if(!req.user.post.includes(postId)){
        throw new ApiError(403, "No post post found with id "+postId)
    }
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
const likePost=asyncHandler(async (req,res)=>{
    const {postId} = req.params
    if(!postId){
        throw new ApiError(400,"No post id")
    }
    const like = await Post.findByIdAndUpdate(postId, {
        $inc:{
            likes: 1
        }
    })

    if(!like){
        throw new ApiError(400,"Post like failed")
    }
    await User.findByIdAndUpdate(like.owner, {
        $inc:{
            score: 20
        }
    })
    return res.status(200).json(new ApiResponse(200, like, "Post liked successfully"))

})
const unLikePost = asyncHandler(async (req,res)=>{
    const {postId} = req.params
    if(!postId){
        throw new ApiError(400,"No post id")
    }
    const unLike = await Post.findByIdAndUpdate(postId, {
        $inc:{
            likes: -1
        }
    })

    if(!unLike){
        throw new ApiError(400,"Post like failed")
    }
    await User.findByIdAndUpdate(unLike.owner, {
        $inc:{
            score: -20
        }
    })
    return res.status(200).json(new ApiResponse(200, unLike, "Post unliked successfully"))

})
const dislikePost=asyncHandler(async (req,res)=>{
    const {postId} = req.params
    if(!postId){
        throw new ApiError(400,"No post id")
    }
    const dislike = await Post.findByIdAndUpdate(postId, {
        $inc:{
            dislikes: 1
        }
    })

    if(!dislike){
        throw new ApiError(400,"Post dislike failed")
    }
    await User.findByIdAndUpdate(dislike.owner, {
        $inc:{
            score: -5
        }
    })
    return res.status(200).json(new ApiResponse(200, dislike, "Post disliked successfully"))

})
const unDislikePost=asyncHandler(async (req,res)=>{
    const {postId} = req.params
    if(!postId){
        throw new ApiError(400,"No post id")
    }
    const unDislike = await Post.findByIdAndUpdate(postId, {
        $inc:{
            dislikes: -1
        }
    })

    if(!unDislike){
        throw new ApiError(400,"Post dislike failed")
    }
    await User.findByIdAndUpdate(unDislike.owner, {
        $inc:{
            score: 5
        }
    })
    return res.status(200).json(new ApiResponse(200, unDislike, "Post un-disliked successfully"))

})
export {createPost, getAllPosts, deletePost, updatePost,likePost, unLikePost, dislikePost, unDislikePost }