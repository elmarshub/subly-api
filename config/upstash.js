import { Client as Workflow } from "@upstash/workflow";
import { QSTASH_URL, QSTASH_TOKEN } from "./env.js";

export const workflowClient = new Workflow({
  baseUrl: QSTASH_URL,
  token: QSTASH_TOKEN,
});
