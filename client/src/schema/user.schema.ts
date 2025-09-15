/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

export const UserSchema = z
  .object({
    id: z.string(),
    name: z
      .string("Trường tên không được để trống")
      .min(2, { message: "Trường tên cần ít nhất 2 ký tự có nghĩa" })
      .max(50, { message: "Trường tên không quá 50 ký tự" }),
    age: z.coerce.number().min(0, { message: "Trường tuổi phải >= 0" }),
    email: z.string().email("Trường email không hợp lệ"),
  })
  .required();

export type User = z.infer<typeof UserSchema>;

// CreateUser = User nhưng bỏ id
export const createUserSchema = (t: (key: any) => string) =>
  z.object({
    name: z
      .string()
      .min(2, { message: t("name.min") })
      .max(50, { message: t("name.max") }),
    age: z.coerce.number().min(0, { message: t("age.min") }),
    email: z.string().email(t("email.invalid")),
  });
export type CreateUser = z.infer<ReturnType<typeof createUserSchema>>;

// UpdateUser = tất cả optional (PATCH)
export const updateUserSchema = (t: (key: any) => string) =>
  createUserSchema(t).partial();

export type UpdateUser = z.infer<ReturnType<typeof updateUserSchema>>;
