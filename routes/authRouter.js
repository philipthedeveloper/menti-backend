import { routerCreator } from "../helpers/index.js";
import { validateToken } from "../middlewares/index.js";
import {
  register,
  login,
  logout,
  getUser,
  deleteUser,
} from "../controllers/index.js";
export const authRouter = routerCreator();

authRouter.post("/register", register);
authRouter.post("/sign-in", login);
authRouter.post("/logout", validateToken, logout);
authRouter.get("/get-user", validateToken, getUser);
authRouter.delete("/remove-user", validateToken, deleteUser);
