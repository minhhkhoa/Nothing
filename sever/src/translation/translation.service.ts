import { Injectable, Logger } from '@nestjs/common';
import { translate } from '@vitalets/google-translate-api';

@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);

  /**
   * Dịch text sang ngôn ngữ target
   * @param text Nội dung cần dịch
   * @param toLanguage Ngôn ngữ đích (vd: 'en', 'vi')
   * @param fromLanguage Ngôn ngữ gốc (optional, auto-detect nếu bỏ trống)
   */
  async translateText(text: string, toLanguage: string, fromLanguage?: string) {
    try {
      const options: { to: string; from?: string } = { to: toLanguage };
      if (fromLanguage) {
        options.from = fromLanguage;
      }
      const res = await translate(text, options);
      return res.text;
    } catch (error) {
      this.logger.error('Translation error:', error);
      throw new Error('Failed to translate text');
    }
  }
}
