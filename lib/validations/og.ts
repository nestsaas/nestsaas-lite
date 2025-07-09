import * as z from "zod"

export const ogImageSchema = z.object({
  heading: z.string(),
  type: z.string().optional().default(""),
  description: z.string().optional(),
  mode: z.enum(["light", "dark"]).default("dark"),
})
