import { z } from 'zod';

export const NewsSchema = z
  .object({
    title: z.object({
      vi: z.string().min(1, 'Trường tiêu đề không được để trống'),
    }),
    description: z.object({
      vi: z.string().min(1, 'Trường mô tả không được để trống'),
    }),
    author: z.string().min(1, 'Trường tác giả không được spep trống'),
  })
  .required();
