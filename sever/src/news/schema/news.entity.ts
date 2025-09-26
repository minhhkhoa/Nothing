import { z } from 'zod';

export const createNewsSchema = z
  .object({
    title: z.object({
      vi: z.string().min(1, 'Trường tiêu đề không được để trống'),
      en: z.string().min(1, 'field title not allow empty').optional(),
    }),
    description: z.object({
      vi: z.string().min(1, 'Trường mô tả không được để trống'),
      en: z.string().min(1, 'field description not allow empty').optional(),
    }),
    author: z.string().min(1, 'Trường tác giả không được spep trống'),
  })
  .required();

export const updateNewsSchema = createNewsSchema.partial();
