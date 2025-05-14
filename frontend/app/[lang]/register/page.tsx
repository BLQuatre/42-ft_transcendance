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

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNav />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 bg-card rounded-lg overflow-hidden pixel-border">
          <div className="p-8 flex flex-col justify-center">
            <h1 className="font-pixel text-3xl text-center mb-8">REGISTER</h1>

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="font-pixel text-sm">
                  Username
                </Label>
                <Input
                  id="username"
                  type="username"
                  placeholder="player123"
                  required
                  className="font-pixel text-sm h-10 bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-pixel text-sm">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="font-pixel text-sm h-10 bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-pixel text-sm">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  required
                  className="font-pixel text-sm h-10 bg-muted"
                />
              </div>

              <Button
                type="submit"
                className="w-full font-pixel bg-game-blue hover:bg-game-blue/90"
                disabled={isLoading}
              >
                REGISTER
              </Button>
            </form>

            <div className="mt-4 relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 font-pixel text-muted-foreground">OR</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="mt-4 font-pixel flex items-center justify-center gap-2"
              onClick={() => setIsLoading(true)}
            >
              <FcGoogle className="h-5 w-5" />
              SIGN UP WITH GOOGLE
            </Button>

            <p className="mt-4 text-center text-sm font-pixel text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-game-blue hover:underline">
                Login
              </Link>
            </p>
          </div>

          <div className="relative hidden md:block bg-linear-to-br from-game-dark to-black overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_50%,#FFD700_50%)]"></div>
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
        </div>
      </div>
    </div>
  )
}
