import express from "express";
import dotenv from "dotenv";
import core from "cors"; 

//local import
import aiRoutes from "./routes/aiRoutes.js";
import { connectDB } from "./config/db.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(core());
app.use(express.json());

app.use("/api/ai", aiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
