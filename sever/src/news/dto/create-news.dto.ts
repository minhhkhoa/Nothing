import { createZodDto } from 'nestjs-zod';
import { createNewsSchema } from '../schema/news.entity';

export class CreateNewsDto extends createZodDto(createNewsSchema) {}
