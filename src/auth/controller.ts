// importation
import { Request, Response } from "express";
import { hash, compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";

import { blacklistToken, jwt_required } from "./utils";
import fakeDB from "./model";
// --> helpers
const ACCESS_TOKEN_SECRET: string =
  process.env.ACCESS_TOKEN_SECRET || "test access";
const REFRESH_TOKEN_SECRET: string =
  process.env.REFRESH_TOKEN_SECRET || "test refress";

// --> main code
// register

class AuthCotroller {
  constructor() {}

  register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      // 1. Check if user exist
      const user = fakeDB.find((user) => user.email === email);
      if (user) throw new Error("User already exist");

      // 2. If not user, hash password
      const hashedPassword = await hash(password, 10);

      // 3. Insert the user in 'database'
      fakeDB.push({
        id: fakeDB.length,
        email,
        password: hashedPassword,
      });

      // console.log(fakeDB);
      res.send({ message: "User created" });
    } catch (err) {
      res.status(400).send({ error: `${err.message}` });
    }
  };

  // login
  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      // 1. Find user in "database". If not exist send error
      const user = fakeDB.find((user) => user.email === email);
      if (!user) throw new Error("User does not exist");

      // 2. Compare crypted password and see if checks. Send error if not
      const valid = await compare(password, user.password);
      if (!valid) throw new Error("Password not correct");

      // 3. Create access and refresh token
      const access_token: string = await sign(
        { userId: user.id },
        ACCESS_TOKEN_SECRET,
        {
          expiresIn: "7d",
        }
      );

      const refresh_token: string = await sign(
        { userId: user.id },
        REFRESH_TOKEN_SECRET,
        {
          expiresIn: "7d",
        }
      );

      // 4. Put the refreshtoken in the database

      // 5. Send token.

      res
        .cookie("refresh_token", refresh_token, {
          httpOnly: true, // this will ensure that the token can't be access into client
          path: "/refresh_token",
          // secure: true,
          // sameSite: "none",
        })
        .json({
          access_token,
          refresh_token,
        });
    } catch (err) {
      res.status(400).send({ error: `${err.message}` });
    }
  };

  // logout
  @jwt_required
  async logout(req: Request, res: Response) {
    try {
      // we attemps logout, clear frontend storage of access_token
      res.clearCookie("refresh_token", { path: "/refresh_token" });
      blacklistToken(req);
      return res.send({
        message: "Logged out",
      });
    } catch (err) {
      res.send({ Error: err.message });
    }
  }

  // Protected route
  @jwt_required
  async protectedTest(req: Request, res: Response) {
    try {
      res.send({
        data: "This is protected data.",
      });
    } catch (err) {
      res.status(400).send({ error: `${err.message}` });
    }
  }

  // refresh
  // note: this has a problem we use response.cookie() to set cookie instead of writehead
  refresh = (req: Request, res: Response) => {
    const token = req.cookies.refresh_token; // we can do this because we have install cookie-parser

    // If we don't have a token in our request
    if (!token) return res.send({ accesstoken: "" });
    // We have a token, let's verify it!
    let payload: any = null;
    try {
      payload = verify(token, REFRESH_TOKEN_SECRET);
    } catch (err) {
      console.log({ accesstoken: "" });
    }
    // Token is valid, check if user exist
    const user = fakeDB.find((user) => user.id === payload.userId);
    if (!user) return res.send({ accesstoken: "" });

    // Token exist, create new Refresh and Access Token
    const accesstoken: string = sign({ userId: user.id }, ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    const refresh_token: string = sign(
      { userId: user.id },
      REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // All good to go. Send new refreshtoken and accesstoken
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true, // this will ensure that the token can't be access into client
      path: "/refresh_token",
    });

    return res.send({
      accesstoken,
      refresh_token,
    });
  };
}

const authController = new AuthCotroller();
export default authController;
