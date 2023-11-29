import "express-async-errors";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  routeNotFound,
  errorHandler,
  methodChecker,
  requestLogger,
  validateToken,
} from "./middlewares/index.js";
import { generalRouter, authRouter } from "./routes/index.js";
import connectDB from "./database/connection/mongodb.js";
dotenv.config({ path: ".env" });
const app = express();
const PORT = process.env.PORT;
const HOSTNAME = process.env.HOST;

// Setup the parent router
const apiV1Router = express.Router();

// Middlewares
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : [];
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.168.137.1:5173",
      ...corsOrigins,
    ],
    credentials: true,
  })
);

// Add middleware to handle multipart/form-data requests
app.use(methodChecker); // Checks if the incoming request method is supported
app.use(express.urlencoded({ extended: true })); // Parse urlencoded data in request body
app.use(express.json({})); // Parse json data in request body
app.use(requestLogger); // Log any incoming request to the console

// Mount the individual routers on the common prefix router
apiV1Router.use("/", generalRouter);
apiV1Router.use("/auth", authRouter);

// Add all endpoint router here using app.use("path", router)
app.use("/menti/api/v1", apiV1Router);

// All route that are not handled from the top will be handled here
app.all("*", routeNotFound); // Returns a 404 response for such routes
app.use(errorHandler); // Handles all error in the app

const startServer = () =>
  app.listen(PORT, HOSTNAME, () => {
    console.log(`Server listening on http://${HOSTNAME}:${PORT}`);
  });

connectDB(startServer);
