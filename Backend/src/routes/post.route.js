import { Router } from 'express';
import {upload} from "../middlewares/multer.middleware.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {createPost, deletePost, getAllPosts, updatePost} from "../controllers/post.controller.js";
const router = Router();
router.route("/").get(getAllPosts)
router.use(verifyJWT)
router.route("/create-post").post(upload.single("postFile"),createPost)
router.route("/delete-post/:postId").delete(deletePost)
router.route("/update-post/:postId").patch(upload.single("postFile"),updatePost)

export default router;