//- file nay se de validate .env va su dung zod de validate
import { z } from "zod";

export const configSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string(),
  NEXT_PUBLIC_APIKEY_TINY: z.string(),
});

const configProject = configSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_APIKEY_TINY: process.env.NEXT_PUBLIC_APIKEY_TINY,
});

if (!configProject.success) {
  console.error(configProject.error.issues);
  throw new Error("Các giá trị khai báo trong file .env không hợp lệ");
}
export const envConfig = configProject.data;

//- i18n
export type Locale = (typeof locales)[number];

export const locales = ["vi", "en"] as const;
export const defaultLocale: Locale = "vi";
//- end i18n
