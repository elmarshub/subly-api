import { Client as WorkflowClient } from "@upstash/workflow";
import appConfig from "../../config/app.config.js";

export class WorkflowService {
  private client = new WorkflowClient({
    baseUrl: appConfig.QSTASH.URL,
    token: appConfig.QSTASH.TOKEN,
  });

  async triggerReminder(subscriptionId: string) {
    const { workflowRunId } = await this.client.trigger({
      url: `${appConfig.SERVER_URL}${appConfig.BASE_PATH}/workflows/subscription/reminder`,
      body: { subscriptionId },
      headers: { "content-type": "application/json" },
    });

    return workflowRunId;
  }

  async cancelReminder(workflowRunId: string) {
    return this.client.cancel(workflowRunId);
  }
}
