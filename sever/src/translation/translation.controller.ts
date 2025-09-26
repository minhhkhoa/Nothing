import { Body, Controller, Post, Query } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { CreateNewsDto } from 'src/news/dto/create-news.dto';

@Controller('translation')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @Post()
  async translate(
    @Body() createNewsDto: CreateNewsDto,
    @Query('to') toLanguage: string,
    @Query('from') fromLanguage?: string,
  ) {
    if (
      !createNewsDto.title?.vi ||
      !createNewsDto.description?.vi ||
      !toLanguage
    ) {
      return {
        error: 'Title/Description (vi) và target language là bắt buộc.',
      };
    }


    const translated = {
      title: await this.translationService.translateText(
        createNewsDto.title.vi,
        toLanguage,
        fromLanguage,
      ),
      description: await this.translationService.translateText(
        createNewsDto.description.vi,
        toLanguage,
        fromLanguage,
      ),
    };

    return {
      title: {
        vi: createNewsDto.title.vi,
        [toLanguage]: translated.title,
      },
      description: {
        vi: createNewsDto.description.vi,
        [toLanguage]: translated.description,
      },
      author: createNewsDto.author,
    };
  }
}
