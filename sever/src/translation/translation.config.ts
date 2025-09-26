//- định nghĩa những field cần dịch cho từng module
export const translationConfig = {
  jobs: ['title', 'description'],
  news: ['title', 'description'],
  /*
    companies,
    industry,
    skills,
    ...
  */
};

export type allModules = keyof typeof translationConfig;

export type TranslatedField = {
  vi: string;
  en: string;
};
