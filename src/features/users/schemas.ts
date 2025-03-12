import { profile } from "console";
import { z } from "zod";

export const GetUsersByIdsSchema = z.object({
  userIds: z.array(z.string()),
});

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  profileId: z.string(),
  avatarUrl: z.string().optional(),
  email: z.string().email().optional(),
});
