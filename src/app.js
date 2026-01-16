import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import uploadRoutes from "./routes/upload.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use("/uploads", express.static("uploads"));

app.use(uploadRoutes);

export default app;
