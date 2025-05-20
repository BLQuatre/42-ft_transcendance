"use client"

/**
 * Cookie utility functions for client-side use
 */

type CookieOptions = {
	maxAge?: number;
	expires?: Date;
	path?: string;
	domain?: string;
	secure?: boolean;
	sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | undefined {
	if (typeof document === 'undefined')
		return undefined;

	const cookies = document.cookie.split(';');
	const cookie = cookies.find(c => c.trim().startsWith(`${name}=`));

	if (!cookie)
		return undefined;

	return cookie.split('=')[1].trim();
}

/**
 * Set a cookie with the given name, value and options
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
	if (typeof document === 'undefined') {
		return; // Do nothing on server-side
	}

	const cookieOptions: string[] = [];

	if (options.maxAge !== undefined)
		cookieOptions.push(`max-age=${options.maxAge}`);
	if (options.expires)
		cookieOptions.push(`expires=${options.expires.toUTCString()}`);
	if (options.path)
		cookieOptions.push(`path=${options.path}`);
	if (options.domain)
		cookieOptions.push(`domain=${options.domain}`);
	if (options.secure)
		cookieOptions.push('secure');
	if (options.sameSite)
		cookieOptions.push(`samesite=${options.sameSite}`);

	const cookieString = `${name}=${value}${cookieOptions.length > 0 ? '; ' + cookieOptions.join('; ') : ''}`;
	document.cookie = cookieString;
}

/**
 * Delete a cookie by setting its expiration in the past
 */
export function deleteCookie(name: string, options: Omit<CookieOptions, 'maxAge' | 'expires'> = {}): void {
	const deleteOptions: CookieOptions = {
		...options,
		maxAge: -1,
	};

	setCookie(name, '', deleteOptions);
}
