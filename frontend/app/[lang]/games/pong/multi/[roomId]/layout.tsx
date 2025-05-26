import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Pong Multi - Transcendance",
};

export default function RegisterLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
