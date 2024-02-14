import { z } from 'zod';

export const notificationsFormSchema = z.object({
  type: z.enum(['all', 'mentions', 'none'], {
    required_error: 'You need to select a notification type.'
  }),
  mobile: z.boolean().default(false).optional(),
  communicationEmails: z.boolean().default(false).optional(),
  socialEmails: z.boolean().default(false).optional(),
  marketingEmails: z.boolean().default(false).optional(),
  securityEmails: z.boolean()
});

export type NotificationsFormFields = z.infer<typeof notificationsFormSchema>;
