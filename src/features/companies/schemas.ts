import { z } from "zod";

export const AddCompanySchema = z.object({
  name: z.string().min(1),
  siret: z.string().min(1),
  country: z.string().min(1),
  users: z.array(z.string()).optional(),
});
