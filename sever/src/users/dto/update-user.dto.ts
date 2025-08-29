import { updateUserSchema } from '../schemas/user.schema';
import { createZodDto } from 'nestjs-zod';

export class UpdateUserDto extends createZodDto(updateUserSchema) {}

