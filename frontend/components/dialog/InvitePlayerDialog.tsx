"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Button } from "@/components/ui/Button"
import { User } from "lucide-react"

type InvitePlayerDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  matchId: number
  slotNumber: 1 | 2
  gameType: "pong" | "dino"
  onInvite: (matchId: number, slotNumber: 1 | 2, playerId: string) => void
}

export function InvitePlayerDialog({
  open,
  onOpenChange,
  matchId,
  slotNumber,
  gameType,
  onInvite,
}: InvitePlayerDialogProps) {
  const [playerName, setPlayerName] = useState("")

  const handleAddPlayer = () => {
    onInvite(matchId, slotNumber, playerName)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-pixel text-sm uppercase">Add Player to Pong Tournament</DialogTitle>
          <DialogDescription className="font-pixel text-xs uppercase">
            Add a local player to slot {slotNumber} in match #{matchId}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
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
        </div>
        <DialogFooter className="mt-4">
          <Button
            className="font-pixel text-xs uppercase"
            variant="cancel"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className={`font-pixel text-xs uppercase bg-game-blue hover:bg-game-blue/90`}
            disabled={!playerName.trim()}
            onClick={handleAddPlayer}
          >
            <User className="mr-2 h-4 w-4" />
            Add Player
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
