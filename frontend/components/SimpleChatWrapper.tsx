"use client";

const noChatPaths = ["/not-found", "/login", "/register"];

import { usePathname } from "next/navigation";
import { SimpleChat } from "./SimpleChat";
import { useAuth } from "@/contexts/auth-context";

export default function SimpleChatWrapper() {
	const { accessToken } = useAuth();
	const pathname = usePathname();
	const currentPath = pathname.slice(3);

	// Compute whether chat should be shown directly
	const shouldShowChat =
		accessToken !== null &&
		noChatPaths.every((path) => !currentPath.startsWith(path));

	if (!shouldShowChat) return null;

	return <SimpleChat />;
}
