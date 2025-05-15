import { Language } from '@/types/types';

const dictionaries: Record<Language, () => Promise<any>> = {
	en: () => import('@/locales/en.json').then((module) => module.default),
	fr: () => import('@/locales/fr.json').then((module) => module.default),
	ru: () => import('@/locales/ru.json').then((module) => module.default),
	ro: () => import('@/locales/ro.json').then((module) => module.default),
	ln: () => import('@/locales/ln.json').then((module) => module.default),
};

export const getDictionary = async (locale: Language) => {
	const dictionaryLoader = dictionaries[locale];
	if (!dictionaryLoader) {
		throw new Error(`No dictionary found for locale '${locale}'`);
	}
	return await dictionaryLoader();
};
