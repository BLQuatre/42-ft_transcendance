"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { User, Users } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

//   const isLoggedIn = pathname !== "/login" && pathname !== "/register"
	const isLoggedIn = true

  return (
    <div className="flex justify-between items-center w-full px-4 py-3 bg-game-dark border-b-4 border-game-blue">
      <Link href="/" className="flex items-center space-x-2">
        <span className="font-pixel text-xl bg-linear-to-r from-game-blue via-game-orange to-game-red bg-clip-text text-transparent animate-pixelate">
          ft_transcendance
        </span>
      </Link>

      <nav className="hidden md:flex items-center space-x-6">
        {isLoggedIn && (
          <>
            <Link
              href="/"
              className={cn(
                "font-pixel text-sm transition-colors hover:text-game-blue",
                pathname === "/" ? "text-game-blue" : "text-muted-foreground",
              )}
            >
              HOME
            </Link>
            <Link
              href="/games"
              className={cn(
                "font-pixel text-sm transition-colors hover:text-game-blue",
                pathname.startsWith("/games") ? "text-game-blue" : "text-muted-foreground",
              )}
            >
              GAMES
            </Link>
            <Link
              href="/shop"
              className={cn(
                "font-pixel text-sm transition-colors hover:text-game-blue",
                pathname === "/shop" ? "text-game-blue" : "text-muted-foreground",
              )}
            >
              SHOP
            </Link>
          </>
        )}
      </nav>

      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <div className="relative">
              <Link
                href="/friends"
                className={cn(
                  "flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-muted",
                  pathname === "/friends" ? "bg-muted" : "",
                )}
              >
                <Users className="h-5 w-5" />
                <span className="font-pixel text-xs hidden sm:inline-block">FRIENDS</span>
              </Link>
            </div>
            <div className="relative">
              <Link
                href="/dashboard"
                className={cn(
                  "flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-muted",
                  pathname === "/dashboard" ? "bg-muted" : "",
                )}
              >
                <User className="h-5 w-5" />
                <span className="font-pixel text-xs hidden sm:inline-block">DASHBOARD</span>
              </Link>
            </div>
            {/* Mobile navigation */}
            <div className="md:hidden">
              <Button variant="outline" size="sm" className="font-pixel text-xs">
                MENU
              </Button>
            </div>
          </>
        ) : (
          <Button asChild className="font-pixel bg-game-blue hover:bg-game-blue/90">
            <Link href={pathname === "/register" ? "/login" : "/register"}>
              {pathname === "/register" ? "LOGIN" : "REGISTER"}
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
