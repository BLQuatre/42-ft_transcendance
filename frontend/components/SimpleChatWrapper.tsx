// components/SimpleChatWrapper.tsx
"use client"

const Blacklist = [
	"/not-found",
	"/login",
	"/register",
]

import { usePathname } from "next/navigation"
import { SimpleChat } from "./SimpleChat"
import { useAuth } from "@/contexts/auth-context"

export default function SimpleChatWrapper() {
	const { accessToken } = useAuth()

  	const pathname = usePathname()

	const isNotFound = Blacklist.some((path) =>
  		pathname?.endsWith(path)
	);

  	if (isNotFound) return null

 	 return <SimpleChat />
}
