import dayjs from "dayjs";
import nodemailer from "nodemailer";
import appConfig from "../config/app.config.js";
import { emailTemplates } from "./templates/reminder.template.js";

const accountEmail = appConfig.EMAIL.USER;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: appConfig.EMAIL.USER,
    pass: appConfig.EMAIL.PASSWORD,
  },
});

interface ReminderSubscription {
  name: string;
  price: number;
  currency: string;
  billing: string;
  paymentMethod?: string;
  renewalDate: Date | string;
  user: {
    name: string;
    email: string;
  };
}

interface SendReminderEmailParams {
  to: string;
  type: string;
  subscription: ReminderSubscription;
}

export const sendReminderEmail = async ({
  to,
  type,
  subscription,
}: SendReminderEmailParams) => {
  if (!to || !type) throw new Error("Missing required parameters");

  const template = emailTemplates.find((t) => t.label === type);
  if (!template) throw new Error("Invalid email type");

  const mailInfo = {
    userName: subscription.user.name,
    subscriptionName: subscription.name,
    renewalDate: dayjs(subscription.renewalDate).format("MMM D, YYYY"),
    planName: subscription.name,
    price: `${subscription.currency} ${subscription.price} (${subscription.billing})`,
    paymentMethod: subscription.paymentMethod ?? "N/A",
    accountSettingsLink: `${appConfig.SERVER_URL}/account/settings`,
    supportLink: `${appConfig.SERVER_URL}/support`,
  };

  const subject = template.generateSubject(mailInfo);
  const html = template.generateBody(mailInfo);

  const info = await transporter.sendMail({
    from: accountEmail,
    to,
    subject,
    html,
  });

  console.log(`Reminder email sent (messageId: ${info.messageId})`);
};
