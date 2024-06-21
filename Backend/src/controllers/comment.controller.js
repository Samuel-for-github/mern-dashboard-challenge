import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import mongoose from "mongoose";

const createComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { postId } = req.params;
    if (!content) {
        return res.status(400).send(new ApiError(400, "All fields are required"));
    }
    const comment = await Comment.create({
        content,
        owner: req.user._id,
        post: postId
    });
    if (!comment) {
        return res.status(400).send(new ApiError(400, "No comment uploaded"));
    }

    await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            score: req.user.score + 2,
        }
    }, { new: true });

    return res.status(200).json(new ApiResponse(200, comment, "Comment created"));
});

const getPostsComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const id = new mongoose.Types.ObjectId(postId);
    const comment = await Comment.aggregate([{
        $match: {
            post: id,
        }
    }]);
    return res.status(200).json(new ApiResponse(200, comment, "All comments on this post"));
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    if (!commentId) {
        return res.status(400).send(new ApiError(400, "No comment id"));
    }
    const user = await Comment.findById(commentId);
    if (user.owner.toString() !== req.user._id.toString()) {
        return res.status(400).send(new ApiError(400, "Unauthorized request"));
    }

    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) {
        return res.status(500).send(new ApiError(500, "Comment deletion failed"));
    }
    await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            score: req.user.score - 2,
        }
    });
    return res.status(200).json(new ApiResponse(200, comment, "Comment deleted"));
});

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    if (!commentId) {
        return res.status(400).send(new ApiError(400, "No comment id"));
    }
    const user = await Comment.findById(commentId);
    if (user.owner.toString() !== req.user._id.toString()) {
        return res.status(400).send(new ApiError(400, "Unauthorized request"));
    }
    const { content } = req.body;
    if (!content) {
        return res.status(400).send(new ApiError(400, "Provide some content"));
    }
    const comment = await Comment.findByIdAndUpdate(commentId, {
        content
    }, { new: true });
    if (!comment) {
        return res.status(500).send(new ApiError(500, "Comment update failed"));
    }
    return res.status(200).json(new ApiResponse(200, comment, "Comment updated"));
});

export { createComment, getPostsComment, deleteComment, updateComment };
