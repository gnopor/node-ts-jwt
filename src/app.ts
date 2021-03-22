import express, { Application } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

// import routes
import authRoutes from "./auth/route";

// create app
const app: Application = express();
const PORT = process.env.PORT;

// middleware
app.use(cors({ credentials: true }));
app.use(cookieParser());
app.use(express.static("static"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// load app
app.use("/auth", authRoutes);

// run app
app.listen(PORT, () => {
  console.log(`Listening on localhost:${PORT}`);
});
