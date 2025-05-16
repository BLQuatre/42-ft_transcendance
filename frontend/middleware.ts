import { NextRequest, NextResponse } from 'next/server';
import { Language } from '@/types/types';

const locales = Object.values(Language);

function getLocale(request: NextRequest): Language {
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

export function middleware(request: NextRequest) {
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

export const config = {
	matcher: [
		'/((?!_next).*)',
		// optionally restrict to '/' root only:
		// '/'
	],
};
