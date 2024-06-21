import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/uploadCloudinary.js";
import { Post } from "../models/post.model.js";
import { deleteOnCloudinary } from "../utils/deleteCloudinary.js";

const createPost = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    if (!(title && description)) {
        return res.status(400).send(new ApiError(400, "All fields are required"));
    }
    const postImageLocalPath = req.file?.path;
    if (!postImageLocalPath) {
        return res.status(400).send(new ApiError(400, "Please enter a valid Post Image Local Path"));
    }
    const postImage = await uploadOnCloudinary(postImageLocalPath);
    if (!postImage) {
        return res.status(400).send(new ApiError(400, "No Post Image uploaded"));
    }
    const publicId = postImage.public_id;
    const post = await Post.create({
        postFile: postImage?.url,
        publicId,
        owner: req.user?._id,
        title,
        description
    });
    if (!post) {
        return res.status(400).send(new ApiError(400, "No post uploaded"));
    }

    await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            score: req.user.score + 10,
        },
        $addToSet: {
            post: post._id
        }
    }, { new: true });

    return res.status(200).json(new ApiResponse(200, post, "Post created"));
});

const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({});
    return res.status(200).json(new ApiResponse(200, posts, "All posts"));
});

const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    if (!postId) {
        return res.status(400).send(new ApiError(400, "No post id"));
    }

    if (!req.user.post.includes(postId)) {
        return res.status(403).send(new ApiError(403, "No post found with id " + postId));
    }

    const deleteP = await Post.findByIdAndDelete(postId);
    const cloud = await deleteOnCloudinary(deleteP.publicId);
    if (!cloud) {
        return res.status(403).send(new ApiError(403, "No post deleted on cloud " + deleteP.publicId));
    }
    if (!deleteP) {
        return res.status(500).send(new ApiError(500, "Post deletion failed"));
    }

    await User.findByIdAndUpdate(req.user?._id, {
        $pull: {
            post: postId
        },
        $set: {
            score: req.user.score - 10,
        }
    });

    return res.status(200).json(new ApiResponse(200, deleteP, "Post deleted successfully"));
});

const updatePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    if (!postId) {
        return res.status(400).send(new ApiError(400, "No post id"));
    }
    if (!req.user.post.includes(postId)) {
        return res.status(403).send(new ApiError(403, "No post found with id " + postId));
    }
    const { title, description } = req.body;
    if (!(title && description)) {
        return res.status(400).send(new ApiError(400, "All fields are required"));
    }
    const postImageLocalPath = req.file?.path;
    if (!postImageLocalPath) {
        return res.status(400).send(new ApiError(400, "Please enter a valid postImageLocalPath"));
    }
    const postImage = await uploadOnCloudinary(postImageLocalPath);
    if (!postImage) {
        return res.status(400).send(new ApiError(400, "No Post Image uploaded"));
    }
    const publicId = postImage?.public_id;
    const updatedPost = await Post.findByIdAndUpdate(postId, {
        title, description, postFile: postImage.url, publicId
    }, { new: true });

    if (!updatedPost) {
        return res.status(500).send(new ApiError(500, "Post update failed"));
    }
    const cloud = await deleteOnCloudinary(updatedPost.publicId);
    if (!cloud) {
        return res.status(403).send(new ApiError(403, "No post deleted on cloud " + updatedPost.publicId));
    }
    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            postId: updatedPost._id
        }
    });
    return res.status(200).json(new ApiResponse(200, updatedPost, "Post updated"));
});

const likePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    if (!postId) {
        return res.status(400).send(new ApiError(400, "No post id"));
    }
    const like = await Post.findByIdAndUpdate(postId, {
        $inc: {
            likes: 1
        }
    }, { new: true });

    if (!like) {
        return res.status(400).send(new ApiError(400, "Post like failed"));
    }
    await User.findByIdAndUpdate(like.owner, {
        $inc: {
            score: 20
        }
    });
    return res.status(200).json(new ApiResponse(200, like, "Post liked successfully"));
});

const unLikePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    if (!postId) {
        return res.status(400).send(new ApiError(400, "No post id"));
    }
    const unLike = await Post.findByIdAndUpdate(postId, {
        $inc: {
            likes: -1
        }
    }, { new: true });

    if (!unLike) {
        return res.status(400).send(new ApiError(400, "Post unlike failed"));
    }
    await User.findByIdAndUpdate(unLike.owner, {
        $inc: {
            score: -20
        }
    });
    return res.status(200).json(new ApiResponse(200, unLike, "Post unliked successfully"));
});

const dislikePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    if (!postId) {
        return res.status(400).send(new ApiError(400, "No post id"));
    }
    const dislike = await Post.findByIdAndUpdate(postId, {
        $inc: {
            dislikes: 1
        }
    }, { new: true });

    if (!dislike) {
        return res.status(400).send(new ApiError(400, "Post dislike failed"));
    }
    await User.findByIdAndUpdate(dislike.owner, {
        $inc: {
            score: -5
        }
    });
    return res.status(200).json(new ApiResponse(200, dislike, "Post disliked successfully"));
});

const unDislikePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    if (!postId) {
        return res.status(400).send(new ApiError(400, "No post id"));
    }
    const unDislike = await Post.findByIdAndUpdate(postId, {
        $inc: {
            dislikes: -1
        }
    }, { new: true });

    if (!unDislike) {
        return res.status(400).send(new ApiError(400, "Post undislike failed"));
    }
    await User.findByIdAndUpdate(unDislike.owner, {
        $inc: {
            score: 5
        }
    });
    return res.status(200).json(new ApiResponse(200, unDislike, "Post undisliked successfully"));
});

export { createPost, getAllPosts, deletePost, updatePost, likePost, unLikePost, dislikePost, unDislikePost };
