import express, { Application, Request, Response } from "express";
import morgan from "morgan";

// import routes
import authRoutes from "./auth/route";

// create app
const app: Application = express();
const PORT = process.env.PORT || 5000;

// middleware
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
