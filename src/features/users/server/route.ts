import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { GetUsersByIdsSchema, UpdateUserSchema } from "../schemas";
import { Query } from "node-appwrite";
import { DATABASE_ID, PROFILES_ID } from "@/config";
import { UsersSchemaReturned } from "../types";

const app = new Hono()
  //*------------------*//
  //ALL GET REQUESTS API
  //*------------------*//
  //Get all users of the database
  .get("getAll", sessionMiddleware, async (c) => {
    const client = await createAdminClient();

    const temp = await client.users.list();
    const result: UsersSchemaReturned = {
      total: temp.total,
      data: [],
    };

    //Récupérer les photos de profil des utilisateurs
    for (let i = 0; i < result.total; i++) {
      const userId = temp.users[i].$id;
      const profile = await client.databases.listDocuments(
        DATABASE_ID,
        PROFILES_ID,
        [Query.equal("userId", userId)]
      );
      result.data.push({
        $id: temp.users[i].$id,
        $createdAt: temp.users[i].$createdAt,
        $updatedAt: temp.users[i].$updatedAt,
        name: temp.users[i].name,
        avatarUrl: profile.documents[0].avatarUrl || "",
        labels: temp.users[i].labels,
        email: temp.users[i].email,
      });
    }
    return c.json({ data: result });
  })
  //
  //Get one user by id
  .get("getById/:userId", sessionMiddleware, async (c) => {
    const client = await createAdminClient();
    const { userId } = c.req.param();

    const temp = await client.users.get(userId);
    const result: UsersSchemaReturned = {
      total: 1,
      data: [],
    };
    //Récupérer les photos de profil des utilisateurs
    const profile = await client.databases.listDocuments(
      DATABASE_ID,
      PROFILES_ID,
      [Query.equal("userId", userId)]
    );
    result.data.push({
      $id: temp.$id,
      $createdAt: temp.$createdAt,
      $updatedAt: temp.$updatedAt,
      name: temp.name,
      avatarUrl: profile.documents[0].avatarUrl || "",
      labels: temp.labels,
      email: temp.email,
    });
    return c.json({ data: result });
  })
  //
  //Get all users by ids
  .post(
    "getByIds",
    sessionMiddleware,
    zValidator("json", GetUsersByIdsSchema),
    async (c) => {
      const client = await createAdminClient();
      const { userIds } = c.req.valid("json");

      const temp = await client.users.list([Query.equal("$id", userIds)]);
      const result: UsersSchemaReturned = {
        total: temp.total,
        data: [],
      };

      //Récupérer les photos de profil des utilisateurs
      for (let i = 0; i < result.total; i++) {
        const userId = temp.users[i].$id;
        const profile = await client.databases.listDocuments(
          DATABASE_ID,
          PROFILES_ID,
          [Query.equal("userId", userId)]
        );
        result.data.push({
          $id: temp.users[i].$id,
          $createdAt: temp.users[i].$createdAt,
          $updatedAt: temp.users[i].$updatedAt,
          name: temp.users[i].name,
          avatarUrl: profile.documents[0].avatarUrl || "",
          labels: temp.users[i].labels,
          email: temp.users[i].email,
        });
      }
      return c.json({ data: result });
    }
  )
  //
  //*------------------*//
  //UPDATE USER
  //*------------------*//
  .post(
    "update/:userId",
    sessionMiddleware,
    zValidator("json", UpdateUserSchema),
    async (c) => {
      const client = await createAdminClient();
      const { userId } = c.req.param();
      const { name, email, avatarUrl, profileId } = c.req.valid("json");

      if (avatarUrl) {
        await client.databases.updateDocument(
          DATABASE_ID,
          PROFILES_ID,
          profileId,
          {
            avatarUrl: avatarUrl,
          }
        );
      }

      if (name) {
        await client.users.updateName(userId, name);
      }
      if (email) {
        await client.users.updateEmail(userId, email);
      }

      return c.json({
        success: true,
        message: "update_user_success",
      });
    }
  );

export default app;
