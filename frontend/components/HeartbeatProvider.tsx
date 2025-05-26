"use client";

import { useActivityHeartbeat } from "@/hooks/UseActivityHeartbeat";

export default function HeartbeatProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	// Initialize activity-based heartbeat
	useActivityHeartbeat();

	return <>{children}</>;
}
