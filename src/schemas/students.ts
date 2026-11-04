import { z } from "zod";
import { positiveIdSchema } from "./common.js";

export const studentIdParamsSchema = z.strictObject({
  id: positiveIdSchema,
});

export const studentCreateSchema = z.strictObject({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  studentId: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9-]{1,20}$/, "must be 1-20 letters, digits or dashes"),
  birthDate: z.iso
    .date()
    .refine((d) => new Date(d) <= new Date(), "birthDate cannot be in the future"),
  gender: z.enum(["male", "female", "other"]),
});

export const studentUpdateSchema = studentCreateSchema.partial().refine(
  (student) => Object.keys(student).length > 0,
  { message: "At least one student field is required" },
);
