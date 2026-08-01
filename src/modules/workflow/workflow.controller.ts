import dayjs from "dayjs";
import { createRequire } from "module";
import SubscriptionModel from "../../database/models/subscription.model.js";
import UserModel from "../../database/models/user.model.js";
import { sendReminderEmail } from "../../mailers/mailer.js";

// @upstash/workflow's Express adapter is CommonJS-only, so it's pulled in
// via createRequire rather than a normal ESM import.
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");

const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context: any) => {
  const { subscriptionId } = context.requestPayload;

  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || subscription.status !== "active") return;

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `Subscription ${subscriptionId} is due for renewal. Stopping workflow.`,
    );
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");

    if (reminderDate.isAfter(dayjs())) {
      await context.sleepUntil(
        `Reminder ${daysBefore} days before`,
        reminderDate.toDate(),
      );
    }

    if (dayjs().isSame(reminderDate, "day")) {
      await triggerReminder(
        context,
        `${daysBefore} days before reminder`,
        subscription,
      );
    }
  }
});

const fetchSubscription = async (context: any, subscriptionId: string) => {
  return context.run("get subscription", async () => {
    const subscription = await SubscriptionModel.findById(
      subscriptionId,
    ).lean();
    if (!subscription) return null;

    const user = await UserModel.findOne({
      clerkId: subscription.userId,
    }).lean();

    return { ...subscription, user };
  });
};

const triggerReminder = async (
  context: any,
  label: string,
  subscription: any,
) => {
  return context.run(label, async () => {
    console.log(`Triggering ${label} reminder`);

    await sendReminderEmail({
      to: subscription.user.email,
      type: label,
      subscription,
    });
  });
};
