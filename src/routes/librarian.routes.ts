import express from "express";
import { LibrarianControllers } from "../controllers";
const router = express.Router();

router.get("/", LibrarianControllers.getAllBooks);
router.delete("/:id", LibrarianControllers.removeBookById);
router.post("/", LibrarianControllers.addAbook);

export default router;
