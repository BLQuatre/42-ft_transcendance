"use client"

import React, { useEffect } from "react"

import { useState } from "react"
import { MainNav } from "@/components/Navbar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/Chart"
import { Line, LineChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Separator } from "@/components/ui/Separator"
import { SkinSelector } from "@/components/SkinSelector"
import { MatchDetailsDialog } from "@/components/dialog/MatchDetailsDialog"
import { TwoFactorSetupDialog } from "@/components/dialog/TwoFactorSetupDialog"
import { BarChartIcon as ChartNoAxesCombined, Gamepad2, LogOut, Origami } from "lucide-react"
import axios from "axios"
import { useDictionary } from "@/hooks/UseDictionnary"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/Dialog"
import { useAuth } from "@/contexts/auth-context"
import UpdatePassword from "./components/UpdatePassword"
import type { BaseUser } from "@/types/user"
import type { Skin } from "@/types/skins"
import api from "@/lib/api"
import { GameType } from "@/types/game"
import { cn, handleImageUpload } from "@/lib/utils"
import { useToast } from "@/hooks/UseToast"
import { TwoFactorVerifyDialog } from "@/components/dialog/TwoFactorVerifyDialog"
import { ConsultDataDialog } from "@/components/dialog/ConsultDataDialog"

// Sample skin data
const characterSkins: Skin[] = [
	{
		id: "cs1",
		name: "CLASSIC PIXEL",
		image: "/images/placeholder.svg?height=100&width=100",
	},
	{
		id: "cs2",
		name: "NEON WARRIOR",
		image: "/images/placeholder.svg?height=100&width=100",
	},
	{
		id: "cs3",
		name: "ROBOT PLAYER",
		image: "/images/placeholder.svg?height=100&width=100",
	},
	{
		id: "cs4",
		name: "GHOST MODE",
		image: "/images/placeholder.svg?height=100&width=100",
	},
	{
		id: "cs5",
		name: "RETRO HERO",
		image: "/images/placeholder.svg?height=100&width=100",
	},
]

const pongMapSkins: Skin[] = [
	{
		id: "pms1",
		name: "CLASSIC ARENA",
		image: "/images/placeholder.svg?height=100&width=200",
	},
	{
		id: "pms2",
		name: "SPACE VOID",
		image: "/images/placeholder.svg?height=100&width=200",
	},
	{
		id: "pms3",
		name: "NEON GRID",
		image: "/images/placeholder.svg?height=100&width=200",
	},
	{
		id: "pms4",
		name: "RETRO ARCADE",
		image: "/images/placeholder.svg?height=100&width=200",
	},
]

const dinoMapSkins: Skin[] = [
	{
		id: "dms1",
		name: "RETRO DESERT",
		image: "/images/placeholder.svg?height=100&width=200",
	},
	{
		id: "dms2",
		name: "CYBER CITY",
		image: "/images/placeholder.svg?height=100&width=200",
	},
	{
		id: "dms3",
		name: "PIXEL FOREST",
		image: "/images/placeholder.svg?height=100&width=200",
	},
]

type Player = {
	id: string
	user_id: string | null
	username: string
	is_bot: boolean
	avatar?: string
}

type GameResult = {
	id: string
	score: number
	is_winner: boolean
	player: Player
}

type GameSession = {
	id: string
	game_type: "PONG" | "DINO"
	created_at: string
	results: GameResult[]
}

type GameHistoryItem = {
	id: string
	score: number
	is_winner: boolean
	player: Player
	gameSession: GameSession
}

