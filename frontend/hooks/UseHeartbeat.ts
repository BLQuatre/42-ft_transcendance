import { useEffect } from 'react'
import { heartbeatService } from '@/lib/heartbeat'

export function useHeartbeat(isAuthenticated: boolean, userId: string | null) {
	useEffect(() => {
		if (isAuthenticated && userId) {
			// Start heartbeat service
			heartbeatService.start(userId)
		} else {
			// Stop heartbeat service
			heartbeatService.stop()
		}

		// Cleanup on unmount or when auth state changes
		return () => {
			if (!isAuthenticated) {
				heartbeatService.stop()
			}
		}
	}, [isAuthenticated, userId])
}
