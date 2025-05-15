"use client"

import { useState } from "react"
import { UserPlus, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

interface Friend {
  id: string
  name: string
  avatar?: string
  status: "online" | "offline" | "in-game"
}

interface PlayerSlotProps {
  player?: {
    name: string
    avatar?: string
    isCurrentUser?: boolean
  }
  gameType: string
  matchId: number
  position: "player1" | "player2"
  onInvitePlayer: (matchId: number, position: string, playerId: string) => void
  onAddBot: (matchId: number, position: string) => void
}

export function PlayerSlot({ player, gameType, matchId, position, onInvitePlayer, onAddBot }: PlayerSlotProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock friends data - in a real app, this would come from an API
  const friends: Friend[] = [
    { id: "friend1", name: "Alex Johnson", status: "online" },
    { id: "friend2", name: "Sam Wilson", avatar: "/stylized-sw.png", status: "online" },
    { id: "friend3", name: "Taylor Kim", status: "in-game" },
    { id: "friend4", name: "Jordan Lee", avatar: "/stylized-jl-logo.png", status: "offline" },
    { id: "friend5", name: "Casey Morgan", status: "online" },
  ]

  const filteredFriends = friends.filter((friend) => friend.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // If there's a player, render their info
  if (player) {
    return (
      <div className="flex items-center space-x-2">
        <Avatar className="h-8 w-8 border border-border">
          <AvatarImage
            src={player.avatar || `/placeholder.svg?height=40&width=40&query=${player.name}`}
            alt={player.name}
          />
          <AvatarFallback>{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span
          className={`font-pixel text-sm ${player.isCurrentUser ? `text-${gameType === "pong" ? "game-blue" : "game-orange"}` : ""}`}
        >
          {player.name}
        </span>
      </div>
    )
  }

  // If there's no player, render invite options
  return (
    <div className="flex items-center space-x-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`font-pixel text-xs border-${gameType === "pong" ? "game-blue" : "game-orange"} text-${gameType === "pong" ? "game-blue" : "game-orange"}`}
          >
            <UserPlus className="h-3.5 w-3.5 mr-1" />
            Invite
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-pixel text-lg">Invite a Friend</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="font-pixel text-sm"
            />
            <ScrollArea className="h-72">
              <div className="space-y-2">
                {filteredFriends.length > 0 ? (
                  filteredFriends.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-accent cursor-pointer"
                      onClick={() => {
                        onInvitePlayer(matchId, position, friend.id)
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage
                            src={friend.avatar || `/placeholder.svg?height=40&width=40&query=${friend.name}`}
                            alt={friend.name}
                          />
                          <AvatarFallback>{friend.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-pixel text-sm">{friend.name}</p>
                          <p
                            className={`font-pixel text-xs ${
                              friend.status === "online"
                                ? "text-green-500"
                                : friend.status === "in-game"
                                  ? "text-amber-500"
                                  : "text-gray-400"
                            }`}
                          >
                            {friend.status === "online"
                              ? "Online"
                              : friend.status === "in-game"
                                ? "In Game"
                                : "Offline"}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`font-pixel text-xs text-${gameType === "pong" ? "game-blue" : "game-orange"}`}
                      >
                        Invite
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4 text-muted-foreground font-pixel text-sm">No friends found</p>
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        variant="outline"
        size="sm"
        className={`font-pixel text-xs border-${gameType === "pong" ? "game-blue" : "game-orange"} text-${gameType === "pong" ? "game-blue" : "game-orange"}`}
        onClick={() => onAddBot(matchId, position)}
      >
        <Bot className="h-3.5 w-3.5 mr-1" />
        Add Bot
      </Button>
    </div>
  )
}
