import { date, integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", ["male", "female", "other"]);

export const students = pgTable("students", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  firstName: text("first_name").notNull(), // ชื่อ
  lastName: text("last_name").notNull(), // นามสกุล
  studentId: text("student_id").notNull().unique(), // รหัสประจำตัว
  birthDate: date("birth_date", { mode: "string" }).notNull(), // วันเกิด (YYYY-MM-DD)
  gender: genderEnum("gender").notNull(), // เพศ
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;
