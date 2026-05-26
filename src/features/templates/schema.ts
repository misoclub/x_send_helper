import { z } from 'zod'

export const templateSchema = z.object({
  id: z.string(),
  postTypeId: z.enum(['youtube', 'website']),
  name: z.string().min(1),
  body: z.string(),
  source: z.enum(['builtin', 'user']),
  updatedAt: z.number(),
})

export const templateListSchema = z.array(templateSchema)

export type Template = z.infer<typeof templateSchema>
