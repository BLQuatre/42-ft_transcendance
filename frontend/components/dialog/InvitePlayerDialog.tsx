"use client"

import { useState } from "react"
import Image from "next/image"
import { Check, BotIcon as Robot, Search, User, UserPlus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { cn } from "@/lib/utils"

type Friend = {
  id: string
  name: string
  avatar: string | null
  status: "online" | "offline" | "in-game"
}

type InvitePlayerDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  matchId: number
  slotNumber: 1 | 2
  gameType: "pong" | "dino"
  onInvite: (matchId: number, slotNumber: 1 | 2, playerId: string) => void
  onAddBot: (matchId: number, slotNumber: 1 | 2) => void
}

// Mock friends data - in a real app, this would come from an API
const mockFriends: Friend[] = [
  { id: "friend1", name: "Alex Johnson", avatar: "/abstract-geometric-sculpture.png", status: "online" },
  { id: "friend2", name: "Sam Wilson", avatar: null, status: "online" },
  { id: "friend3", name: "Taylor Kim", avatar: "/placeholder-3b2c0.png", status: "in-game" },
  { id: "friend4", name: "Jordan Smith", avatar: null, status: "offline" },
  { id: "friend5", name: "Casey Brown", avatar: null, status: "online" },
]

export function InvitePlayerDialog({
  open,
  onOpenChange,
  matchId,
  slotNumber,
  gameType,
  onInvite,
  onAddBot,
}: InvitePlayerDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null)
  // No longer need botDifficulty state
  const [activeTab, setActiveTab] = useState<"friends" | "bot">("friends")

  const gameColor = gameType === "pong" ? "game-blue" : "game-orange"

  // Filter friends based on search query
  const filteredFriends = mockFriends.filter((friend) => friend.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleInviteFriend = () => {
    if (selectedFriendId) {
      onInvite(matchId, slotNumber, selectedFriendId)
      onOpenChange(false)
    }
  }

  const handleAddBot = () => {
    onAddBot(matchId, slotNumber)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-pixel text-sm uppercase">
            Add Player to {gameType === "pong" ? "Pong" : "Dino"} Tournament
          </DialogTitle>
          <DialogDescription className="font-pixel text-xs uppercase">
            Invite a friend or add a bot to slot {slotNumber} in match #{matchId}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "friends" | "bot")} className="mt-4">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="friends" className="font-pixel text-xs uppercase">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Friend
            </TabsTrigger>
            <TabsTrigger value="bot" className="font-pixel text-xs uppercase">
              <Robot className="mr-2 h-4 w-4" />
              Add Bot
            </TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search friends..."
                className="pl-8 font-pixel text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="border rounded-md overflow-hidden">
              <div className="max-h-[250px] overflow-y-auto">
                {filteredFriends.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className="font-pixel text-xs text-muted-foreground uppercase">No friends found</p>
                  </div>
                ) : (
                  filteredFriends.map((friend) => (
                    <div
                      key={friend.id}
                      className={cn(
                        "flex items-center justify-between p-3 border-b last:border-b-0 cursor-pointer hover:bg-muted/50",
                        selectedFriendId === friend.id && `bg-${gameColor}/10`,
                      )}
                      onClick={() => setSelectedFriendId(friend.id)}
                    >
                      <div className="flex items-center">
                        {friend.avatar ? (
                          <Image
                            src={friend.avatar || "/placeholder.svg"}
                            alt={friend.name}
                            width={36}
                            height={36}
                            className="rounded-full mr-3"
                          />
                        ) : (
                          <div
                            className={`w-9 h-9 rounded-full bg-${gameColor}/20 flex items-center justify-center mr-3`}
                          >
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="font-pixel text-xs uppercase">{friend.name}</p>
                          <div
                            className={cn(
                              "flex items-center mt-1 font-pixel text-[10px] uppercase",
                              friend.status === "online" && "text-green-500",
                              friend.status === "offline" && "text-muted-foreground",
                              friend.status === "in-game" && "text-blue-500",
                            )}
                          >
                            <div
                              className={cn(
                                "w-1.5 h-1.5 rounded-full mr-1",
                                friend.status === "online" && "bg-green-500",
                                friend.status === "offline" && "bg-muted-foreground",
                                friend.status === "in-game" && "bg-blue-500",
                              )}
                            ></div>
                            {friend.status === "online" && "ONLINE"}
                            {friend.status === "offline" && "OFFLINE"}
                            {friend.status === "in-game" && "IN GAME"}
                          </div>
                        </div>
                      </div>
                      {selectedFriendId === friend.id && <Check className={`h-5 w-5 text-${gameColor}`} />}
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bot" className="space-y-4">
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full bg-${gameColor} flex items-center justify-center mr-3`}>
                    <Robot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-pixel text-sm uppercase">Tournament Bot</p>
                    <p className="font-pixel text-xs text-muted-foreground uppercase">
                      AI opponent for your tournament
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-3 rounded-md">
                <p className="font-pixel text-xs text-muted-foreground">
                  Add a bot player to this tournament slot. The bot will automatically play when its match is scheduled.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="font-pixel text-xs uppercase">
            Cancel
          </Button>
          {activeTab === "friends" ? (
            <Button
              className={`font-pixel text-xs uppercase bg-${gameColor} hover:bg-${gameColor}/90`}
              disabled={!selectedFriendId}
              onClick={handleInviteFriend}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Friend
            </Button>
          ) : (
            <Button
              className={`font-pixel text-xs uppercase bg-${gameColor} hover:bg-${gameColor}/90`}
              onClick={handleAddBot}
            >
              <Robot className="mr-2 h-4 w-4" />
              Add Bot
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
