# Food App — Backend API

Express + Prisma (PostgreSQL / Neon) REST API for the food-delivery app.

## Stack

- **Express 5** — HTTP server
- **Prisma 7** — ORM, with the `@prisma/adapter-pg` driver adapter
- **PostgreSQL (Neon)** — database
- **JWT** — access + refresh tokens, plus stateless action tokens
- **bcryptjs** — password hashing
- **Zod** — request validation
- **Resend** — email verification & password-reset emails

## Setup

1. Install dependencies:

   ```bash
   bun install
   ```

2. Create `.env` (copy from `.env.example`) and set `DATABASE_URL` to your
   Neon connection string from <https://neon.tech>.

3. Run the first migration (creates the tables in Neon):

   ```bash
   bun run prisma:migrate
   ```

4. (Optional) Seed an admin account + sample categories:

   ```bash
   bun run seed
   ```

5. Start the dev server:

   ```bash
   bun run dev
   ```

   API runs on `http://localhost:4000`.

## Scripts

| Script                  | Description                              |
| ----------------------- | ---------------------------------------- |
| `bun run dev`           | Start with hot reload                    |
| `bun run start`         | Start once                               |
| `bun run prisma:migrate`| Create/apply a migration (dev)           |
| `bun run prisma:deploy` | Apply migrations (production)            |
| `bun run prisma:studio` | Open Prisma Studio                       |
| `bun run seed`          | Seed admin user + categories             |

## API routes

### Auth — `/auth`

| Method | Path                              | Auth | Description                          |
| ------ | --------------------------------- | ---- | ------------------------------------ |
| POST   | `/sign-up`                        | —    | Register, sends a verification email |
| GET    | `/verify-email`                   | —    | Verify `?token=`, returns tokens     |
| POST   | `/resend-verification`            | —    | Re-send the verification email       |
| POST   | `/sign-in`                        | —    | Log in (verified users), returns tokens |
| GET    | `/refresh`                        | refresh token | New access token            |
| POST   | `/reset-password-request`         | —    | Email a reset link                   |
| GET    | `/verify-reset-password-request`  | —    | Check `?token=` validity             |
| POST   | `/reset-password`                 | —    | Set new password with token          |

### Food category — `/food-category`

| Method | Path                  | Auth  |
| ------ | --------------------- | ----- |
| GET    | `/`                   | —     |
| POST   | `/`                   | admin |
| PATCH  | `/:foodCategoryId`    | admin |
| DELETE | `/:foodCategoryId`    | admin |

### Food — `/food`

| Method | Path            | Auth  |
| ------ | --------------- | ----- |
| GET    | `/`             | —     |
| GET    | `/:categoryId`  | —     |
| POST   | `/`             | admin |
| PATCH  | `/:foodId`      | admin |
| DELETE | `/:foodId`      | admin |

### Food order — `/food-order`

| Method | Path             | Auth        | Description                  |
| ------ | ---------------- | ----------- | ---------------------------- |
| POST   | `/`              | user        | Place an order               |
| GET    | `/`              | admin       | List all orders              |
| PATCH  | `/`              | admin       | Bulk status update           |
| GET    | `/:userId`       | user (self) / admin | A user's orders      |
| PATCH  | `/:foodOrderId`  | admin       | Update one order's status    |

Bulk update body: `{ "orderIds": ["…"], "status": "DELIVERING" }`.

### Upload — `/upload`

| Method | Path | Auth  | Description                                  |
| ------ | ---- | ----- | -------------------------------------------- |
| POST   | `/`  | admin | Upload an image to Cloudinary, returns `url` |

Send the image as `multipart/form-data` in the `image` field. Response:
`{ "url": "https://res.cloudinary.com/…", "publicId": "food/…" }`.
Use the returned `url` as the `image` value when creating/updating a food.

Send the access token as `Authorization: Bearer <token>`.
For `GET /auth/refresh`, send the refresh token the same way.

## Notes / spec additions

These endpoints were added beyond the original API list to satisfy the
written requirements:

- `POST /food` — admin "add food" was described but had no endpoint.
- `GET /auth/verify-email` & `POST /auth/resend-verification` — email
  verification was described but had no endpoint. New users are created
  unverified and must verify before they can sign in.
- `PATCH /food-order` — bulk order-status update.

Password-reset and email-verification links use stateless JWT action
tokens, so the `User` table needs no token column (matches the ERD).
