import { z } from 'zod';

export const RoleFormSchema = z.object({
  name: z.string().min(1),
  roleKey: z.string().min(1),
  permissions_ids: z.array(z.string()).min(1),
});

export type RoleFormData = z.infer<typeof RoleFormSchema>;
