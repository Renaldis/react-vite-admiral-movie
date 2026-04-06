import { z } from "zod";

export const PermissionFormSchema = z.object({
  name: z.string().min(1),
  key: z.string().min(1),
  permissionKey: z.string().min(1),
});

export type PermissionFormData = z.infer<typeof PermissionFormSchema>;
