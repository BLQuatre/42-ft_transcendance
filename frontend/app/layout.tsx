import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css"; // Import your global styles

// Initialize the Inter font
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Transcendance",
	description: "Retro gaming platform",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body className={inter.className}>{children}</body>
		</html>
	);
}
