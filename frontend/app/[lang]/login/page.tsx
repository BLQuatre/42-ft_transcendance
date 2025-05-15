"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MainNav } from "@/components/main-nav"
import { FcGoogle } from "react-icons/fc"
import { useDictionary } from "@/hooks/use-dictionnary"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = "/"
    }, 1000)
  }

  const dict = useDictionary()
  if (!dict) return null

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNav />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 bg-card rounded-lg overflow-hidden pixel-border">
          <div className="relative hidden md:block bg-linear-to-br from-game-dark to-black overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_50%,#4A9DFF_50%)]"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4">
              <Image
                src="/placeholder.svg?height=300&width=300"
                alt="Game character"
                width={300}
                height={300}
                className="pixel-art"
              />
            </div>
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
                  type="username"
                  placeholder="player123"
                  required
                  className="font-pixel text-sm h-10 bg-muted"
                />
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="password" className="font-pixel text-sm">
                  {dict.connection.password.title}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={dict.connection.password.placeholder}
                    required
                    className="font-pixel text-sm h-10 bg-muted pr-10"
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
              </div>
              <Button
                type="submit"
                className="w-full font-pixel bg-game-blue hover:bg-game-blue/90 uppercase"
                disabled={isLoading}
              >
                {dict.connection.login}
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
    </div>
  )
}
