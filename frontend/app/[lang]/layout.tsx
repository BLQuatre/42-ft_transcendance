import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../styles/globals.css"; // Updated path assuming styles are at project root
import { Toaster } from "@/components/ui/Toaster";
import { AuthProvider } from "@/contexts/auth-context";
import InitAuth from "@/hooks/InitAuth";
import SimpleChatWrapper from "@/components/SimpleChatWrapper";
import HeartbeatProvider from "@/components/HeartbeatProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Home - Transcendance",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className={inter.className}>
			<AuthProvider>
				<HeartbeatProvider>
					<InitAuth />
					{children}
					<SimpleChatWrapper />
					<Toaster />
				</HeartbeatProvider>
			</AuthProvider>
		</div>
	);
}
