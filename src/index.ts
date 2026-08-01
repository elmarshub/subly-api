import express, { type Request, type Response } from "express";
import { clerkMiddleware } from "@clerk/express";
import appConfig from "./config/app.config.js";
import connectDatabase from "./database/database.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { arcjetMiddleware } from "./middlewares/arcjet.middleware.js";
import userRoutes from "./modules/user/user.routes.js";
import subscriptionRoutes from "./modules/subscription/subscription.routes.js";
import workflowRoutes from "./modules/workflow/workflow.routes.js";

const app = express();
const basePath = appConfig.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(clerkMiddleware());
app.use(arcjetMiddleware);

app.get("/", (_req: Request, res: Response) => {
  res.send("Welcome to the Subly API");
});

app.use(`${basePath}/users`, userRoutes);
app.use(`${basePath}/subscriptions`, subscriptionRoutes);
app.use(`${basePath}/workflows`, workflowRoutes);

app.use(errorHandler);

app.listen(Number(appConfig.PORT), async () => {
  console.log(`Server started on http://localhost:${appConfig.PORT}`);
  await connectDatabase();
});
