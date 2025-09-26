import { createZodDto } from 'nestjs-zod';
import { updateNewsSchema } from '../schema/news.entity';

export class UpdateNewsDto extends createZodDto(updateNewsSchema) {}
