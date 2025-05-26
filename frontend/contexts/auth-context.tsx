"use client";

import axios from "axios";
import { usePathname } from "next/navigation";
import { createContext, useContext, useState, useEffect } from "react";
import { useHeartbeat } from "@/hooks/UseHeartbeat";

type AuthContextType = {
	accessToken: string | null;
	setAccessToken: (token: string | null) => void;
	refreshAccessToken: () => Promise<void>;
};

// Paths that are only accessible when not connected
const onlyNotConnectedPaths = ["/login", "/register"];

// Paths that are only accessible when connected
const onlyConnectedPaths = ["/dashboard", "/friends"];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const pathname = usePathname();

	// Get userId from localStorage
	const userId =
		typeof window !== "undefined" ? localStorage.getItem("userId") : null;

	// Initialize heartbeat system
	useHeartbeat(!!accessToken, userId);

	const refreshAccessToken = async () => {
		console.log("Refreshing token...");

		try {
			const response = await axios.get("/api/auth/refresh", {
				withCredentials: true,
			});

			if (response.status === 200) {
				setAccessToken(response.data.accessToken);
				localStorage.setItem("userId", response.data.id);

				if (onlyNotConnectedPaths.includes(pathname.slice(3))) {
					window.location.href = "/";
				}
			}
		} catch (error) {
			axios
				.get("/api/auth/logout")
				.then(() => {
					setAccessToken(null);
					if (onlyConnectedPaths.includes(pathname.slice(3)))
						window.location.href = "/login";
				})
				.catch((error) => {
					console.error("Logout error:", error);
				});
			setAccessToken(null);
		}
	};

	useEffect(() => {
		const refresh = async () => {
			await refreshAccessToken();
			setLoading(false);
		};

		refresh();
	}, []);

	if (loading) return null;

	return (
		<AuthContext.Provider
			value={{ accessToken, setAccessToken, refreshAccessToken }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth must be used within AuthProvider");
	return context;
}
