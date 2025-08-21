import express, { Request, Response } from "express";
import dotenv from "dotenv";
import core from "cors"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(core());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the backend server!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
