import express from "express";
import { Register, Login, GetProfile, Logout } from "../controller/user.controller.js";
import { auth } from "../middleware/auth.js";

const UserRouter = express.Router();

UserRouter.post("/register", Register);
UserRouter.post("/login", Login);
UserRouter.post("/logout", Logout);
UserRouter.get("/profile", auth, GetProfile);

export default UserRouter;
