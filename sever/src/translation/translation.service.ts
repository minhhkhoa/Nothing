import { Injectable, Logger } from '@nestjs/common';
import { translate } from '@vitalets/google-translate-api';
import { translationConfig } from './translation.config';
import * as cheerio from 'cheerio';
import { decode } from 'html-entities';

@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);

  /**
   * Dịch text thuần sang ngôn ngữ target
   * @param text Nội dung cần dịch
   * @param to Ngôn ngữ đích (default: 'en')
   * @param from Ngôn ngữ gốc (default: 'vi')
   */
  async translateText(text: string, to = 'en', from = 'vi'): Promise<string> {
    try {
      const res = await translate(text, { to, from });
      return res.text;
    } catch (err) {
      this.logger.error(`Translation failed: ${err.message}`);
      return text; // Fallback giữ nguyên nếu lỗi
    }
  }

  /**
   * Dịch HTML giữ nguyên cấu trúc
   * @param html Nội dung HTML cần dịch
   * @param to Ngôn ngữ đích
   * @param from Ngôn ngữ gốc
   */
  async translateHTML(html: string, to = 'en', from = 'vi'): Promise<string> {
    // Load HTML vào Cheerio với xmlMode để không bọc <html><body>
    const $ = cheerio.load(html, { xmlMode: true });

    // Hàm đệ quy duyệt và dịch text nodes
    const traverseAndTranslate = async (node: any) => {
      if (node.type === 'text' && node.data?.trim()) {
        // Giải mã entities để dịch chính xác (e.g., &ocirc; -> ô)
        const decodedText = decode(node.data);
        if (decodedText.trim()) {
          try {
            const translated = await this.translateText(decodedText, to, from);
            // Gán lại text dịch (Cheerio tự encode entities khi cần)
            node.data = translated;
          } catch (error) {
            this.logger.error(
              `Lỗi dịch text trong HTML: ${decodedText}`,
              error,
            );
          }
        }
      } else if (node.type === 'tag') {
        // Duyệt các node con
        $(node)
          .contents()
          .each((i, child) => traverseAndTranslate(child));
      }
    };

    // Bắt đầu duyệt từ root
    await traverseAndTranslate($.root()[0]);

    // Trả về HTML fragment, không bao gồm <html><body>
    return $.root().html() || '';
  }

  /**
   * Dịch dữ liệu module
   * @param module Tên module (e.g., 'jobs')
   * @param data Object data (DTO)
   */
  async translateModuleData<T extends Record<string, any>>(
    module: keyof typeof translationConfig,
    data: T,
  ): Promise<T> {
    const fieldsToTranslate = translationConfig[module];
    const result: any = { ...data };

    for (const field of fieldsToTranslate) {
      if (data[field]) {
        const vi = data[field].vi; // Giả sử input là { vi: string }
        let en: string;

        // Kiểm tra xem có phải HTML không
        const isHTML = /<\w+.*?>/.test(vi) || /&[a-zA-Z0-9#]+;/.test(vi);

        if (isHTML) {
          // Dịch HTML giữ cấu trúc
          en = await this.translateHTML(vi, 'en', 'vi');
        } else {
          // Dịch text thuần
          en = await this.translateText(vi, 'en', 'vi');
        }

        result[field] = { vi, en }; // Thay string thành object song ngữ
      }
    }

    return result;
  }
}
