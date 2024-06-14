import { Router } from 'express';
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {createComment, deleteComment, getPostsComment, updateComment} from "../controllers/comment.controller.js";

const router = Router();

router.use(verifyJWT)
router.route("/create-comment/:postId").post(createComment)
router.route("/post-comment/:postId").get(getPostsComment)
router.route("/delete-comment/:commentId").delete(deleteComment)
router.route("/update-comment/:commentId").patch(updateComment)

export default router;