import api from '@/lib/api'

class HeartbeatService {
	private static instance: HeartbeatService
	private intervalId: NodeJS.Timeout | null = null
	private userId: string | null = null
	private isAuthenticated: boolean = false
	private lastHeartbeat: number = 0
	private readonly HEARTBEAT_INTERVAL = 120 * 1000 // 2 minutes
	private readonly MIN_HEARTBEAT_INTERVAL = 30 * 1000 // Minimum 30 seconds between heartbeats

	static getInstance(): HeartbeatService {
		if (!HeartbeatService.instance) {
			HeartbeatService.instance = new HeartbeatService()
		}
		return HeartbeatService.instance
	}

	start(userId: string) {
		if (!userId) return

		this.userId = userId
		this.isAuthenticated = true
		
		// Send immediate heartbeat
		this.sendHeartbeat()
		
		// Clear existing interval
		if (this.intervalId) {
			clearInterval(this.intervalId)
		}
		
		// Start periodic heartbeat
		this.intervalId = setInterval(() => {
			this.sendHeartbeat()
		}, this.HEARTBEAT_INTERVAL)

		console.log('Heartbeat service started for user:', userId)
	}

	stop() {
		this.isAuthenticated = false
		this.userId = null
		
		if (this.intervalId) {
			clearInterval(this.intervalId)
			this.intervalId = null
		}
		
		console.log('Heartbeat service stopped')
	}

	// Send heartbeat immediately (for user activity)
	async triggerHeartbeat() {
		if (!this.isAuthenticated || !this.userId) return

		const now = Date.now()
		
		// Throttle heartbeats to avoid excessive API calls
		if (now - this.lastHeartbeat < this.MIN_HEARTBEAT_INTERVAL) {
			return
		}

		await this.sendHeartbeat()
	}

	private async sendHeartbeat() {
		if (!this.userId) return

		try {
			await api.get(`/user/heartbeat/${this.userId}`)
			this.lastHeartbeat = Date.now()
			console.log('Heartbeat sent successfully')
		} catch (error) {
			console.error('Failed to send heartbeat:', error)
		}
	}
}

export const heartbeatService = HeartbeatService.getInstance()
