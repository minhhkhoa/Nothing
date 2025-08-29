// src/users/dto/create-user.dto.ts
import { createZodDto } from 'nestjs-zod';
import { createUserSchema } from '../schemas/user.schema';

export class CreateUserDto extends createZodDto(createUserSchema) {}
