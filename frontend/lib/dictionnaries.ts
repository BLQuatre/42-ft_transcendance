import { Language } from '@/types/language';
import { request } from 'http';
import { NextRequest, NextResponse } from 'next/server';

const dictionaries: Record<Language, () => Promise<any>> = {
	en: () => import('@/locales/en.json').then((module) => module.default),
	fr: () => import('@/locales/fr.json').then((module) => module.default),
	ru: () => import('@/locales/ru.json').then((module) => module.default),
	ro: () => import('@/locales/ro.json').then((module) => module.default)
};

// TODO: See the diff between const fun = () => {}
// and function fun() {}

export const getDictionary = async (locale: Language) => {
	const dictionaryLoader = dictionaries[locale];
	if (!dictionaryLoader) {
		throw new Error(`No dictionary found for locale '${locale}'`);
	}
	return await dictionaryLoader();
};

const locales = Object.values(Language);

const getLocale = (request: NextRequest): Language => {
	const cookieLanguage = request.cookies.get('selectedLanguage')?.value;
	const acceptLanguage = request.headers.get('accept-language');

	if (cookieLanguage && locales.includes(cookieLanguage as Language)) {
		return cookieLanguage as Language;
	}

	if (acceptLanguage) {
		const preferredLanguages = acceptLanguage.split(',').map(lang => lang.split(';')[0].trim());
		const matched = preferredLanguages.find(lang => locales.includes(lang as Language));
		if (matched) return matched as Language;
	}

	return Language.ENGLISH;
}

export const getLocaleResponse = (request: NextRequest): NextResponse => {
	const { pathname } = request.nextUrl;

	const pathnameHasLocale = locales.some(
		(locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
	);

	const locale = getLocale(request);

	let response: NextResponse;

	if (pathnameHasLocale) {
		response = NextResponse.next();
	} else {
		const url = request.nextUrl.clone();
		url.pathname = `/${locale}${pathname}`;
		response = NextResponse.redirect(url);
	}

	if (!request.cookies.get('selectedLanguage')) {
		response.cookies.set('selectedLanguage', locale, {
			path: '/',
			httpOnly: false,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 365,
		});
	}

	return response;
}