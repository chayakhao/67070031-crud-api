import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  studentCreateSchema,
  studentIdParamsSchema,
  studentUpdateSchema,
} from "../schemas/students.js";
import {
  createStudent,
  deleteStudent,
  getStudentById,
  getStudents,
  studentIdTaken,
  updateStudent,
} from "../services/students.js";

export const studentsController = new Hono();

// READ ALL — GET /api/v1/students
studentsController.get("/", async (c) => c.json(await getStudents()));

// READ ONE — GET /api/v1/students/:id
studentsController.get(
  "/:id",
  zValidator("param", studentIdParamsSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const student = await getStudentById(id);

    if (!student) {
      return c.json({ error: "Student not found" }, 404);
    }

    return c.json(student);
  },
);

// CREATE — POST /api/v1/students
studentsController.post(
  "/",
  zValidator("json", studentCreateSchema),
  async (c) => {
    const input = c.req.valid("json");

    if (await studentIdTaken(input.studentId)) {
      return c.json({ error: "studentId already exists" }, 409);
    }

    const student = await createStudent(input);
    c.header("Location", `/api/v1/students/${student.id}`);
    return c.json(student, 201);
  },
);

// UPDATE — PATCH /api/v1/students/:id (send only the fields to change)
studentsController.patch(
  "/:id",
  zValidator("param", studentIdParamsSchema),
  zValidator("json", studentUpdateSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const changes = c.req.valid("json");

    if (
      changes.studentId !== undefined &&
      (await studentIdTaken(changes.studentId, id))
    ) {
      return c.json({ error: "studentId already exists" }, 409);
    }

    const student = await updateStudent(id, changes);

    if (!student) {
      return c.json({ error: "Student not found" }, 404);
    }

    return c.json(student);
  },
);

// DELETE — DELETE /api/v1/students/:id
studentsController.delete(
  "/:id",
  zValidator("param", studentIdParamsSchema),
  async (c) => {
    const { id } = c.req.valid("param");

    if (!(await deleteStudent(id))) {
      return c.json({ error: "Student not found" }, 404);
    }

    return c.body(null, 204);
  },
);
