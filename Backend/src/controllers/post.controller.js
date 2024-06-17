import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/uploadCloudinary.js";
import {Post} from "../models/post.model.js";
import {deleteOnCloudinary} from "../utils/deleteCloudinary.js";

const createPost=asyncHandler(async (req, res) => {
    const {title, description} = req.body;
    if(!(title && description)){
        throw new ApiError(400, "All fields are required");
    }
    const postImageLocalPath = req.file?.path
    if(!postImageLocalPath){
        new ApiResponse(401, null,"Please enter a valid Post Image Local Path")
    }
    const postImage = await uploadOnCloudinary(postImageLocalPath)
    if(!postImage) {
        new ApiResponse(401, null,"No Post Image uploaded")
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
        new ApiResponse(401, null,"No post uploaded")
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
        new ApiResponse(400, null,"No post id")
    }

    if(!req.user.post.includes(postId)){
        new ApiResponse(401, null,"No post found")
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
   const cloud = await deleteOnCloudinary(deleteP.publicId)
    if(!cloud){
        new ApiResponse(401, null,"No post deleted on cloudinary ")
    }
    if(!deleteP){
        new ApiResponse(401, null,"Post deletion failed")
    }
    return res.status(200).json(new ApiResponse(200, deleteP, "Post deleted successfully"))
})
const updatePost=asyncHandler(async (req,res)=> {
    const {postId} = req.params
    if (!postId){

        throw new ApiError(400, "No post id")
    }
    if(!req.user.post.includes(postId)){
        new ApiResponse(400, null,"No post id")
    }
    const {title, description} = req.body
    if(!(title && description)){
        new ApiResponse(400, null,"All fields are required")
    }
    const postImageLocalPath = req.file?.path
    if(!postImageLocalPath){
        new ApiResponse(400, null,"Please enter a valid post image local path")
    }
    const postImage = await uploadOnCloudinary(postImageLocalPath)
    if(!postImage){
        new ApiResponse(400, null,"No post image uploaded")
    }
    const publicId = postImage?.public_id
    const updatePost=await Post.findByIdAndUpdate(postId,{
        title,description,postFile: postImage.url,publicId
    })

    if(!updatePost){
        new ApiResponse(400, null,"No post updated")
    }
    const cloud = await deleteOnCloudinary(updatePost.publicId)
    if(!cloud){
        new ApiResponse(403, null,"No post deleted on cloudinary")
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
        new ApiResponse(400, null,"No post id")
    }
    const like = await Post.findByIdAndUpdate(postId, {
        $inc:{
            likes: 1
        }
    })

    if(!like){
        new ApiResponse(400, null,"Post like failed")
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
        new ApiResponse(400, null,"No post id")
    }
    const unLike = await Post.findByIdAndUpdate(postId, {
        $inc:{
            likes: -1
        }
    })

    if(!unLike){
        new ApiResponse(400, null,"Post unlike falied")
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
        new ApiResponse(400, null,"No post id")
    }
    const dislike = await Post.findByIdAndUpdate(postId, {
        $inc:{
            dislikes: 1
        }
    })

    if(!dislike){
        new ApiResponse(400, null,"Post dislike failed")
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
        new ApiResponse(400, null,"No post id")
    }
    const unDislike = await Post.findByIdAndUpdate(postId, {
        $inc:{
            dislikes: -1
        }
    })

    if(!unDislike){
        new ApiResponse(400, null,"Post unDislike failed")
    }
    await User.findByIdAndUpdate(unDislike.owner, {
        $inc:{
            score: 5
        }
    })
    return res.status(200).json(new ApiResponse(200, unDislike, "Post un-disliked successfully"))

})
export {createPost, getAllPosts, deletePost, updatePost,likePost, unLikePost, dislikePost, unDislikePost }