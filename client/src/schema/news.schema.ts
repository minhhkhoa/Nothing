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


  // Schema cho dữ liệu đã dịch (từ API /translation)
export const TranslatedNewsSchema = z.object({
  title: z.object({
    vi: z.string(),
    en: z.string(),
  }),
  description: z.object({
    vi: z.string(),
    en: z.string(),
  }),
  author: z.string(),
});

// Kiểu TypeScript cho dữ liệu đã dịch
export type TranslatedNews = z.infer<typeof TranslatedNewsSchema>;
