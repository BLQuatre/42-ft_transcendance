"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { MainNav } from "@/components/Navbar"
import { FcGoogle } from "react-icons/fc"
import { useDictionary } from "@/hooks/UseDictionnary"
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from "next/navigation"
import axios from "axios"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { TwoFactorVerifyDialog } from "@/components/dialog/TwoFactorVerifyDialog"

export default function LoginPage() {
	const router = useRouter()
	const { setAccessToken } = useAuth()

	const [isLoading, setIsLoading] = useState(false)
	const [showPassword, setShowPassword] = useState(false)

	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [loginError, setLoginError] = useState<string | null>(null)

	// 2FA state
	const [twoFactorRequired, setTwoFactorRequired] = useState(false)
	const [twoFactorError, setTwoFactorError] = useState<string | null>(null)
	const [token, setTwoFactorToken] = useState<string | null>(null)

	async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setIsLoading(true)
		setLoginError(null)

		console.log("Login submitted");

		try {
			const response = await axios.post('/api/auth/login', {
				name: username,
				password: password
			})

			console.log("Login response:", response.status, response.data)

			// Check if 2FA is required (status 200 but no access token)
			if (response.status === 202) {
				// Store any token needed for the 2FA verification step
				setTwoFactorToken(response.data.twoFactorToken || null)
				// Show 2FA dialog
				setTwoFactorRequired(true)
				setIsLoading(false)
			} else {
				// Normal login success
				setAccessToken(response.data.accessToken)
				sessionStorage.setItem("userId", response.data.user.id)
				router.push("/")
			}
		} catch (error: any) {
			console.error("Login error:", error)
			if (error.response?.status === 401 || error.response?.status === 404) {
				setLoginError("Invalid username or password")
			} else {
				setLoginError("An error occurred. Please try again.")
			}
			setIsLoading(false)
		}
	}

	async function handleGoogleLogin() {
		window.location.href = '/api/auth/google';
	}

	const handleVerify2FA = async (code: string) => {
		setIsLoading(true)
		setTwoFactorError(null)

		try {
			const response = await axios.post('/api/auth/verify-2fa', {
				token
			})

			// 2FA verification successful
			setAccessToken(response.data.accessToken)
			setTwoFactorRequired(false)
			router.push("/")
		} catch (error: any) {
			console.error("2FA verification error:", error)
			if (error.response?.status === 401) {
				setTwoFactorError("Invalid verification code")
			} else {
				setTwoFactorError("An error occurred. Please try again.")
			}
			setIsLoading(false)
		}
	}

	const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(event.target.value)
		setLoginError(null)
	}

	const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value)
		setLoginError(null)
	}

	const dict = useDictionary()
	if (!dict) return null

	return (
		<div className="min-h-screen bg-background flex flex-col">
			<MainNav />

			<div className="flex-1 flex items-center justify-center p-4">
				<div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 bg-card rounded-lg overflow-hidden pixel-border">
					<div className="hidden md:block relative bg-linear-to-br from-game-dark to-black overflow-hidden">
						{/* Decorative elements */}
						<div className="absolute inset-0 bg-gradient-to-br from-game-blue/20 to-transparent z-10"></div>
						<div className="absolute inset-0 grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)] opacity-30 z-10">
							{Array.from({ length: 40 }).map((_, i) => (
								<div
									key={i}
									className="border border-game-blue/10"
									style={{
										gridColumn: `span ${Math.floor(Math.random() * 3) + 1} / span ${Math.floor(Math.random() * 3) + 1}`,
										gridRow: `span ${Math.floor(Math.random() * 3) + 1} / span ${Math.floor(Math.random() * 3) + 1}`,
									}}
								></div>
							))}
						</div>

						{/* Top image container */}
						<div className="absolute top-0 left-0 right-0 h-1/2">
							<div className="absolute inset-0 bg-black/30 z-10"></div>
							<Image
								src="https://archive.org/download/dino-run/dino-run.jpg"
								alt="Game character"
								fill
								className="object-cover blur-[2px] brightness-75 saturate-150"
								priority
							/>
						</div>

						{/* Bottom image container */}
						<div className="absolute bottom-0 left-0 right-0 h-1/2">
							<div className="absolute inset-0 bg-black/30 z-10"></div>
							<Image
								src="https://upload.wikimedia.org/wikipedia/commons/f/f8/Pong.png"
								alt="Game item"
								fill
								className="object-cover blur-[2px] brightness-75 saturate-150"
								priority
							/>
						</div>

						{/* Center logo/text overlay */}
						<div className="absolute inset-0 flex items-center justify-center z-20">
							<div className="bg-black/50 p-4 rounded-lg border border-game-blue/50 backdrop-blur-sm">
								<h2 className="font-pixel text-xl bg-linear-to-r from-game-blue via-game-orange to-game-red bg-clip-text text-transparent text-center">ft_transcendance</h2>
								<p className="font-pixel text-xs text-center text-white/70 mt-1">RETRO GAMES</p>
							</div>
						</div>

						{/* Pixel corners */}
						<div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-game-blue/70 z-20"></div>
						<div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-game-blue/70 z-20"></div>
						<div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-game-blue/70 z-20"></div>
						<div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-game-blue/70 z-20"></div>
					</div>

					<div className="p-8 flex flex-col justify-center">
						<h1 className="font-pixel text-3xl text-center mb-8 uppercase">{dict.connection.login}</h1>

						<form onSubmit={onSubmit} className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="Username" className="font-pixel text-sm">
									{dict.connection.username}
								</Label>
								<Input
									id="username"
									name="username"
									type="text"
									autoComplete="username"
									placeholder="player123"
									required
									className="font-pixel text-sm h-10 bg-muted"
									error={loginError !== null}
									value={username}
									onChange={handleUsernameChange}
								/>
							</div>

							<div className="space-y-2 relative">
								<Label htmlFor="password" className="font-pixel text-sm">
									{dict.connection.password.title}
								</Label>
								<div className="relative">
									<Input
										id="password"
										name="password"
										autoComplete="current-password"
										type={showPassword ? "text" : "password"}
										placeholder={dict.connection.password.placeholder}
										required
										className="font-pixel text-sm h-10 bg-muted pr-10"
										error={loginError !== null}
										value={password}
										onChange={handlePasswordChange}
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="absolute right-0 top-0 h-10 w-10 px-0 hover:bg-transparent hover:opacity-70"
										onClick={() => setShowPassword(!showPassword)}
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4 text-muted-foreground" />
										) : (
											<Eye className="h-4 w-4 text-muted-foreground" />
										)}
										<span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
									</Button>
								</div>
								<p className={cn("font-pixel text-xs text-red-500 mt-1", loginError ? "" : "select-none")}>{loginError || " "}</p>
							</div>
							<Button
								type="submit"
								className="w-full font-pixel bg-game-blue hover:bg-game-blue/90 uppercase"
								disabled={isLoading}
							>
								{isLoading ? "Logging in..." : dict.connection.login}
							</Button>
						</form>

						<div className="mt-4 relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t border-muted" />
							</div>
							<div className="relative flex justify-center text-xs">
								<span className="bg-card px-2 font-pixel text-muted-foreground uppercase">{dict.connection.or}</span>
							</div>
						</div>

						<Button
							variant="outline"
							className="mt-4 font-pixel flex items-center justify-center gap-2 uppercase"
							onClick={handleGoogleLogin}
						>
							<FcGoogle className="h-5 w-5" />
							{dict.connection.google.login}
						</Button>

						<p className="mt-4 text-center text-xs font-pixel text-muted-foreground">
							{dict.connection.dontHaveAccount}{" "}
							<Link href="/register" className="text-game-blue hover:underline">
								{dict.connection.register}
							</Link>
						</p>
					</div>
				</div>
			</div>

			{/* 2FA Verification Dialog */}
			<TwoFactorVerifyDialog
				open={twoFactorRequired}
				onOpenChange={setTwoFactorRequired}
				onVerify={handleVerify2FA}
				isLoading={isLoading}
				error={twoFactorError}
			/>
		</div>
	)
}
