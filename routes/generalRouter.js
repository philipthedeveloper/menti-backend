import { routerCreator } from "../helpers/index.js";
// Import the controllers
import { homeRoute } from "../controllers/index.js";

// Create a new router
export const generalRouter = routerCreator();

generalRouter.get("/", homeRoute);
