// imports
import { Request, Response } from "express";
import { verify } from "jsonwebtoken";

// blacklisted token
const blacklist: string[] = [];
const ACCESS_TOKEN_SECRET: string =
  process.env.ACCESS_TOKEN_SECRET || "test access";

// main code

// --> add token to the blaclist
const blacklistToken = (req: Request) => {
  const authorization = req.headers["authorization"];
  if (!authorization) throw new Error("You need to login");

  const token = authorization.split(" ")[1];
  blacklist.push(token);
};

// ==>  decorator
// --> check if current user is authenticated
const jwt_required = (
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    const req: Request = args[0];
    const res: Response = args[1];
    try {
      if (!!req) {
        const authorization = req.headers["authorization"] || "";
        if (!authorization) {
          return res.status(400).send({ error: "You need to login" });
        }

        const token = authorization.split(" ")[1];
        if (blacklist.includes(token)) {
          return res.status(400).send({ error: "You have logged out" });
        }

        const payload: any = verify(token, ACCESS_TOKEN_SECRET);
        if (!String(payload.userId)) {
          return res.status(400).send({ error: "Your session expired" });
        }
        return originalMethod.apply(this, args);
      }
    } catch (error) {
      return res
        .status(400)
        .send({ error: "There is a problem with your session" });
    }
  };

  return descriptor;
};

export { blacklistToken, jwt_required };
