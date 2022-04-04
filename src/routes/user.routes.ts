import express from "express";
import { UserControllers } from "../controllers";
const router = express.Router();

router.post("/", UserControllers.checkoutABook);
router.post("/", UserControllers.returnABook);
router.get("/", UserControllers.listAllBooksByUser);

export default router;
