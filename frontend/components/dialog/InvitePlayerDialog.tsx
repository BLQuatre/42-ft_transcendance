"use client"

import { useState } from "react"
import { BotIcon as Robot, User } from "lucide-react"
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
import { Label } from "@/components/ui/Label"

type InvitePlayerDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  matchId: number
  slotNumber: 1 | 2
  gameType: "pong" | "dino"
  onInvite: (matchId: number, slotNumber: 1 | 2, playerId: string) => void
  onAddBot: (matchId: number, slotNumber: 1 | 2) => void
}

export function InvitePlayerDialog({
  open,
  onOpenChange,
  matchId,
  slotNumber,
  gameType,
  onInvite,
  onAddBot,
}: InvitePlayerDialogProps) {
  const [playerName, setPlayerName] = useState("")
  const [activeTab, setActiveTab] = useState<"player" | "bot">("player")

  const gameColor = gameType === "pong" ? "game-blue" : "game-orange"

  const handleAddPlayer = () => {
    if (playerName.trim()) {
      // We're using the playerId parameter to pass the player name directly
      onInvite(matchId, slotNumber, playerName.trim())
      onOpenChange(false)
      setPlayerName("")
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
            Add a local player or bot to slot {slotNumber} in match #{matchId}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "player" | "bot")} className="mt-4">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="player" className="font-pixel text-xs uppercase">
              <User className="mr-2 h-4 w-4" />
              Local Player
            </TabsTrigger>
            <TabsTrigger value="bot" className="font-pixel text-xs uppercase">
              <Robot className="mr-2 h-4 w-4" />
              Add Bot
            </TabsTrigger>
          </TabsList>

          <TabsContent value="player" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="playerName" className="font-pixel text-xs uppercase">
                Player Name
              </Label>
              <Input
                id="playerName"
                placeholder="Enter player name..."
                className="font-pixel text-xs"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
            </div>
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="font-pixel text-xs text-muted-foreground">
                Add a local player to this tournament slot. Players will take turns using the same device.
              </p>
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
          {activeTab === "player" ? (
            <Button
              className={`font-pixel text-xs uppercase bg-${gameColor} hover:bg-${gameColor}/90`}
              disabled={!playerName.trim()}
              onClick={handleAddPlayer}
            >
              <User className="mr-2 h-4 w-4" />
              Add Player
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
