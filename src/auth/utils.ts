// imports
import { Request } from "express";
import { verify } from "jsonwebtoken";

// blacklisted token
const blacklist: string[] = [];
const ACCESS_TOKEN_SECRET: string =
  process.env.ACCESS_TOKEN_SECRET || "test access";

// main code
// --> check if current user is authenticated
const isAuth = (req: Request) => {
  const authorization = req.headers["authorization"];
  if (!authorization) throw new Error("You need to login");

  // 'bearer  afdsljsdfjsafdhiljdsalflsdojfljasfhdsjfjsdoahfl'
  const token = authorization.split(" ")[1];
  if (blacklist.includes(token)) throw new Error("You have logged out");

  return verify(token, ACCESS_TOKEN_SECRET);
};

// --> add token to the blaclist
const blacklistToken = (req: Request) => {
  const authorization = req.headers["authorization"];
  if (!authorization) throw new Error("You need to login");

  const token = authorization.split(" ")[1];
  blacklist.push(token);
};

export { isAuth, blacklistToken };
