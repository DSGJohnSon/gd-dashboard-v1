import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { AddCompanySchema } from "../schemas";
import { ID } from "node-appwrite";
import { COMPANIES_ID, DATABASE_ID } from "@/config";

const app = new Hono()
  .post(
    "create",
    sessionMiddleware,
    zValidator("json", AddCompanySchema),
    async (c) => {
      const client = await createAdminClient();

      const { name, siret, country, users } = c.req.valid("json");

      const result = await client.databases.createDocument(
        DATABASE_ID,
        COMPANIES_ID,
        ID.unique(),
        {
          name: name,
          siret: siret,
          country: country,
          userIds: users,
        }
      );

      return c.json({ success: true, message: "add_company_success" });
    }
  )
  .get("listAll", sessionMiddleware, async (c) => {
    const client = await createAdminClient();

    const result = await client.databases.listDocuments(
      DATABASE_ID,
      COMPANIES_ID
    );

    return c.json({ data: result });
  });

export default app;
