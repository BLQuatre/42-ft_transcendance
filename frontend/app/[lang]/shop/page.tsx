"use client"

import { useState } from "react"
import { MainNav } from "@/components/Navbar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { Footer } from "@/components/Footer"
import { useDictionary } from "@/hooks/use-dictionnary"
import { GameType, ItemStatus, ItemType, MapItem, SkinItem } from "@/types/types"
import { Item } from "@radix-ui/react-dropdown-menu"

// Sample shop items
const characterSkins: SkinItem[] = [
  {
    id: "cs1",
    name: "CLASSIC PIXEL",
    description: "THE ORIGINAL RETRO LOOK",
    price: 0,
    image: "/placeholder.svg?height=100&width=100",
    status: ItemStatus.SELECTED
  },
  {
    id: "cs2",
    name: "NEON WARRIOR",
    description: "GLOW IN THE DIGITAL DARK",
    price: 500,
    image: "/placeholder.svg?height=100&width=100",
    status: ItemStatus.BUY
  },
  {
    id: "cs3",
    name: "ROBOT PLAYER",
    description: "MECHANICAL PRECISION",
    price: 750,
    image: "/placeholder.svg?height=100&width=100",
    status: ItemStatus.BOUGHT
  },
  {
    id: "cs4",
    name: "GHOST MODE",
    description: "SEMI-TRANSPARENT STEALTH",
    price: 1000,
    image: "/placeholder.svg?height=100&width=100",
    status: ItemStatus.BUY
  },
]

const mapSkins: MapItem[] = [
  {
    id: "ms1",
    name: "CLASSIC ARENA",
    description: "THE ORIGINAL BATTLEFIELD",
    price: 0,
    image: "/placeholder.svg?height=100&width=200",
    status: ItemStatus.SELECTED,
    game: GameType.PONG,
  },
  {
    id: "ms2",
    name: "SPACE VOID",
    description: "PLAY AMONG THE STARS",
    price: 600,
    image: "/placeholder.svg?height=100&width=200",
    status: ItemStatus.BUY,
    game: GameType.PONG,
  },
  {
    id: "ms3",
    name: "RETRO DESERT",
    description: "CLASSIC DINO ENVIRONMENT",
    price: 0,
    image: "/placeholder.svg?height=100&width=200",
    status: ItemStatus.SELECTED,
    game: GameType.DINO,
  },
  {
    id: "ms4",
    name: "CYBER CITY",
    description: "RUN THROUGH THE DIGITAL METROPOLIS",
    price: 800,
    image: "/placeholder.svg?height=100&width=200",
    status: ItemStatus.BUY,
    game: GameType.DINO,
  },
]

