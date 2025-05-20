import { NextRequest } from 'next/server';
import { getLocaleResponse } from './lib/dictionnaries';

export function middleware(request: NextRequest) {
	const response = getLocaleResponse(request);

	return response;
}

export const config = {
	matcher: [
		'/((?!_next).*)',
		// optionally restrict to '/' root only:
		// '/'
	],
};
