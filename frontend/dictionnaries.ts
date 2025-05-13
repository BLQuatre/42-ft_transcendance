import 'server-only'

const dictionaries: Record<string, () => Promise<any>> = {
	en: () => import('@/locales/en.json').then((module) => module.default),
	fr: () => import('@/locales/fr.json').then((module) => module.default),
}

export const getDictionary = async (locale: 'en' | 'fr') => {
	const dictionaryLoader = dictionaries[locale];
	if (typeof dictionaryLoader !== 'function') {
		throw new Error(`Dictionary for locale '${locale}' is not a function`);
	}
	return dictionaryLoader();
}