export default function DashboardPage() {
	const { setAccessToken } = useAuth()
	const { toast } = useToast()

	const [user, setUser] = useState<BaseUser | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	const [stats, setStats] = useState({
		total_games_played: 0,
		pong_win_rate: 0,
		best_dino_score: 0,
	})

	// Add these new states for game history
	const [pongGameHistory, setPongGameHistory] = useState<any[]>([])
	const [dinoGameHistory, setDinoGameHistory] = useState<any[]>([])

	const [username, setUsername] = useState("")
	const [usernameError, setUsernameError] = useState<string | null>(null)

	const [selectedMatch, setSelectedMatch] = useState<null | {
		type: GameType
		details: any
	}>(null)

	// Dialogs
	const [matchDialogOpen, setMatchDialogOpen] = useState(false)
	const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
	const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false)
	const [removeAvatarDialogOpen, setRemoveAvatarDialogOpen] = useState(false)
	const [remove2FADialogOpen, setRemove2FADialogOpen] = useState(false)
	const [consultDataDialogOpen, setConsultDataDialogOpen] = useState(false)

	const [twoFactorSetupOpen, setTwoFactorSetupOpen] = useState(false)
	const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

	const [twoFactorVerifyOpen, setTwoFactorVerifyOpen] = useState(false)
	const [twoFactorVerifyError, setTwoFactorVerifyError] = useState<string | null>(null)
	const [twoFactorVerifyLoading, setTwoFactorVerifyLoading] = useState(false)

	const fileInputRef = React.useRef<HTMLInputElement>(null)

	// Add these new states for chart data
	const [gamePlayData, setGamePlayData] = useState<any[]>([])
	const [scoreData, setScoreData] = useState<any[]>([])

	// MATCH DETAILS
	const handleMatchClick = (type: GameType, details: any) => {
		setSelectedMatch({ type, details })
		setMatchDialogOpen(true)
	}

	// ACCOUNT
	const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const rawValue = event.target.value
		const alphanumericValue = rawValue.replace(/[^a-zA-Z0-9]/g, "")

		const newUsername = alphanumericValue.slice(0, 20)
		setUsername(newUsername)

		if (newUsername.length > 0 && newUsername.length < 6) {
			setUsernameError("6 characters minimum")
		} else {
			setUsernameError(null)
		}
	}

	const saveAccountChanges = (event: React.FormEvent) => {
		event.preventDefault()
		setIsLoading(true)

		api
			.put(`/user/${user?.id}`, {
				name: username,
			})
			.then(() => {
				updateData()
				toast({
					title: "Account Updated",
					description: "Your account has been updated successfully",
					duration: 3000,
				})
			})
			.catch((error) => {
				if (error.status === 409) {
					setUsernameError("Username already taken")
				} else {
					toast({
						title: "Error",
						description: "There was an error updating your account",
						duration: 3000,
					})
					console.log("Error updating account", error)
				}
			})
			.finally(() => {
				setIsLoading(false)
			})
	}

	// LOGOUT
	const handleLogout = () => {
		setLogoutDialogOpen(true)
	}

	const confirmLogout = () => {
		console.log("Logging out...")

		axios
			.get("/api/auth/logout")
			.then(() => {
				console.log("Logout successful")
				setAccessToken(null)
				localStorage.removeItem("userId")

				setLogoutDialogOpen(false)
				window.location.href = "/login"
			})
			.catch((error) => {
				console.error("Logout error:", error)
			})
	}

	// Delete account
	const handleDeleteAccount = () => {
		setDeleteAccountDialogOpen(true)
	}

	const confirmDeleteAccount = () => {
		console.log("Deleting account...")

		try {
			api
				.delete(`/user/${user?.id}`)
				.then(() => {
					toast({
						title: "Account Deleted",
						description: "Your account has been deleted successfully",
						duration: 3000,
					})
					setAccessToken(null)
					localStorage.removeItem("userId")
					window.location.href = "/login"
				})
				.catch((error) => {
					console.error("Error deleting account:", error)
				})
		} catch (err: any) {
			toast({
				title: "Error",
				description: `There was an error when deleting your account: ${err.message}`,
				duration: 3000,
			})
		}
		setDeleteAccountDialogOpen(false)
	}

	// Consult data
	const handleConsultData = () => {
		setConsultDataDialogOpen(true)
	}

	// Save skin selections
	const saveSkins = () => {
		console.log("Saving skin selections...")
		setIsLoading(true)

		setTimeout(() => {
			setIsLoading(false)
		}, 1000)
	}

	// Avatar
	const handleUploadAvatarBtn = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click()
		}
	}

	const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		try {
			const response = await handleImageUpload(file)
			await api
				.put(`/user/${user?.id}`, {
					avatar: response,
				})
				.then(() => {
					updateData()
					toast({
						title: "Avatar Updated",
						description: "Your avatar has been updated successfully",
						duration: 3000,
					})
				})
		} catch (err: any) {
			toast({
				title: "Error",
				description: `There was an error updating your avatar: ${err.message}`,
				duration: 3000,
			})
		}
	}

	const handleRemoveAvatar = () => {
		setRemoveAvatarDialogOpen(true)
	}

	const confirmRemoveAvatar = () => {
		console.log("Removing avatar...")
		setRemoveAvatarDialogOpen(false)
	}

	const handle2FAComplete = () => {
		updateData()
		toast({
			title: "2FA Enabled",
			description: "2FA has been enabled successfully",
			duration: 3000,
		})
	}

	const confirmRemove2FA = async (code: string) => {
		setTwoFactorVerifyLoading(true)
		setTwoFactorVerifyError(null)

		try {
			const response = await api.post(`/user/tfa-delete`, { token: code })
			if (response.data.statusCode === 200) {
				setTwoFactorVerifyOpen(false)
				setRemove2FADialogOpen(false)
				toast({
					title: "2FA Disabled",
					description: "2FA has been disabled successfully",
					duration: 3000,
				})
				updateData()
			}
		} catch (error) {
			setTwoFactorVerifyError("Invalid code")
		} finally {
			setTwoFactorVerifyLoading(false)
		}
	}

	const updateData = () => {
		const userId = localStorage.getItem("userId")
		console.log("userId: " + userId)

		if (userId) {
			api
				.get(`/user/${userId}`)
				.then((response) => {
					setUser(response.data.user)
					setUsername(response.data.user.name || "")
					setTwoFactorEnabled(response.data.user.tfaEnable || false)
				})
				.catch((error) => {
					console.error("Error fetching user data:", error)
				})
		}
	}

	const fetchStats = async () => {
		try {
			const userId = localStorage.getItem("userId")
			if (userId) {
				const response = await api.get(`/history/stats/${userId}`)
				if (response.data && response.data.statusCode === 200) {
					setStats({
						total_games_played: response.data.total_games_played,
						pong_win_rate: response.data.pong_win_rate,
						best_dino_score: response.data.best_dino_score,
					})
				}
			}
		} catch (error) {
			console.error("Error fetching stats:", error)
		}
	}

	// Add this new function to fetch game history
	const fetchGameHistory = async () => {
		try {
			const userId = localStorage.getItem("userId")
			if (userId) {
				// Fetch all game history
				const response = await api.get(`/history/${userId}`)
				if (response.data && response.data.history) {
					// Filter for Pong games and sort by date (newest first)
					const pongGames = response.data.history
						.filter((game: GameHistoryItem) => game.gameSession?.game_type === "PONG")
						.sort((a: GameHistoryItem, b: GameHistoryItem) => {
							const dateA = new Date(a.gameSession?.created_at || 0).getTime()
							const dateB = new Date(b.gameSession?.created_at || 0).getTime()
							return dateB - dateA // Descending order (newest first)
						})
					setPongGameHistory(pongGames)

					// Filter for Dino games and sort by date (newest first)
					const dinoGames = response.data.history
						.filter((game: GameHistoryItem) => game.gameSession?.game_type === "DINO")
						.sort((a: GameHistoryItem, b: GameHistoryItem) => {
							const dateA = new Date(a.gameSession?.created_at || 0).getTime()
							const dateB = new Date(b.gameSession?.created_at || 0).getTime()
							return dateB - dateA // Descending order (newest first)
						})
					setDinoGameHistory(dinoGames)

					// Process data for charts using all game history
					processGameHistoryForCharts(response.data.history)
				}
			}
		} catch (error) {
			console.error("Error fetching game history:", error)
		}
	}

	// Process game history data for charts
	const processGameHistoryForCharts = (allHistory: GameHistoryItem[]) => {
		if (!allHistory.length) return

		// Process activity chart data (games by day)
		const gamesByDay = new Map()
		const last7Days = Array.from({ length: 7 }, (_, i) => {
			const date = new Date()
			date.setDate(date.getDate() - i)
			return date.toISOString().split("T")[0]
		}).reverse()

		// Initialize the map with zeros for all days
		last7Days.forEach((day) => {
			const dayName = new Date(day).toLocaleDateString("en-US", { weekday: "short" })
			gamesByDay.set(day, { name: dayName, pong: 0, dino: 0 })
		})

		// Count games by day and type
		allHistory.forEach((game) => {
			const gameDate = new Date(game.gameSession.created_at).toISOString().split("T")[0]
			if (gamesByDay.has(gameDate)) {
				const dayData = gamesByDay.get(gameDate)
				if (game.gameSession.game_type === "PONG") {
					dayData.pong += 1
				} else if (game.gameSession.game_type === "DINO") {
					dayData.dino += 1
				}
				gamesByDay.set(gameDate, dayData)
			}
		})

		// Convert map to array for the chart
		const activityData = Array.from(gamesByDay.values())
		setGamePlayData(activityData)

		// Process score progression data
		// Group games by week and calculate average score
		const scoreByWeek = new Map()
		const currentDate = new Date()

		// Process games to calculate weekly scores
		allHistory.forEach((game) => {
			const gameDate = new Date(game.gameSession.created_at)
			const weekDiff = Math.floor((currentDate.getTime() - gameDate.getTime()) / (7 * 24 * 60 * 60 * 1000))
			const weekKey = `Week ${weekDiff + 1}`

			if (!scoreByWeek.has(weekKey)) {
				scoreByWeek.set(weekKey, { scores: [], name: weekKey })
			}

			const weekData = scoreByWeek.get(weekKey)
			weekData.scores.push(game.score)
			scoreByWeek.set(weekKey, weekData)
		})

		// Calculate average scores per week
		const scoreProgression = Array.from(scoreByWeek.entries())
			.map(([week, data]) => ({
				name: week,
				score: Math.round(data.scores.reduce((sum: number, score: number) => sum + score, 0) / data.scores.length),
			}))
			.sort((a, b) => {
				// Sort by week number (extract number from "Week X")
				const weekA = Number.parseInt(a.name.split(" ")[1])
				const weekB = Number.parseInt(b.name.split(" ")[1])
				return weekA - weekB
			})

		setScoreData(scoreProgression.length ? scoreProgression : [{ name: "Week 1", score: 0 }])
	}

	useEffect(() => {
		updateData()
		fetchStats()
		fetchGameHistory()
	}, [])

	useEffect(() => {
		// If there's no game data, initialize with empty values
		if (gamePlayData.length === 0) {
			const emptyData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
				name: day,
				pong: 0,
				dino: 0,
			}))
			setGamePlayData(emptyData)
		}

		if (scoreData.length === 0) {
			setScoreData([
				{ name: "Week 1", score: 0 },
				{ name: "Week 2", score: 0 },
				{ name: "Week 3", score: 0 },
				{ name: "Week 4", score: 0 },
			])
		}
	}, [gamePlayData.length, scoreData.length])

	const dict = useDictionary()
	if (!dict) return null

	return (
		<div className="min-h-screen bg-background flex flex-col">
			<MainNav />

			<div className="flex-1 container py-8 px-4 md:px-6">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
					<div>
						<h1 className="font-pixel text-2xl md:text-3xl mb-2 uppercase">{dict.dashboard.title}</h1>
						<p className="font-pixel text-xs text-muted-foreground uppercase">{dict.dashboard.description}</p>
					</div>

					<div className="flex items-center space-x-4">
						<Avatar className="h-10 w-10 border-2 border-game-blue">
							<AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "..."} />
							<AvatarFallback className="font-pixel text-xs">
								{(user?.name || "..").substring(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col items-start">
							<p className="font-pixel text-sm">{user?.name || "..."}</p>
							<Button
								onClick={handleLogout}
								variant="outline"
								size="sm"
								className="font-pixel text-xs text-game-red hover:bg-red-100/10 hover:text-game-red border-game-red/30 mt-1 h-7 px-2 cursor-pointer transition-all duration-200 active:scale-95 uppercase"
							>
								<LogOut className="h-3 w-3 mr-1" />
								{dict.connection.logout}
							</Button>
						</div>
					</div>
				</div>

				<Tabs defaultValue="overview" className="space-y-4">
					<TabsList className="font-pixel text-xs overflow-x-auto w-full flex-nowrap">
						<TabsTrigger className="uppercase" value="overview">
							{dict.dashboard.sections.overview.title}
						</TabsTrigger>
						<TabsTrigger className="uppercase" value="history">
							{dict.dashboard.sections.history.title}
						</TabsTrigger>
						<TabsTrigger className="uppercase" value="skins">
							{dict.dashboard.sections.skins.title}
						</TabsTrigger>
						<TabsTrigger className="uppercase" value="settings">
							{dict.dashboard.sections.settings.title}
						</TabsTrigger>
					</TabsList>

					<TabsContent value="overview" className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="font-pixel text-sm uppercase">
										{dict.dashboard.sections.overview.totalGames}
									</CardTitle>
									<Gamepad2 className="text-game-red h-5 w-5" />
								</CardHeader>
								<CardContent>
									<div className="font-pixel text-2xl">{stats.total_games_played}</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="font-pixel text-sm uppercase">
										{dict.dashboard.sections.overview.winRate}
									</CardTitle>
									<ChartNoAxesCombined className="text-game-orange h-5 w-5" />
								</CardHeader>
								<CardContent>
									<div className="font-pixel text-2xl">{Math.floor(stats.pong_win_rate)}%</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="font-pixel text-sm uppercase">
										{dict.dashboard.sections.overview.highScore}
									</CardTitle>
									<Origami className="text-game-blue h-5 w-5" />
								</CardHeader>
								<CardContent>
									<div className="font-pixel text-2xl">{stats.best_dino_score}</div>
								</CardContent>
							</Card>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<Card>
								<CardHeader>
									<CardTitle className="font-pixel text-sm uppercase">
										{dict.dashboard.sections.overview.charts.activity.title}
									</CardTitle>
									<CardDescription className="font-pixel text-xs uppercase">
										{dict.dashboard.sections.overview.charts.activity.description}
									</CardDescription>
								</CardHeader>
								<CardContent className="h-80">
									<ChartContainer
										config={{
											pong: {
												label: "Pong Games",
												color: "hsl(var(--chart-1))",
											},
											dino: {
												label: "Dino Games",
												color: "hsl(var(--chart-2))",
											},
										}}
									>
										<ResponsiveContainer width="100%" height="100%">
											<BarChart data={gamePlayData}>
												<CartesianGrid strokeDasharray="3 3" />
												<XAxis dataKey="name" />
												<YAxis />
												<ChartTooltip content={<ChartTooltipContent />} />
												<Legend />
												<Bar dataKey="pong" fill="var(--color-primary)" name={dict.games.pong.title} />
												<Bar dataKey="dino" fill="var(--color-secondary)" name={dict.games.dino.title} />
											</BarChart>
										</ResponsiveContainer>
									</ChartContainer>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="font-pixel text-sm uppercase">
										{dict.dashboard.sections.overview.charts.score.title}
									</CardTitle>
									<CardDescription className="font-pixel text-xs uppercase">
										{dict.dashboard.sections.overview.charts.score.description}
									</CardDescription>
								</CardHeader>
								<CardContent className="h-80">
									<ChartContainer
										config={{
											score: {
												label: "Score",
												color: "hsl(var(--chart-3))",
											},
										}}
									>
										<ResponsiveContainer width="100%" height="100%">
											<LineChart data={scoreData}>
												<CartesianGrid strokeDasharray="3 3" />
												<XAxis dataKey="name" />
												<YAxis />
												<ChartTooltip content={<ChartTooltipContent />} />
												<Legend />
												<Line
													type="monotone"
													dataKey="score"
													stroke="var(--color-score)"
													strokeWidth={2}
													dot={{ r: 4 }}
													activeDot={{ r: 6 }}
													name={dict.dashboard.sections.overview.charts.score.label}
												/>
											</LineChart>
										</ResponsiveContainer>
									</ChartContainer>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="history" className="space-y-4">
						<div className="grid gap-6 md:grid-cols-2">
							<Card>
								<CardHeader>
									<CardTitle className="font-pixel text-sm uppercase">{dict.dashboard.sections.history.pong.title}</CardTitle>
									<CardDescription className="font-pixel text-xs uppercase">{dict.dashboard.sections.history.pong.description}</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-3 h-[480px] overflow-y-auto pr-2 show-scrollbar">
										{pongGameHistory.length > 0 ? (
											pongGameHistory.map((gameResult, index) => {
												const isWinner = gameResult.is_winner || false
												const result = isWinner ? "WIN" : "LOOSE"
												const gameSession = gameResult.gameSession
												const playerCount = gameSession?.results?.length || 0
												const gameDate = new Date(gameSession?.created_at || Date.now()).toLocaleDateString()

												return (
													<div
														key={index}
														className="flex justify-between items-center p-2 bg-muted rounded-md cursor-pointer hover:bg-muted/80 transition-colors"
														onClick={() => handleMatchClick(GameType.PONG, gameSession)}
													>
														<div className="flex items-center space-x-2">
															<div
																className={`w-2 h-2 rounded-full ${isWinner ? "bg-game-green" : "bg-game-red"}`}
															></div>
															<p className="font-pixel text-xs">
																{playerCount} {dict.dashboard.sections.history.players} • {gameDate}
															</p>
														</div>
														<div>
															<p className={`font-pixel text-xs ${isWinner ? "text-game-green" : "text-game-red"}`}>
																{result}
															</p>
														</div>
													</div>
												)
											})
										) : (
											<p className="font-pixel text-xs text-center py-4">{dict.dashboard.sections.history.pong.noGames}</p>
										)}
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="font-pixel text-sm uppercase">{dict.dashboard.sections.history.dino.title}</CardTitle>
									<CardDescription className="font-pixel text-xs uppercase">{dict.dashboard.sections.history.dino.description}</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-3 h-[480px] overflow-y-auto pr-2 show-scrollbar">
										{dinoGameHistory.length > 0 ? (
											dinoGameHistory.map((gameResult, index) => {
												const isWinner = gameResult.is_winner || false
												const result = isWinner ? "WIN" : "LOOSE"
												const gameSession = gameResult.gameSession
												const playerCount = gameSession?.results?.length || 0
												const gameDate = new Date(gameSession?.created_at || Date.now()).toLocaleDateString()

												return (
													<div
														key={index}
														className="flex justify-between items-center p-2 bg-muted rounded-md cursor-pointer hover:bg-muted/80 transition-colors"
														onClick={() => handleMatchClick(GameType.DINO, gameSession)}
													>
														<div className="flex items-center space-x-2">
															<div
																className={`w-2 h-2 rounded-full ${isWinner ? "bg-game-green" : "bg-game-red"}`}
															></div>
															<p className="font-pixel text-xs">
																{playerCount} {dict.dashboard.sections.history.players} • {gameDate}
															</p>
														</div>
														<div>
															<p className={`font-pixel text-xs ${isWinner ? "text-game-green" : "text-game-red"}`}>
																{result}
															</p>
														</div>
													</div>
												)
											})
										) : (
											<p className="font-pixel text-xs text-center py-4">{dict.dashboard.sections.history.dino.noGames}</p>
										)}
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="skins" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="font-pixel text-sm">CHARACTER SKINS</CardTitle>
								<CardDescription className="font-pixel text-xs">CHOOSE YOUR PLAYER APPEARANCE</CardDescription>
							</CardHeader>
							<CardContent>
								<SkinSelector
									title="CHARACTER SKIN"
									description="CHOOSE YOUR PLAYER APPEARANCE"
									skins={characterSkins}
									defaultSelected="cs1"
								/>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="font-pixel text-sm">PONG MAP SKINS</CardTitle>
								<CardDescription className="font-pixel text-xs">SELECT YOUR PONG GAME ENVIRONMENT</CardDescription>
							</CardHeader>
							<CardContent>
								<SkinSelector
									title="PONG MAP"
									description="SELECT YOUR PONG GAME ENVIRONMENT"
									skins={pongMapSkins}
									defaultSelected="pms1"
								/>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="font-pixel text-sm">DINO RUN MAP SKINS</CardTitle>
								<CardDescription className="font-pixel text-xs">SELECT YOUR DINO RUN ENVIRONMENT</CardDescription>
							</CardHeader>
							<CardContent>
								<SkinSelector
									title="DINO RUN MAP"
									description="SELECT YOUR DINO RUN ENVIRONMENT"
									skins={dinoMapSkins}
									defaultSelected="dms1"
								/>
							</CardContent>
						</Card>

						<div className="flex justify-end">
							<Button
								className="font-pixel bg-game-blue hover:bg-game-blue/90 uppercase"
								disabled={isLoading}
								onClick={saveSkins}
							>
								{isLoading ? "Saving selections..." : "Save selections"}
							</Button>
						</div>
					</TabsContent>

					<TabsContent value="settings" className="space-y-4">
						<Tabs defaultValue="account" className="space-y-4">
							<TabsList className="font-pixel text-xs overflow-x-auto w-full flex-nowrap">
								<TabsTrigger className="uppercase" value="account">
									{dict.dashboard.sections.settings.account.title}
								</TabsTrigger>
								<TabsTrigger className="uppercase" value="security">
									{dict.dashboard.sections.settings.security.title}
								</TabsTrigger>
							</TabsList>

							<TabsContent value="account" className="space-y-4 h-4">
								<Card>
									<CardHeader>
										<CardTitle className="font-pixel text-sm uppercase">
											{dict.dashboard.sections.settings.account.title}
										</CardTitle>
										<CardDescription className="font-pixel text-xs uppercase">
											{dict.dashboard.sections.settings.account.description}
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
											<Avatar className="h-20 w-20 border-2 border-game-blue">
												<AvatarImage src={user?.avatar || "/placeholder.svg"} alt="@player" />
												<AvatarFallback className="font-pixel text-lg">
													{(user?.name || "Player").substring(0, 2).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div className="space-y-2">
												<h3 className="font-pixel text-sm uppercase">
													{dict.dashboard.sections.settings.account.picture}
												</h3>
												<div className="flex gap-2">
													<Button
														variant="outline"
														size="sm"
														className="font-pixel text-xs uppercase"
														onClick={handleUploadAvatarBtn}
													>
														{dict.common.upload}
													</Button>
													<Button
														variant="outline"
														size="sm"
														className="font-pixel text-xs text-destructive uppercase"
														onClick={handleRemoveAvatar}
													>
														{dict.common.remove}
													</Button>
													<input
														type="file"
														ref={fileInputRef}
														onChange={handleUploadAvatar}
														className="hidden"
														accept="image/jpeg,image/png"
													/>
												</div>
											</div>
										</div>

										<form onSubmit={saveAccountChanges} className="space-y-4">
											<div className="grid gap-4 md:grid-cols-2">
												<div className="space-y-2">
													<Label htmlFor="username" className="font-pixel text-xs uppercase">
														{dict.dashboard.sections.settings.account.username}
													</Label>
													<Input
														id="username"
														type="text"
														autoComplete="username"
														value={username}
														onChange={handleUsernameChange}
														error={usernameError !== null}
														required
														className="font-pixel text-sm h-10 bg-muted"
													/>
													<p className={cn("font-pixel text-xs text-red-500 mt-1", usernameError ? "" : "select-none")}>
														{usernameError || " "}
													</p>
												</div>
											</div>

											<Button
												type="submit"
												className="font-pixel bg-game-blue hover:bg-game-blue/90 uppercase"
												disabled={isLoading || usernameError !== null || username == user?.name}
											>
												{isLoading ? dict.common.saving : dict.common.save}
											</Button>
										</form>

										<Separator className="my-4" />

										<div className="space-y-2">
											<h3 className="font-pixel text-sm text-destructive uppercase">
												{dict.dashboard.sections.settings.account.dangerZone.title}
											</h3>
											<p className="font-pixel text-xs text-muted-foreground uppercase">
												{dict.dashboard.sections.settings.account.dangerZone.description}.
											</p>
											<div className="flex gap-2">
												<Button variant="outline" className="font-pixel uppercase" onClick={handleConsultData}>
													{dict.dashboard.sections.settings.account.dangerZone.consultData}
												</Button>
												<Button variant="destructive" className="font-pixel uppercase" onClick={handleDeleteAccount}>
													{dict.dashboard.sections.settings.account.dangerZone.delete}
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="security" className="space-y-4">
								<UpdatePassword googleAuth={false} />

								<Card>
									<CardHeader>
										<CardTitle className="font-pixel text-sm uppercase">{dict.dashboard.sections.settings.security.twoFactor.title}</CardTitle>
										<CardDescription className="font-pixel text-xs">
											{dict.dashboard.sections.settings.security.twoFactor.description}
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="flex items-center justify-between">
											<div className="space-y-0.5">
												<h3 className="font-pixel text-sm uppercase">{dict.dashboard.sections.settings.security.twoFactor.status}</h3>
												<p className="font-pixel text-xs text-muted-foreground uppercase">
													{twoFactorEnabled
														? dict.dashboard.sections.settings.security.twoFactor.enabled
														: dict.dashboard.sections.settings.security.twoFactor.disabled}
												</p>
											</div>
										</div>
									</CardContent>
									<CardFooter>
										{twoFactorEnabled ? (
											<Button variant="destructive" className="font-pixel" onClick={() => setRemove2FADialogOpen(true)}>
												{dict.dashboard.sections.settings.security.twoFactor.disable}
											</Button>
										) : (
											<Button variant="outline" className="font-pixel" onClick={() => setTwoFactorSetupOpen(true)}>
												{dict.dashboard.sections.settings.security.twoFactor.enable}
											</Button>
										)}
									</CardFooter>
								</Card>
							</TabsContent>
						</Tabs>
					</TabsContent>
				</Tabs>
			</div>

			{/* Match Details Dialog */}
			<MatchDetailsDialog open={matchDialogOpen} onOpenChange={setMatchDialogOpen} match={selectedMatch} />

			<TwoFactorVerifyDialog
				open={twoFactorVerifyOpen}
				onOpenChange={setTwoFactorVerifyOpen}
				onVerify={confirmRemove2FA}
				isLoading={twoFactorVerifyLoading}
				error={twoFactorVerifyError}
			/>

			{/* 2FA Setup Dialog with the secret hash from backend */}
			<TwoFactorSetupDialog
				open={twoFactorSetupOpen}
				onOpenChange={setTwoFactorSetupOpen}
				onComplete={handle2FAComplete}
			/>

			{/* Logout Confirmation Dialog */}
			<Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="font-pixel text-lg uppercase">{dict.dashboard.logoutDialog.title}</DialogTitle>
						<DialogDescription className="font-pixel text-xs uppercase">
							{dict.dashboard.logoutDialog.description}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:space-x-2">
						<Button
							type="button"
							variant="cancel"
							className="font-pixel text-xs uppercase"
							onClick={() => setLogoutDialogOpen(false)}
						>
							{dict.common.cancel}
						</Button>
						<Button
							type="button"
							variant="destructive"
							className="font-pixel text-xs uppercase"
							onClick={confirmLogout}
						>
							{dict.dashboard.logoutDialog.confirm}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Account Confirmation Dialog */}
			<Dialog open={deleteAccountDialogOpen} onOpenChange={setDeleteAccountDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="font-pixel text-lg uppercase">{dict.dashboard.deleteAccountDialog.title}</DialogTitle>
						<DialogDescription className="font-pixel text-xs uppercase">
							{dict.dashboard.deleteAccountDialog.description}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:space-x-2">
						<Button
							type="button"
							variant="cancel"
							className="font-pixel text-xs uppercase"
							onClick={() => setDeleteAccountDialogOpen(false)}
						>
							{dict.common.cancel}
						</Button>
						<Button
							type="button"
							variant="destructive"
							className="font-pixel text-xs uppercase"
							onClick={confirmDeleteAccount}
						>
							{dict.dashboard.deleteAccountDialog.confirm}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Remove Avatar Confirmation Dialog */}
			<Dialog open={removeAvatarDialogOpen} onOpenChange={setRemoveAvatarDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="font-pixel text-lg uppercase">{dict.dashboard.removeAvatarDialog.title}</DialogTitle>
						<DialogDescription className="font-pixel text-xs uppercase">
							{dict.dashboard.removeAvatarDialog.description}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:space-x-2">
						<Button
							type="button"
							variant="cancel"
							className="font-pixel text-xs uppercase"
							onClick={() => setRemoveAvatarDialogOpen(false)}
						>
							{dict.common.cancel}
						</Button>
						<Button
							type="button"
							variant="destructive"
							className="font-pixel text-xs uppercase"
							onClick={confirmRemoveAvatar}
						>
							{dict.dashboard.removeAvatarDialog.confirm}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Remove 2FA Confirmation Dialog */}
			<Dialog open={remove2FADialogOpen} onOpenChange={setRemove2FADialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="font-pixel text-lg uppercase">{dict.dashboard.remove2faDialog.title}</DialogTitle>
						<DialogDescription className="font-pixel text-xs uppercase">
							{dict.dashboard.remove2faDialog.description}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:space-x-2">
						<Button
							type="button"
							variant="cancel"
							className="font-pixel text-xs uppercase"
							onClick={() => setRemove2FADialogOpen(false)}
						>
							{dict.common.cancel}
						</Button>
						<Button
							type="button"
							variant="destructive"
							className="font-pixel text-xs uppercase"
							onClick={() => setTwoFactorVerifyOpen(true)}
						>
							{dict.dashboard.remove2faDialog.confirm}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Consult Data Dialog */}
			<ConsultDataDialog
				open={consultDataDialogOpen}
				onOpenChange={setConsultDataDialogOpen}
				user={user}
				stats={stats}
				pongGameHistory={pongGameHistory}
				dinoGameHistory={dinoGameHistory}
			/>
		</div>
	)
}
