import express from "express";
import cookieParser from "cookie-parser";
import { connectDB, env } from "./config/index.js";
import router from "./routes/index.js";
import cors from "cors";
import helmet from "helmet";

const app = express();

async function main() {
  try {
  await connectDB();
  console.log("Connected to MongoDB");

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet());

  app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
  }));
  
  app.use("/api", router);

  app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

main();

export default app;
