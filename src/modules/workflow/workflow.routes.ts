import { Router } from "express";
import { sendReminders } from "./workflow.controller.js";

const workflowRoutes = Router();

workflowRoutes.post("/subscription/reminder", sendReminders);

export default workflowRoutes;
