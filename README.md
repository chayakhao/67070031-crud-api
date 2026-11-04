# Restful API Week 01 Assignment 1

RESTful API สำหรับ CRUD ข้อมูลนักศึกษา ด้วย **Hono + PostgreSQL + Drizzle ORM + Zod** โครงสร้างเดียวกับตัวอย่างที่ 2.2 (`iot-lab-2026/02-2-database-crud-pg`) และ deploy บน Vercel ได้

## ข้อมูลที่เก็บ (ตาราง `students`)

| ฟิลด์ใน JSON | คอลัมน์ | ความหมาย | กติกา |
| --- | --- | --- | --- |
| `firstName` | `first_name` | ชื่อ | 1–100 ตัวอักษร |
| `lastName` | `last_name` | นามสกุล | 1–100 ตัวอักษร |
| `studentId` | `student_id` | รหัสประจำตัว | ห้ามซ้ำ, ตัวอักษร/ตัวเลข/ขีด 1–20 ตัว |
| `birthDate` | `birth_date` | วันเกิด | รูปแบบ `YYYY-MM-DD`, ห้ามเป็นวันในอนาคต |
| `gender` | `gender` | เพศ | `male` / `female` / `other` |

นอกจากนี้มี `id` (สร้างอัตโนมัติ), `createdAt`, `updatedAt`

## Routes

ทุก request ต้องมี header `Authorization: Bearer <SECRET_PASSWORD>`

| CRUD | Method | Route | ผลลัพธ์ |
| --- | --- | --- | --- |
| Create | `POST` | `/api/v1/students` | `201` + ข้อมูลที่สร้าง |
| Read | `GET` | `/api/v1/students` | `200` + รายชื่อทั้งหมด |
| Read | `GET` | `/api/v1/students/:id` | `200` + ข้อมูลคนเดียว |
| Update | `PATCH` | `/api/v1/students/:id` | `200` + ข้อมูลหลังแก้ (ส่งเฉพาะฟิลด์ที่จะแก้) |
| Delete | `DELETE` | `/api/v1/students/:id` | `204` ไม่มี body |

ตัวอย่าง body สำหรับ `POST`:

```json
{
  "firstName": "สมชาย",
  "lastName": "ใจดี",
  "studentId": "66070001",
  "birthDate": "2004-05-12",
  "gender": "male"
}
```

### HTTP status ที่ใช้

- `400` ข้อมูลไม่ผ่าน Zod validation (ขาดฟิลด์, รูปแบบผิด, มีฟิลด์แปลกปลอม)
- `401` ไม่มี token หรือ token ผิด
- `404` ไม่พบนักศึกษา / ไม่พบ route
- `409` `studentId` ซ้ำกับคนอื่น

## รันบนเครื่อง

1. ต้องมี Node.js 24 และ PostgreSQL (จะรันเองในเครื่อง หรือใช้ฐานข้อมูลบน Vercel/Railway ก็ได้)
2. ติดตั้งและตั้งค่า

   ```sh
   npm install
   cp .env.example .env      # Windows: copy .env.example .env
   ```

   แก้ `DATABASE_URL` ใน `.env` ให้ชี้ไปที่ฐานข้อมูลของตัวเอง

3. สร้างตาราง

   ```sh
   npm run db:generate   # สร้างไฟล์ migration จาก src/db/schema.ts
   npm run db:migrate    # สร้างตารางในฐานข้อมูล
   ```

   (หรือรัน `sql/create-students.sql` ใน DBeaver แทนก็ได้ — เลือกอย่างใดอย่างหนึ่ง)

4. รัน

   ```sh
   npm run dev
   ```

   API อยู่ที่ <http://localhost:3000/api/v1/students>

5. ทดสอบ: เปิด `requests.http` ใน VS Code (ติดตั้ง extension **REST Client**) แล้วกด *Send Request* ทีละอัน หรือใช้ curl

   ```sh
   curl http://localhost:3000/api/v1/students -H "Authorization: Bearer iot-lab-2026"
   ```

## Deploy ขึ้น Vercel

1. สร้างฐานข้อมูล PostgreSQL (Vercel → Storage → Neon/Postgres หรือ Railway) แล้วคัดลอก connection string
2. ตั้ง Environment Variables ในโปรเจกต์ Vercel: `DATABASE_URL` และ `SECRET_PASSWORD`
3. ใส่ `DATABASE_URL` ตัวเดียวกันใน `.env` แล้วรัน `npm run db:migrate` เพื่อสร้างตารางบนฐานข้อมูลจริง
4. Deploy

   ```sh
   npx vercel link
   npx vercel deploy --prod
   ```

   หรือ push ขึ้น GitHub แล้ว Import โปรเจกต์ใน Vercel ก็ได้

## โครงสร้างโปรเจกต์

```text
api/index.ts                  # entrypoint ของ Vercel Function
src/
├── app.ts                    # Hono app (ใช้ร่วมกันทั้ง local และ Vercel)
├── local.ts                  # entrypoint ตอนรันในเครื่อง
├── vercel.ts
├── controllers/
│   ├── api.ts                # /api/v1 + bearer auth
│   └── students.ts           # routes CRUD + status code
├── schemas/
│   ├── common.ts
│   └── students.ts           # Zod validation ของข้อมูลนักศึกษา
├── services/students.ts      # คำสั่ง query ฐานข้อมูล
└── db/
    ├── index.ts              # การเชื่อมต่อ PostgreSQL
    └── schema.ts             # ตาราง students (Drizzle)
sql/create-students.sql       # SQL สร้างตารางแบบ manual
requests.http                 # ชุด request สำหรับทดสอบ
```
