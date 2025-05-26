"use client";

import { useAuth } from "@/contexts/auth-context";
import { injectAuthContext } from "@/lib/api";

export default function InitAuth() {
	const auth = useAuth();
	injectAuthContext(auth);
	return null;
}
