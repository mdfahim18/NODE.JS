import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../types";

const router = Router();

router.post("/", userController.createUser);
router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.agent),
  userController.getAllUsers
);
router.get(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.agent, USER_ROLE.user),
  userController.getSingleUser
); // id dynamic. : na dile direct url e hit korbe
(auth(USER_ROLE.admin, USER_ROLE.user),
  router.put("/:id", userController.updateUser));
router.delete("/:id", userController.deleteUser);

export const userRoute = router;
