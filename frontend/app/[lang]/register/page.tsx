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
import { Eye, EyeOff } from "lucide-react"
import axios from "axios"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function RegisterPage() {
  const router = useRouter()
  const { setAccessToken } = useAuth();

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>)   {
    event.preventDefault()
    setIsLoading(true)

    console.log("Form submitted");

    axios.post('/api/auth/register', {
      name: username,
      password: password
    })
    .then(response => {
      console.log("Successfull register: " + JSON.stringify(response.data))
      setAccessToken(response.data.accessToken)
      localStorage.setItem("userId", response.data.user.id)
      router.push("/")
    })
    .catch(error => {
      if (error.status == 409) {
        setUsernameError("Username already taken")
      } else {
        console.error("Error: " + JSON.stringify(error))
      }
    })
    .finally(() => {
      setIsLoading(false)
    })
  }

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const alphanumericValue = rawValue.replace(/[^a-zA-Z0-9]/g, '');

    const newUsername = alphanumericValue.slice(0, 20);
    setUsername(newUsername);

    if (newUsername.length > 0 && newUsername.length < 6) {
      setUsernameError("6 characters minimum");
    } else {
      setUsernameError(null);
    }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);

    if (newPassword.length < 8) {
      setPasswordError("8 characters minimum");
    } else {
      setPasswordError(null);
    }

    if (newPassword !== confirmPassword && newPassword.length > 0 && confirmPassword.length > 0) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError(null);
    }
  };

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setConfirmPassword(newPassword);

    if (password !== newPassword && newPassword.length > 0 && password.length > 0) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError(null);
    }
  };

  const dict = useDictionary()
  if (!dict) return null

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNav />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 bg-card rounded-lg overflow-hidden pixel-border">
          <div className="p-8 flex flex-col justify-center">
            <h1 className="font-pixel text-3xl text-center mb-8 uppercase">{dict.connection.register}</h1>

            <form onSubmit={onSubmit} className="space-y-6">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="font-pixel text-sm">
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
                  error={usernameError !== null}
                  value={username}
                  onChange={handleUsernameChange}
                />
                <p className={cn("font-pixel text-xs text-red-500 mt-1", usernameError ? "" : "select-none")}>{usernameError || " "}</p>
              </div>

              {/* Password */}
              <div className="space-y-2 relative">
                <Label htmlFor="password" className="font-pixel text-sm">
                  {dict.connection.password.title}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    autoComplete="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder={dict.connection.password.placeholder}
                    required
                    className="font-pixel text-sm h-10 bg-muted pr-10"
                    error={passwordError !== null}
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
                  </Button>
                </div>
                <p className={cn("font-pixel text-xs text-red-500 mt-1", passwordError ? "" : "select-none")}>{passwordError || " "}</p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2 relative">
                <Label htmlFor="confirmPassword" className="font-pixel text-sm">
                  {dict.connection.password.confirm}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    autoComplete="new-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={dict.connection.password.confirmPlaceholder}
                    required
                    className="font-pixel text-sm h-10 bg-muted pr-10"
                    error={confirmPasswordError !== null}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-10 w-10 px-0 hover:bg-transparent hover:opacity-70"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <p className={cn("font-pixel text-xs text-red-500 mt-1", confirmPasswordError ? "" : "select-none")}>{confirmPasswordError || " "}</p>
              </div>

              <Button
                type="submit"
                className="w-full font-pixel bg-game-blue hover:bg-game-blue/90 uppercase"
                disabled={isLoading || usernameError !== null || passwordError !== null || confirmPasswordError !== null
                || username.length < 6 || password.length < 8
                }
              >
                {dict.connection.register}
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
              onClick={() => setIsLoading(true)}
            >
              <FcGoogle className="h-5 w-5" />
              {dict.connection.google.register}
            </Button>

            <p className="mt-4 text-center text-xs font-pixel text-muted-foreground">
              {dict.connection.haveAccount}{" "}
              <Link href="/login" className="text-game-blue hover:underline">
                {dict.connection.login}
              </Link>
            </p>
          </div>

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
                <h2 className="font-pixel text-xl bg-linear-to-r from-game-blue via-game-orange to-game-red bg-clip-text text-transparent text-center">
                  ft_transcendance
                </h2>
                <p className="font-pixel text-xs text-center text-white/70 mt-1">RETRO GAMES</p>
              </div>
            </div>

            {/* Pixel corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-game-blue/70 z-20"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-game-blue/70 z-20"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-game-blue/70 z-20"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-game-blue/70 z-20"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
