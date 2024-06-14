import { Router } from 'express';
import {
    changePassword, getMyPost,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser, updateUserDetails, updateUserProfileImage,
    userInfo
} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(upload.single("profileImage"),registerUser)
//secure route
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/get-user").get(verifyJWT,userInfo);
router.route("/change-password").post(verifyJWT,changePassword);
router.route("/update-user-details").post(updateUserDetails);
router.route("/change-profile-image").patch(verifyJWT, upload.single("profileImage"), updateUserProfileImage);
router.route("/my-post").get(verifyJWT, getMyPost);
export default router;