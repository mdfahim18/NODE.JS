import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.post("/", userController.createUser);
router.get("/", auth, userController.getAllUsers);
router.get("/:id", userController.getSingleUser); // id dynamic. : na dile direct url e hit korbe
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export const userRoute = router;
