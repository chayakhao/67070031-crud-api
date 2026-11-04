import { asc, eq } from "drizzle-orm";
import db from "../db/index.js";
import { students, type NewStudent } from "../db/schema.js";

export type StudentInput = Omit<NewStudent, "id" | "createdAt" | "updatedAt">;
export type StudentChanges = Partial<StudentInput>;

export async function getStudents() {
  return db.select().from(students).orderBy(asc(students.id));
}

export async function getStudentById(id: number) {
  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.id, id))
    .limit(1);
  return student;
}

export async function studentIdTaken(studentId: string, exceptId?: number) {
  const [found] = await db
    .select({ id: students.id })
    .from(students)
    .where(eq(students.studentId, studentId))
    .limit(1);
  return found !== undefined && found.id !== exceptId;
}

export async function createStudent(input: StudentInput) {
  const [student] = await db.insert(students).values(input).returning();

  if (!student) {
    throw new Error("Created student was not returned");
  }

  return student;
}

export async function updateStudent(id: number, changes: StudentChanges) {
  const [student] = await db
    .update(students)
    .set(changes)
    .where(eq(students.id, id))
    .returning();
  return student;
}

export async function deleteStudent(id: number): Promise<boolean> {
  const [deleted] = await db
    .delete(students)
    .where(eq(students.id, id))
    .returning({ id: students.id });
  return deleted !== undefined;
}
