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
export const CreateUserSchema = UserSchema.omit({ id: true });
export type CreateUser = z.infer<typeof CreateUserSchema>;

// UpdateUser = tất cả optional (PATCH)
export const UpdateUserSchema = CreateUserSchema.partial();
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
