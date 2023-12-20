import { routerCreator } from "../helpers/index.js";
import { validateToken } from "../middlewares/index.js";
import { register, login, logout, getUser } from "../controllers/index.js";
export const authRouter = routerCreator();

authRouter.post("/register", register);
authRouter.post("/sign-in", login);
authRouter.post("/logout", validateToken, logout);
authRouter.post("/get-user", validateToken, getUser);
