import { NextRequest, NextResponse } from "next/server";
import { getLocaleResponse } from "./lib/dictionnaries";

export function middleware(request: NextRequest) {
	if (request.nextUrl.pathname.startsWith("/images/"))
		return NextResponse.next();

	let response = getLocaleResponse(request);

	return response;
}

export const config = {
	matcher: [
		"/((?!_next).*)",
		// optionally restrict to '/' root only:
		// '/'
	],
};
