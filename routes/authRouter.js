import { routerCreator } from "../helpers/index.js";
import { register } from "../controllers/index.js";
export const authRouter = routerCreator();

authRouter.post("/register", register);
