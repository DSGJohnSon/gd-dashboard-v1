import { Hono } from "hono";
import { handle } from "hono/vercel";
import auth from "@/features/auth/server/route";
import users from "@/features/users/server/route";
import companies from "@/features/companies/server/route";

const app = new Hono().basePath("/api");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route("/auth", auth)
  .route("/users", users)
  .route("/companies", companies);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
