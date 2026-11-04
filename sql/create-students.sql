-- ใช้ไฟล์นี้เฉพาะกรณีที่ไม่ได้รัน `npm run db:generate && npm run db:migrate`
-- (เช่น อยากสร้างตารางเองผ่าน DBeaver) — ถ้าใช้ drizzle migrate แล้ว ไม่ต้องรันไฟล์นี้

CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other');

CREATE TABLE "students" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"student_id" text NOT NULL,
	"birth_date" date NOT NULL,
	"gender" "gender" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "students_student_id_unique" UNIQUE("student_id")
);
