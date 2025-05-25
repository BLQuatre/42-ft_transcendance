"use client"

const noChatPaths = [
	"/not-found",
	"/login",
	"/register",
]

import { usePathname } from "next/navigation"
import { SimpleChat } from "./SimpleChat"
import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"

export default function SimpleChatWrapper() {
	const { accessToken } = useAuth()
	const pathname = usePathname()
	const currentPath = pathname.slice(3)

	const [open, setOpen] = useState(false)

	useEffect(() => {
		setOpen(noChatPaths.every((path) => !currentPath.startsWith(path)) && accessToken !== null)
	}, [accessToken])

	if (!open) return null
	return <SimpleChat />
}
