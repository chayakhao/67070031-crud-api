import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { studentsController } from "./students.js";

const apiToken = process.env.SECRET_PASSWORD;

if (!apiToken) {
  throw new Error("SECRET_PASSWORD is required");
}

const auth = bearerAuth({ token: apiToken });

export const apiController = new Hono();

// GET (ดูข้อมูล) เปิดให้ทุกคน, POST/PATCH/DELETE ต้องใช้ token
apiController.use("*", async (c, next) => {
  if (c.req.method === "GET") {
    return next();
  }
  return auth(c, next);
});

apiController.route("/students", studentsController);
