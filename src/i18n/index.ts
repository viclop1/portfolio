import en from './en';
import es from './es';

export const languages = ['en', 'es'] as const;
export type Lang = (typeof languages)[number];
export const defaultLang: Lang = 'en';

const dicts = { en, es } as const;
export type Dict = typeof en;

export function getDict(lang: Lang): Dict {
  return dicts[lang];
}
