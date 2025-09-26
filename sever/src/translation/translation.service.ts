import { Injectable, Logger } from '@nestjs/common';
import { translate } from '@vitalets/google-translate-api';
import { translationConfig } from './translation.config';

@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);

  /**
   * Dịch text sang ngôn ngữ target
   * @param text Nội dung cần dịch
   * @param to Ngôn ngữ đích en
   * @param from Ngôn ngữ gốc (optional, auto-detect nếu bỏ trống)
   * 
   * 
   * Service xử lý dịch chung
      Input: object data (VD: jobDto, newsDto), moduleName ('jobs' | 'news').
      Service sẽ duyệt qua translationConfig[moduleName].
      Với mỗi field đó → dịch data[field].vi sang en, tạo object { vi, en }.
      Trả về object mới.
   */
  async translateText(text: string, to = 'en', from = 'vi'): Promise<string> {
    try {
      const res = await translate(text, { to, from });
      return res.text;
    } catch (err) {
      this.logger.error(`Translation failed: ${err.message}`);
      return text;
    }
  }

  async translateModuleData<T extends Record<string, any>>(
    module: keyof typeof translationConfig,
    data: T,
  ): Promise<T> {
    const fieldsToTranslate = translationConfig[module]; //- mảng field cần dịch
    const result: any = { ...data }; //- data chính là body gửi lên là DTO của các module đấy

    //- lặp qua các field cần dịch
    for (const field of fieldsToTranslate) {
      if (data[field]) {
        const vi = data[field].vi;
        const en = await this.translateText(vi, 'en', 'vi');
        result[field] = { vi, en }; // thay string thành object song ngữ
      }
    }

    return result;
  }
}
