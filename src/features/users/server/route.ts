import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";
import { Hono } from "hono";

const app = new Hono().get("listAll", sessionMiddleware, async (c) => {
  const client = await createAdminClient();

  const result = await client.users.list();

  return c.json({ data: result });
});

export default app;
