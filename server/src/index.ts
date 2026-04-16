import express from "express";
import cookieParser from "cookie-parser";
import { connectDB, env } from "./config/index.js";
import router from "./routes/index.js";
import cors from "cors";
import helmet from "helmet";

const app = express();

const defaultCorsOrigins = [
  "https://web-genie-ai.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://web-genie-6ufr70cyw-hemant-sharmas-projects.vercel.app",
  "https://itshemant.me",
];

async function main() {
  try {
  await connectDB();
  console.log("Connected to MongoDB");

  app.use(cookieParser());

  const allowedOrigins = [
    ...new Set([...defaultCorsOrigins, ...env.CORS_ORIGINS]),
  ];

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          // Use `false` (not Error): thrown errors often skip CORS headers and
          // the browser only shows a misleading "CORS" failure.
          console.warn(`[cors] blocked origin: ${origin}`);
          callback(null, false);
        }
      },
      credentials: true,
    }),
  );

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
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
