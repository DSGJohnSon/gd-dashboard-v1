import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { loginSchema, signUpSchema } from "../schemas";
import { createAdminClient } from "@/lib/appwrite";
import { ID, Query } from "node-appwrite";
import { deleteCookie, setCookie } from "hono/cookie";
import { AUTH_COOKIE } from "../constants";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, PROFILES_ID } from "@/config";
import { HTTPException } from "hono/http-exception";
import { avatars } from "@/data/avatars";

const app = new Hono()
  .get("current", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const { databases } = await createAdminClient();

    // Recherchez le profil associé à l'utilisateur actuel
    const profile = await databases.listDocuments(DATABASE_ID, PROFILES_ID, [
      Query.equal("userId", user.$id), // Filtrez par userId
    ]);

    return c.json({ data: user, profile: profile.documents[0] || null });
  })
  // Connexion
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json");
    const { account } = await createAdminClient();

    try {
      try {
        const session = await account.createEmailPasswordSession(
          email,
          password
        );
        setCookie(c, AUTH_COOKIE, session.secret, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 30,
        });
      } catch (error) {
        console.log(error);
        switch (error instanceof Error && "type" in error ? error.type : 0) {
          case "user_invalid_credentials": //Code for invalid credentials in appwrite
            throw new HTTPException(400, {
              message: "user_invalid_credentials",
            });
          case "general_argument_invalid":
            throw new HTTPException(400, {
              message: "general_argument_invalid",
            });
          default:
            throw new HTTPException(400, {
              message: "general_error",
            });
        }
      }
    } catch (error) {
      // Renvoie une réponse JSON avec le message d'erreur
      const status = error instanceof HTTPException ? error.status : 500;
      const message = error instanceof Error ? error.message : "general_error";
      return c.json({ success: false, message }, status);
    }

    return c.json({ success: true, message: "login_success" });
  })
  .post("/register", zValidator("json", signUpSchema), async (c) => {
    const { email, password, name } = c.req.valid("json");
    const { account } = await createAdminClient();

    try {
      try {
        const user = await account.create(ID.unique(), email, password, name);

        //Connexion de l'utilisateur
        const session = await account.createEmailPasswordSession(
          email,
          password
        );
        setCookie(c, AUTH_COOKIE, session.secret, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 30,
        });

        //Création du profil pour les infos secondaires
        const { databases } = await createAdminClient();
        await databases.createDocument(DATABASE_ID, PROFILES_ID, ID.unique(), {
          userId: user.$id,
          avatarUrl: avatars[Math.floor(Math.random() * avatars.length)],
        });
      } catch (error) {
        console.log(error);
        switch (error instanceof Error && "type" in error ? error.type : 0) {
          case 409: //Code 409 is for conflict in appwrite
            throw new HTTPException(400, {
              message: "already_used_email",
            });
          default:
            throw new HTTPException(400, {
              message: "general_error",
            });
        }
      }
    } catch (error) {
      // Renvoie une réponse JSON avec le message d'erreur
      const status = error instanceof HTTPException ? error.status : 500;
      const message = error instanceof Error ? error.message : "general_error";
      return c.json({ success: false, message }, status);
    }
    return c.json({ success: true, message: "register_success" });
  })
  .post("/logout", sessionMiddleware, async (c) => {
    const account = c.get("account");
    await account.deleteSession("current");

    deleteCookie(c, AUTH_COOKIE);

    return c.json({ success: true });
  });

export default app;
