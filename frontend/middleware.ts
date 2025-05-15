import { NextRequest, NextResponse } from 'next/server';
import { Language } from '@/types/types';

const locales = Object.values(Language);

function getLocale(request: NextRequest): Language {
	const acceptLanguage = request.headers.get('accept-language');
	if (acceptLanguage) {
		const preferredLanguages = acceptLanguage.split(',').map(lang => lang.split(';')[0].trim());
		const matched = preferredLanguages.find(lang => lang in Language);
		if (matched) return matched as Language;
	}

	return Language.ENGLISH;
}

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const pathnameHasLocale = locales.some(
		(locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
	);

	if (pathnameHasLocale) return NextResponse.next();

	const locale = getLocale(request);
	const url = request.nextUrl.clone();
	url.pathname = `/${locale}${pathname}`;

	return NextResponse.redirect(url);
}

export const config = {
	matcher: [
		'/((?!_next).*)',
		// optionally restrict to '/' root only:
		// '/'
	],
};