import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  AddCompanySchema,
  GetCompaniesByIdsSchema,
  UpdateCompanySchema,
} from "../schemas";
import { ID, Query } from "node-appwrite";
import { COMPANIES_ID, DATABASE_ID } from "@/config";
import { CompaniesSchemaReturned } from "../types";

const app = new Hono()
  //*------------------*//
  //CREATE REQUEST API
  //*------------------*//
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
      return c.json({
        success: true,
        message: "add_company_success",
        data: {
          total: result.total,
          data: [
            {
              $id: result.$id,
              $createdAt: result.$createdAt,
              $updatedAt: result.$updatedAt,
              name: result.name,
              siret: result.siret,
              country: result.country,
              userIds: result.userIds,
            },
          ],
        } as CompaniesSchemaReturned,
      });
    }
  )
  //*------------------*//
  //ALL GET REQUESTS API
  //*------------------*//
  //Get all companies of the database
  .get("getAll", sessionMiddleware, async (c) => {
    const client = await createAdminClient();

    const result = await client.databases.listDocuments(
      DATABASE_ID,
      COMPANIES_ID,
      [
        Query.select([
          "$id",
          "$createdAt",
          "$updatedAt",
          "name",
          "siret",
          "country",
          "userIds",
        ]),
      ]
    );
    return c.json({ data: result });
  })
  //Get one company by id
  .get("getById/:companyId", sessionMiddleware, async (c) => {
    const client = await createAdminClient();
    const { companyId } = c.req.param();

    const result = await client.databases.getDocument(
      DATABASE_ID,
      COMPANIES_ID,
      companyId,
      [
        Query.select([
          "$id",
          "$createdAt",
          "$updatedAt",
          "name",
          "siret",
          "country",
          "userIds",
        ]),
      ]
    );
    return c.json({ data: result });
  })
  //Get all companies by ids
  .post(
    "getByIds",
    sessionMiddleware,
    zValidator("json", GetCompaniesByIdsSchema),
    async (c) => {
      const client = await createAdminClient();
      const { companyIds } = c.req.valid("json");

      const result = await client.databases.listDocuments(
        DATABASE_ID,
        COMPANIES_ID,
        [
          Query.equal("$id", companyIds),
          Query.select([
            "$id",
            "$createdAt",
            "$updatedAt",
            "name",
            "siret",
            "country",
            "userIds",
          ]),
        ]
      );
      return c.json({ data: result });
    }
  )
  //Get List of companies by user id
  .get("getByUserId/:userId", sessionMiddleware, async (c) => {
    const client = await createAdminClient();
    const { userId } = c.req.param();

    const result = await client.databases.listDocuments(
      DATABASE_ID,
      COMPANIES_ID,
      [
        Query.contains("userIds", [userId]),
        Query.select([
          "$id",
          "$createdAt",
          "$updatedAt",
          "name",
          "siret",
          "country",
          "userIds",
        ]),
      ]
    );
    return c.json({ data: result });
  })
  //*------------------*//
  //UPDATE COMPANY
  //*------------------*//
  .post(
    "update/:companyId",
    sessionMiddleware,
    zValidator("json", UpdateCompanySchema),
    async (c) => {
      const client = await createAdminClient();
      const { companyId } = c.req.param();
      const { name, siret, country, users } = c.req.valid("json");

      const result = await client.databases.updateDocument(
        DATABASE_ID,
        COMPANIES_ID,
        companyId,
        {
          name: name,
          siret: siret,
          country: country,
          userIds: users,
        }
      );
      return c.json({
        success: true,
        message: "update_company_success",
        data: result,
      });
    }
  )
  //*------------------*//
  //DELETE COMPANY
  //*------------------*//
  .delete("delete/:companyId", sessionMiddleware, async (c) => {
    const client = await createAdminClient();
    const { companyId } = c.req.param();

    const result = await client.databases.deleteDocument(
      DATABASE_ID,
      COMPANIES_ID,
      companyId
    );
    return c.json({
      success: true,
      message: "delete_company_success",
      data: result,
    });
  });

export default app;
