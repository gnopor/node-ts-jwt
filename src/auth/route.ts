import express, { Router } from "express";
const authRoute: Router = express.Router();

// 1. Register a user
authRoute.post("/register", (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);

  res.json({ message: "test" });
});

// // 2. login user
// authRoute.post("/login", );

// // 3. Logout a user
// authRoute.get("/logout", );

// // 4. Protected route
// authRoute.get("/protected", );

// // 5. Get a new access token with a refresh token
// authRoute.get("/refresh_token", );

export default authRoute;
