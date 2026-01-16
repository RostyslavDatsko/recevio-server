import { Router } from "express";
import multer from "multer";
import { uploadReceipt } from "../controllers/upload.controller.js";

const router = Router();

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("photo"), uploadReceipt);

export default router;
