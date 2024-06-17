import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {User} from "../models/user.model.js";
import {Comment} from "../models/comment.model.js";
import mongoose from "mongoose";

const createComment=asyncHandler(async (req, res) => {
    const {content} = req.body
    const {postId} = req.params
    if(!content){
        new ApiResponse(400, null,"All fields are required")
    }
    const comment = await Comment.create({
      content,
        owner: req.user._id,
        post: postId
    })
    if(!comment){
        new ApiResponse(400, null,"No comment uploaded");
    }

    await User.findByIdAndUpdate(req.user?._id,{
        $set:{
            score: req.user.score+2,
        }
    },{new: true})

    return res.status(200).json(new ApiResponse(200, comment, "Post created"))
})
const getPostsComment=asyncHandler(async (req, res)=>{
    const {postId} = req.params
    const id = new mongoose.Types.ObjectId(postId)
    const comment = await Comment.aggregate([{
        $match:{
            post: id,
        }
    }])
    return res.status(200).json(new ApiResponse(200, comment, "All comment on this posts"))
})
const deleteComment = asyncHandler(async (req, res)=>{
    const {commentId}=req.params
    if(!commentId){
        new ApiResponse(400, null,"No comment id")
    }
    const user = await Comment.findById(commentId)
    if (user.owner.toString() !== req.user._id.toString()){
        new ApiResponse(400, null,"Unauthorised request");
    }

    const comment=await Comment.findByIdAndDelete(commentId)

    if(!comment){
        new ApiResponse(500, null,"Comment deletion failed")
    }
    await User.findByIdAndUpdate(req.user?._id,{
        $set:{
            score: req.user.score-2,
        }
    })
    return res.status(200).json(new ApiResponse(200, comment, "Comment deleted"))
})
const updateComment=asyncHandler(async (req,res)=>{
    const {commentId} = req.params
    if (!commentId){
        new ApiResponse(400, null,"No comment id")
        throw new ApiError(400, "No comment id")
    }
    const user = await Comment.findById(commentId)
    if (user.owner.toString() !== req.user._id.toString()){
        new ApiResponse(400, null,"Unauthorised request")
    }
    const {content} = req.body
    if(!content){
        new ApiResponse(400, null,"Provide some content")
    }
    const comment=await Comment.findByIdAndUpdate(commentId,{
        content
    })
    if(!comment){
        new ApiResponse(400, null,"Comment update failed")
    }
    return res.status(200).json(new ApiResponse(200, comment, "Comment updated"))
})
export {createComment, getPostsComment, deleteComment, updateComment}