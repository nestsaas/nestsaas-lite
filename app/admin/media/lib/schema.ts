import { z } from "zod"

/**
 * Schema for media upload
 */
export const mediaUploadSchema = z.object({
  file: z.instanceof(File, { message: "File is required" }),
  title: z
    .string()
    .nullable()
    .transform((val) => val || ""),
  path: z
    .string()
    .nullable()
    .transform((val) => val || ""),
})

/**
 * Schema for media update
 */
export const mediaUpdateSchema = z.object({
  id: z.number({ required_error: "Media ID is required" }),
  title: z
    .string()
    .nullable()
    .transform((val) => val || ""),
})

/**
 * Schema for media list query
 */
export const mediaListQuerySchema = z.object({
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
  search: z.string().optional(),
  userId: z.number().optional(),
  filter: z
    .object({
      type: z.string().optional(),
      size: z.string().optional(),
      from: z.string().optional(),
      to: z.string().optional(),
    })
    .optional(),
})

export type MediaListQuery = z.infer<typeof mediaListQuerySchema>

/**
 * Schema for media delete
 */
export const mediaDeleteSchema = z.object({
  id: z.number({ required_error: "Media ID is required" }),
})
