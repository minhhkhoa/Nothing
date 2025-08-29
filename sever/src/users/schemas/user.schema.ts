import { z } from 'zod';

export const createUserSchema = z
  .object({
    name: z
      .string('Trường tên không được để trống')
      .min(2, { message: 'Trường tên cần ít nhất 2 ký tự có nghĩa' })
      .max(50, { message: 'Trường tên không quá 50 ký tự' }),
    age: z.number().min(0, { message: 'Trường tuổi phải >= 0' }).max(100, {
      message: 'Trường tuổi không quá 100',
    }),
    email: z.string().email('Trường email không hợp lệ'),
  })
  .required();

export const updateUserSchema = createUserSchema.partial();

/*
. Ý tưởng phân chia 2 folders
📂 schema
  - Nhiệm vụ: Chỉ chứa Zod schema để định nghĩa & validate dữ liệu.
  - Đây là "single source of truth" – nơi mô tả dữ liệu thế nào thì toàn bộ app sẽ dựa theo.
  - Schema có thể tái sử dụng ở nhiều nơi: controller validation, swagger docs, unit test...

📂 dto
  - Nhiệm vụ: Chứa type/interface (được infer từ schema).
  - Dùng trong code TypeScript để service/controller có type safety, gọn gàng.
  - DTO ở đây chỉ là “kiểu dữ liệu” chứ không chứa logic validate (validation đã nằm ở schema).
*/
