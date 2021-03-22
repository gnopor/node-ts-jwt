// imports
import { Request } from "express";
import { verify } from "jsonwebtoken";

const ACCESS_TOKEN_SECRET: string =
  process.env.ACCESS_TOKEN_SECRET || "test access";

// main code
const isAuth = (req: Request) => {
  const authorization = req.headers["authorization"];
  if (!authorization) throw new Error("You need to login");
  // 'bearer  afdsljsdfjsafdhiljdsalflsdojfljasfhdsjfjsdoahfl'
  const token = authorization.split(" ")[1];
  return verify(token, ACCESS_TOKEN_SECRET);
};

export { isAuth };
