import dayjs, { Dayjs } from "dayjs";
import { z } from "zod";

export const FAQSchema = z.object({
  category: z
    .string({ message: "Category is required" })
    .min(1, { message: "Category is required" }),
  question: z
    .string({ message: "Question is required" })
    .min(1, { message: "Question is required" }),
  answer: z.string({ message: "Answer is required" }).min(1, { message: "Answer is required" }),
  status: z.boolean().optional().default(true),
  valid_date: z.instanceof(dayjs as unknown as typeof Dayjs, {
    message: "Valid Until is required",
  }),
});

export type TFAQFormData = z.infer<typeof FAQSchema>;