export default function ShopPage() {
  const [playerSkins, setPlayerSkins] = useState(characterSkins)
  const [gameMaps, setGameMaps] = useState(mapSkins)
  const [coins, setCoins] = useState(1250)
  const { toast } = useToast()
  const dict = useDictionary()

  if (!dict) {
    return null
  }

  const buySkin = (id: string, type: ItemType) => {
    const items = type === ItemType.SKIN ? playerSkins : gameMaps
    const setItems = type === ItemType.SKIN ? setPlayerSkins : setGameMaps

    const item = items.find((item) => item.id === id)
    if (!item) return

    if (coins >= item.price) {
      setCoins((prev) => prev - item.price)
      setItems(items.map((i) => (i.id === id ? { ...i, status: ItemStatus.BOUGHT } : i)))

      toast({
        title: "Purchase Successful",
        description: `You've purchased ${item.name}!`,
        duration: 3000,
      })
    } else {
      toast({
        title: "Insufficient Coins",
        description: "You don't have enough coins for this purchase.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const equipSkin = (id: string, type: ItemType) => {
    const items = type === ItemType.SKIN ? playerSkins : gameMaps
    const setItems = type === ItemType.SKIN ? setPlayerSkins : setGameMaps

    const game = type === ItemType.MAP ? (items.find((item) => item.id === id) as (MapItem | undefined))?.game : null

    setItems(
      items.map((i) => {
        if ((type === ItemType.MAP && game && i.game !== game) || i.status === ItemStatus.BUY) {
          return i
        }
        return {
          ...i,

          status: i.id === id ? ItemStatus.SELECTED : ItemStatus.BOUGHT,
        }
      }),
    )

    toast({
      title: "Skin selected",
      description: `You've selected a new skin!`,
      duration: 3000,
    })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNav />

      <div className="flex-1 container py-8 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="font-pixel text-2xl md:text-3xl mb-2 uppercase">{dict.shop.title}</h1>
            <p className="font-pixel text-xs text-muted-foreground uppercase">{dict.shop.description}</p>
          </div>

          <div className="flex items-center space-x-2 bg-muted p-2 rounded-md">
            <span className="font-pixel text-sm uppercase">{dict.shop.balance}:</span>
            <span className="font-pixel text-lg text-game-orange">{coins}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-game-orange"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v12" />
              <path d="M8 10h8" />
            </svg>
          </div>
        </div>

        <Tabs defaultValue="characters" className="space-y-4">
          <TabsList className="font-pixel text-xs overflow-x-auto w-full flex-nowrap">
            <TabsTrigger value="characters" className="uppercase">{dict.shop.categories.characters}</TabsTrigger>
            <TabsTrigger value="maps"className="uppercase">{dict.shop.categories.maps}</TabsTrigger>
          </TabsList>

          <TabsContent value="characters" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {playerSkins.map((skin) => (
                <Card key={skin.id} className={`overflow-hidden ${skin.status == ItemStatus.SELECTED ? "border-game-blue" : ""}`}>
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="font-pixel text-sm">{skin.name}</CardTitle>
                    </div>
                    <CardDescription className="font-pixel text-xs">{skin.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 flex justify-center">
                    <div className="relative w-24 h-24 bg-muted rounded-md overflow-hidden">
                      <Image src={skin.image || "/placeholder.svg"} alt={skin.name} fill className="object-cover" />
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 flex justify-between">
                    {skin.status === ItemStatus.BUY ? (
                      <>
                        <div className="flex items-center">
                          <span className="font-pixel text-sm text-game-orange mr-1">{skin.price}</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-game-orange"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v12" />
                            <path r="10" />
                            <path d="M12 6v12" />
                            <path d="M8 10h8" />
                          </svg>
                        </div>
                        <Button
                          className="font-pixel text-xs bg-game-blue hover:bg-game-blue/90 uppercase"
                          onClick={() => buySkin(skin.id, ItemType.SKIN)}
                        >
                          {dict.shop.status.buy}
                        </Button>
                      </>
                    ) : (skin.status === ItemStatus.BOUGHT) ? (
                      <Button
                        className="font-pixel text-xs w-full bg-game-green hover:bg-game-green/90 uppercase"
                        onClick={() => equipSkin(skin.id, ItemType.SKIN)}
                      >
                        {dict.shop.status.select}
                      </Button>
                    ) : (
                      <Button
                        className="font-pixel text-xs w-full bg-game-green/70 uppercase"
                        disabled={true}
                      >
                        {dict.shop.status.selected}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="maps" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {gameMaps.map((map) => (
                <Card key={map.id} className={`overflow-hidden ${map.status == ItemStatus.SELECTED ? "border-game-blue" : ""}`}>
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="font-pixel text-sm">{map.name}</CardTitle>
                      </div>
                      {/* TODO: Change badge color if dino or pong */}
                      <Badge className="font-pixel text-[10px] bg-muted uppercase" variant="defaultNoHover">
                        {map.game === "pong" ? dict.games.pong.title : dict.games.dino.title}
                      </Badge>
                    </div>
                    <CardDescription className="font-pixel text-xs mt-2">{map.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 flex justify-center">
                    <div className="relative w-full h-32 bg-muted rounded-md overflow-hidden">
                      <Image src={map.image || "/placeholder.svg"} alt={map.name} fill className="object-cover" />
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 flex justify-between">
                    {map.status === ItemStatus.BUY ? (
                      <>
                        <div className="flex items-center">
                          <span className="font-pixel text-sm text-game-orange mr-1">{map.price}</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-game-orange"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v12" />
                            <path d="M8 10h8" />
                          </svg>
                        </div>
                        <Button
                          className="font-pixel text-xs bg-game-blue hover:bg-game-blue/90 uppercase"
                          onClick={() => buySkin(map.id, ItemType.MAP)}
                        >
                          {dict.shop.status.buy}
                        </Button>
                      </>
                    ) : (map.status === ItemStatus.BOUGHT) ? (
                      <Button
                        className="font-pixel text-xs w-full bg-game-green hover:bg-game-green/90 uppercase"
                        onClick={() => equipSkin(map.id, ItemType.MAP)}
                      >
                        {dict.shop.status.select}
                      </Button>
                    ) : (
                      <Button
                        className="font-pixel text-xs w-full bg-game-green/70 uppercase"
                        disabled={true}
                      >
                        {dict.shop.status.selected}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer dict={dict} />
    </div>
  )
}
