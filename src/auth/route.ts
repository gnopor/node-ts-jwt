import express, { Router } from "express";
const authRoute: Router = express.Router();

import authController from "./controller";

// 1. Register a user
authRoute.post("/register", authController.register);

// 2. login user
authRoute.post("/login", authController.login);

// 3. Logout a user
authRoute.get("/logout", authController.logout);

// 4. Protected route
authRoute.get("/protected", authController.protectedTest);

// 5. Get a new access token with a refresh token
authRoute.get("/refresh_token", authController.refresh);

export default authRoute;
