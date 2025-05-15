"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageSquare, UserMinus, UserPlus, Check, X } from "lucide-react"

interface FriendCardProps {
  id: string
  username: string
  avatar: string
  status?: "online" | "offline" | "away"
  lastSeen?: string
  type: "friend" | "request" | "suggested"
  mutualFriends?: number
  onMessage?: (id: string) => void
  onRemove?: (id: string) => void
  onAdd?: (id: string) => void
  onAccept?: (id: string) => void
  onReject?: (id: string) => void
}

export function FriendCard({
  id,
  username,
  avatar,
  status,
  lastSeen,
  type,
  mutualFriends,
  onMessage,
  onRemove,
  onAdd,
  onAccept,
  onReject,
}: FriendCardProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Avatar>
            <AvatarImage src={avatar || "/placeholder.svg"} alt={username} />
            <AvatarFallback className="font-pixel text-xs">{username.substring(0, 2)}</AvatarFallback>
          </Avatar>
          {status && (
            <span
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                status === "online" ? "bg-green-500" : status === "away" ? "bg-yellow-500" : "bg-gray-500"
              }`}
            />
          )}
        </div>
        <div>
          <p className="font-pixel text-sm">{username}</p>
          {type === "friend" && (
            <p className="font-pixel text-xs text-muted-foreground">
              {status === "online" ? "Online" : `Last seen: ${lastSeen}`}
            </p>
          )}
          {type === "request" && <p className="font-pixel text-xs text-muted-foreground">Sent friend request</p>}
          {type === "suggested" && (
            <p className="font-pixel text-xs text-muted-foreground">
              {mutualFriends} mutual friend{mutualFriends !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>
      <div className="flex space-x-2">
        {type === "friend" && (
          <>
            {onMessage && (
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onMessage(id)}>
                <MessageSquare className="h-4 w-4" />
                <span className="sr-only">Message</span>
              </Button>
            )}
            {onRemove && (
              <Button variant="outline" size="icon" className="h-8 w-8 text-destructive" onClick={() => onRemove(id)}>
                <UserMinus className="h-4 w-4" />
                <span className="sr-only">Remove friend</span>
              </Button>
            )}
          </>
        )}
        {type === "request" && (
          <>
            {onAccept && (
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-green-500/20 text-green-500 hover:bg-green-500/30 hover:text-green-600"
                onClick={() => onAccept(id)}
              >
                <Check className="h-4 w-4" />
                <span className="sr-only">Accept</span>
              </Button>
            )}
            {onReject && (
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-red-500/20 text-red-500 hover:bg-red-500/30 hover:text-red-600"
                onClick={() => onReject(id)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Reject</span>
              </Button>
            )}
          </>
        )}
        {type === "suggested" && onAdd && (
          <Button variant="outline" size="sm" className="font-pixel text-xs" onClick={() => onAdd(id)}>
            <UserPlus className="h-4 w-4 mr-2" />
            ADD FRIEND
          </Button>
        )}
      </div>
    </div>
  )
}
