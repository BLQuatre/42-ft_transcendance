import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'fr'];

function getLocale(request: NextRequest): string {
	const acceptLanguage = request.headers.get('accept-language');
	if (acceptLanguage) {
		const preferredLanguages = acceptLanguage.split(',').map(lang => lang.split(';')[0].trim());
		const matched = preferredLanguages.find(lang => locales.includes(lang));
		if (matched) return matched;
	}

	// Fallback locale
	return 'en';
}

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const pathnameHasLocale = locales.some(
		locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
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
