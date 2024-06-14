import { Router } from 'express';
import {upload} from "../middlewares/multer.middleware.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {
    createPost,
    deletePost,
    dislikePost,
    getAllPosts,
    likePost, unDislikePost,
    unLikePost,
    updatePost
} from "../controllers/post.controller.js";
const router = Router();
router.route("/").get(getAllPosts)
router.use(verifyJWT)
router.route("/create-post").post(upload.single("postFile"),createPost)
router.route("/delete-post/:postId").delete(deletePost)
router.route("/update-post/:postId").patch(upload.single("postFile"),updatePost)
router.route("/like-post/:postId").post(likePost)
router.route("/un-like-post/:postId").post(unLikePost)
router.route("/dislike-post/:postId").post(dislikePost)
router.route("/un-dislike-post/:postId").post(unDislikePost)
export default router;