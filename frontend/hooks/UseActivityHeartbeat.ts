import { useEffect } from "react";
import { heartbeatService } from "@/lib/heartbeat";

/**
 * Hook that triggers heartbeat on user activity (mouse, keyboard, touch events)
 * This ensures the user stays online while actively using the application
 */
export function useActivityHeartbeat() {
	useEffect(() => {
		const handleUserActivity = () => {
			heartbeatService.triggerHeartbeat();
		};

		// Activity events to monitor
		const events = [
			"mousedown",
			"mousemove",
			"keypress",
			"scroll",
			"touchstart",
			"click",
		];

		// Add event listeners
		events.forEach((event) => {
			document.addEventListener(event, handleUserActivity, { passive: true });
		});

		// Cleanup event listeners
		return () => {
			events.forEach((event) => {
				document.removeEventListener(event, handleUserActivity);
			});
		};
	}, []);
}
