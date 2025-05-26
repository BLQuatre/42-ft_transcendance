import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "404 - Transcendance",
};

export default function RegisterLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
