import { z } from "zod";

export const clerkWebhookEventSchema = z.object({
  type: z.string(),
  data: z.object({
    id: z.string(),
    first_name: z.string().nullish(),
    last_name: z.string().nullish(),
    email_addresses: z
      .array(z.object({ id: z.string(), email_address: z.string() }))
      .optional(),
    primary_email_address_id: z.string().nullish(),
  }),
});

export type ClerkWebhookEvent = z.infer<typeof clerkWebhookEventSchema>;
