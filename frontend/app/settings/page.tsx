"use client"

import type React from "react"

import { useState } from "react"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import axios from "axios"

// Add language selection to the settings page and update the color theme UI

// First, add the language selection imports at the top
import { Check, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Import the SkinSelector component
import { SkinSelector } from "@/components/skin-selector"
import { Footer } from "@/components/footer"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)

  // Then, inside the component, add the languages array
  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "ja", name: "Japanese" },
  ]

  // Add sample skin data
  const characterSkins = [
    {
      id: "cs1",
      name: "CLASSIC PIXEL",
      image: "/placeholder.svg?height=100&width=100",
      owned: true,
    },
    {
      id: "cs2",
      name: "NEON WARRIOR",
      image: "/placeholder.svg?height=100&width=100",
      owned: false,
    },
    {
      id: "cs3",
      name: "ROBOT PLAYER",
      image: "/placeholder.svg?height=100&width=100",
      owned: true,
    },
    {
      id: "cs4",
      name: "GHOST MODE",
      image: "/placeholder.svg?height=100&width=100",
      owned: false,
    },
    {
      id: "cs5",
      name: "RETRO HERO",
      image: "/placeholder.svg?height=100&width=100",
      owned: true,
    },
  ]

  const pongMapSkins = [
    {
      id: "pms1",
      name: "CLASSIC ARENA",
      image: "/placeholder.svg?height=100&width=200",
      owned: true,
    },
    {
      id: "pms2",
      name: "SPACE VOID",
      image: "/placeholder.svg?height=100&width=200",
      owned: false,
    },
    {
      id: "pms3",
      name: "NEON GRID",
      image: "/placeholder.svg?height=100&width=200",
      owned: true,
    },
    {
      id: "pms4",
      name: "RETRO ARCADE",
      image: "/placeholder.svg?height=100&width=200",
      owned: false,
    },
  ]

  const dinoMapSkins = [
    {
      id: "dms1",
      name: "RETRO DESERT",
      image: "/placeholder.svg?height=100&width=200",
      owned: true,
    },
    {
      id: "dms2",
      name: "CYBER CITY",
      image: "/placeholder.svg?height=100&width=200",
      owned: false,
    },
    {
      id: "dms3",
      name: "PIXEL FOREST",
      image: "/placeholder.svg?height=100&width=200",
      owned: true,
    },
  ]

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    axios.get('/api/auth/access', {
      headers: {
        Authorization: `token_here`
      }
    })
    .then(response => {
      console.log('Token valid:', response.data);
    })
    .catch(error => {
      console.error('Token invalid:', error.response?.data || error.message);
    });

    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNav />

      <div className="flex-1 container py-8 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="font-pixel text-2xl md:text-3xl mb-2">SETTINGS</h1>
          <p className="font-pixel text-xs text-muted-foreground">MANAGE YOUR ACCOUNT AND PREFERENCES</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="font-pixel text-xs overflow-x-auto w-full flex-nowrap">
            <TabsTrigger value="profile">PROFILE</TabsTrigger>
            <TabsTrigger value="account">ACCOUNT</TabsTrigger>
            <TabsTrigger value="security">SECURITY</TabsTrigger>
            <TabsTrigger value="appearance">APPEARANCE</TabsTrigger>
            <TabsTrigger value="skins">SKINS</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-pixel text-sm">PROFILE</CardTitle>
                <CardDescription className="font-pixel text-xs">MANAGE YOUR PUBLIC PROFILE INFORMATION</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <Avatar className="h-20 w-20 border-2 border-game-blue">
                    <AvatarImage src="/placeholder.svg?height=80&width=80" alt="@player" />
                    <AvatarFallback className="font-pixel text-lg">P1</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h3 className="font-pixel text-sm">PROFILE PICTURE</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="font-pixel text-xs">
                        UPLOAD
                      </Button>
                      <Button variant="outline" size="sm" className="font-pixel text-xs text-destructive">
                        REMOVE
                      </Button>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="font-pixel text-xs">
                        USERNAME
                      </Label>
                      <Input id="username" defaultValue="PLAYER_ONE" className="font-pixel text-sm h-10 bg-muted" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="displayName" className="font-pixel text-xs">
                        DISPLAY NAME
                      </Label>
                      <Input id="displayName" defaultValue="Player One" className="font-pixel text-sm h-10 bg-muted" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="font-pixel text-xs">
                      BIO
                    </Label>
                    <textarea
                      id="bio"
                      rows={3}
                      defaultValue="Retro gaming enthusiast. Pong champion."
                      className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm font-pixel"
                    />
                  </div>

                  <Button type="submit" className="font-pixel bg-game-blue hover:bg-game-blue/90" disabled={isLoading}>
                    {isLoading ? "SAVING..." : "SAVE CHANGES"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-pixel text-sm">ACCOUNT INFORMATION</CardTitle>
                <CardDescription className="font-pixel text-xs">UPDATE YOUR ACCOUNT DETAILS</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-pixel text-xs">
                      EMAIL
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="player@example.com"
                      className="font-pixel text-sm h-10 bg-muted"
                    />
                  </div>

                  <Button type="submit" className="font-pixel bg-game-blue hover:bg-game-blue/90" disabled={isLoading}>
                    {isLoading ? "UPDATING..." : "UPDATE EMAIL"}
                  </Button>
                </form>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <h3 className="font-pixel text-sm text-destructive">DANGER ZONE</h3>
                  <p className="font-pixel text-xs text-muted-foreground">
                    ONCE YOU DELETE YOUR ACCOUNT, THERE IS NO GOING BACK. PLEASE BE CERTAIN.
                  </p>
                  <Button variant="destructive" className="font-pixel">
                    DELETE ACCOUNT
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-pixel text-sm">PASSWORD</CardTitle>
                <CardDescription className="font-pixel text-xs">CHANGE YOUR PASSWORD</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="font-pixel text-xs">
                      CURRENT PASSWORD
                    </Label>
                    <Input id="currentPassword" type="password" className="font-pixel text-sm h-10 bg-muted" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="font-pixel text-xs">
                      NEW PASSWORD
                    </Label>
                    <Input id="newPassword" type="password" className="font-pixel text-sm h-10 bg-muted" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="font-pixel text-xs">
                      CONFIRM NEW PASSWORD
                    </Label>
                    <Input id="confirmPassword" type="password" className="font-pixel text-sm h-10 bg-muted" />
                  </div>

                  <Button type="submit" className="font-pixel bg-game-blue hover:bg-game-blue/90" disabled={isLoading}>
                    {isLoading ? "UPDATING..." : "UPDATE PASSWORD"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-pixel text-sm">TWO-FACTOR AUTHENTICATION</CardTitle>
                <CardDescription className="font-pixel text-xs">
                  ADD AN EXTRA LAYER OF SECURITY TO YOUR ACCOUNT
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="font-pixel text-sm">2FA STATUS</h3>
                    <p className="font-pixel text-xs text-muted-foreground">
                      TWO-FACTOR AUTHENTICATION IS CURRENTLY DISABLED
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="font-pixel">
                  SETUP 2FA
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-pixel text-sm">THEME</CardTitle>
                <CardDescription className="font-pixel text-xs">
                  CUSTOMIZE THE APPEARANCE OF THE APPLICATION
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="font-pixel text-sm">DARK MODE</h3>
                    <p className="font-pixel text-xs text-muted-foreground">TOGGLE BETWEEN LIGHT AND DARK MODE</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-3">
                  <h3 className="font-pixel text-sm">COLOR THEME</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {["#4A9DFF", "#FFA500", "#FF4D4D", "#4CAF50", "#9C27B0"].map((color, index) => (
                      <button
                        key={index}
                        className={`h-12 w-full rounded-md border-2 ${index === 0 ? "border-white" : "border-transparent"}`}
                        style={{ backgroundColor: color }}
                        onClick={() => {}}
                        aria-label={`Color theme ${index + 1}`}
                      >
                        {index === 0 && <Check className="h-6 w-6 text-white mx-auto" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-pixel text-sm">LANGUAGE</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between font-pixel">
                        <span>ENGLISH</span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full" align="end">
                      {languages.map((language) => (
                        <DropdownMenuItem
                          key={language.code}
                          className="font-pixel text-xs cursor-pointer"
                          onClick={() => {}}
                        >
                          {language.name.toUpperCase()}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="font-pixel bg-game-blue hover:bg-game-blue/90">SAVE PREFERENCES</Button>
              </CardFooter>
            </Card>
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
              <Button className="font-pixel bg-game-blue hover:bg-game-blue/90">SAVE SELECTIONS</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  )
}
