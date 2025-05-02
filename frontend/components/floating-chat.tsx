"use client"

import { useState, useRef, useEffect, useCallback, memo } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, X, Minimize2, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"

// Sample friends data
const friendsData = [
  {
    id: "f1",
    username: "GAMER42",
    status: "online",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Hey, want to play Pong?",
    unread: 2,
  },
  {
    id: "f2",
    username: "PIXEL_MASTER",
    status: "offline",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "That was a great game!",
    unread: 0,
  },
  {
    id: "f3",
    username: "RETRO_FAN",
    status: "online",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Check out my new high score!",
    unread: 1,
  },
]

// Sample general chat messages
const generalChatData = [
  {
    id: "g1",
    username: "SYSTEM",
    avatar: "/placeholder.svg?height=40&width=40",
    message: "Welcome to the General Chat!",
    timestamp: "12:00 PM",
    isSystem: true,
  },
  {
    id: "g2",
    username: "GAMER42",
    avatar: "/placeholder.svg?height=40&width=40",
    message: "Hey everyone! Who's up for some Pong?",
    timestamp: "12:05 PM",
  },
  {
    id: "g3",
    username: "RETRO_FAN",
    avatar: "/placeholder.svg?height=40&width=40",
    message: "I just beat the high score in Dino Run!",
    timestamp: "12:10 PM",
  },
]

// Sample private chat messages
const privateChatData = {
  f1: [
    {
      id: "p1",
      sender: "GAMER42",
      receiver: "PLAYER_ONE",
      message: "Hey, want to play Pong?",
      timestamp: "11:45 AM",
      isMine: false,
    },
    {
      id: "p2",
      sender: "PLAYER_ONE",
      receiver: "GAMER42",
      message: "Give me 5 minutes.",
      timestamp: "11:47 AM",
      isMine: true,
    },
  ],
  f3: [
    {
      id: "p5",
      sender: "RETRO_FAN",
      receiver: "PLAYER_ONE",
      message: "Check out my new high score!",
      timestamp: "10:30 AM",
      isMine: false,
    },
    {
      id: "p6",
      sender: "PLAYER_ONE",
      receiver: "RETRO_FAN",
      message: "Wow, that's impressive!",
      timestamp: "10:35 AM",
      isMine: true,
    },
  ],
}

// Memoized message component to reduce re-renders
const ChatMessage = memo(
  ({
    message,
    isPrivate = false,
  }: {
    message: any
    isPrivate?: boolean
  }) => {
    if (isPrivate) {
      return (
        <div className={`flex ${message.isMine ? "justify-end" : "justify-start"}`}>
          <div className={`max-w-[80%] ${message.isMine ? "bg-game-blue text-white" : "bg-muted"} rounded-lg p-2`}>
            <div className="flex items-center space-x-2">
              {!message.isMine && <p className="font-pixel text-[10px] font-bold">{message.sender}</p>}
              <p className="font-pixel text-[10px] text-muted-foreground/70">{message.timestamp}</p>
            </div>
            <p className="font-pixel text-xs mt-1">{message.message}</p>
          </div>
        </div>
      )
    }

    if (message.isSystem) {
      return (
        <div className="w-full text-center">
          <p className="font-pixel text-[10px] text-muted-foreground bg-muted inline-block px-2 py-1 rounded-md">
            {message.message}
          </p>
        </div>
      )
    }

    return (
      <div className="flex items-start space-x-2">
        <Avatar className="h-6 w-6 flex-shrink-0">
          <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.username} />
          <AvatarFallback className="font-pixel text-[10px]">{message.username.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <p className="font-pixel text-[10px] font-bold">{message.username}</p>
            <p className="font-pixel text-[10px] text-muted-foreground">{message.timestamp}</p>
          </div>
          <p className="font-pixel text-xs mt-0.5">{message.message}</p>
        </div>
      </div>
    )
  },
)
ChatMessage.displayName = "ChatMessage"

// Memoized friend item component
const FriendItem = memo(({ friend, isActive, onClick }: { friend: any; isActive: boolean; onClick: () => void }) => {
  return (
    <button
      className={cn(
        "w-full flex items-center space-x-2 p-1.5 rounded-md hover:bg-muted transition-colors text-left",
        isActive ? "bg-muted" : "",
      )}
      onClick={onClick}
    >
      <div className="relative flex-shrink-0">
        <Avatar className="h-6 w-6">
          <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.username} />
          <AvatarFallback className="font-pixel text-[10px]">{friend.username.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <span
          className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border border-background ${
            friend.status === "online" ? "bg-green-500" : "bg-gray-500"
          }`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-pixel text-xs truncate">{friend.username}</p>
      </div>
      {friend.unread > 0 && (
        <Badge className="bg-game-red text-white font-pixel text-[10px] h-5 min-w-5 flex items-center justify-center p-0">
          {friend.unread}
        </Badge>
      )}
    </button>
  )
})
FriendItem.displayName = "FriendItem"

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [friends, setFriends] = useState(friendsData)
  const [generalChat, setGeneralChat] = useState(generalChatData)
  const [privateChats, setPrivateChats] = useState(privateChatData)
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Calculate total unread messages
  const totalUnread = friends.reduce((sum, friend) => sum + friend.unread, 0)

  // Scroll to bottom of messages when they change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [generalChat, privateChats, activeChat, isOpen])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen, activeChat])

  // Handle click outside to close chat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Memoized handler functions to prevent unnecessary re-renders
  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim()) return

    if (activeChat) {
      // Send private message
      const newPrivateMessage = {
        id: `p${Date.now()}`,
        sender: "PLAYER_ONE",
        receiver: friends.find((f) => f.id === activeChat)?.username || "",
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isMine: true,
      }

      setPrivateChats((prev) => ({
        ...prev,
        [activeChat]: [...(prev[activeChat as keyof typeof prev] || []), newPrivateMessage],
      }))

      // Clear unread messages for this chat
      setFriends((prev) => prev.map((friend) => (friend.id === activeChat ? { ...friend, unread: 0 } : friend)))
    } else {
      // Send message to general chat
      const newGeneralMessage = {
        id: `g${Date.now()}`,
        username: "PLAYER_ONE",
        avatar: "/placeholder.svg?height=40&width=40",
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setGeneralChat((prev) => [...prev, newGeneralMessage])
    }

    setNewMessage("")
  }, [newMessage, activeChat, friends])

  const handleOpenChat = useCallback(() => {
    setIsOpen(true)
    // Reset unread counts when opening chat
    setFriends((prev) => prev.map((friend) => (activeChat === friend.id ? { ...friend, unread: 0 } : friend)))
  }, [activeChat])

  const handleFriendSelect = useCallback((friendId: string) => {
    setActiveChat(friendId)
    // Clear unread for this friend
    setFriends((prev) => prev.map((friend) => (friend.id === friendId ? { ...friend, unread: 0 } : friend)))
  }, [])

  // Get current messages based on active chat
  const currentMessages = activeChat ? privateChats[activeChat as keyof typeof privateChats] || [] : generalChat

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <Card
          ref={chatRef}
          className={cn(
            "mb-2 flex flex-col shadow-lg pixel-border transition-all duration-200 ease-in-out",
            isExpanded ? "w-[80vw] h-[80vh] md:w-[600px] md:h-[500px]" : "w-[320px] h-[400px]",
          )}
        >
          <CardHeader className="p-3 border-b flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center space-x-2">
              {activeChat ? (
                <>
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={friends.find((f) => f.id === activeChat)?.avatar || ""}
                      alt={friends.find((f) => f.id === activeChat)?.username || ""}
                    />
                    <AvatarFallback className="font-pixel text-[10px]">
                      {(friends.find((f) => f.id === activeChat)?.username || "").substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-pixel text-sm">{friends.find((f) => f.id === activeChat)?.username || ""}</span>
                </>
              ) : (
                <>
                  <MessageSquare className="h-5 w-5" />
                  <span className="font-pixel text-sm">GENERAL CHAT</span>
                </>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Minimize" : "Maximize"}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)} title="Close">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <div className="flex flex-1 overflow-hidden">
            {/* Friends List - Only show in expanded mode or when no active chat */}
            {(isExpanded || !activeChat) && (
              <div className={cn("border-r", isExpanded ? "w-1/4" : "w-1/3")}>
                <Tabs defaultValue="friends" className="h-full flex flex-col">
                  <TabsList className="font-pixel text-xs px-2 justify-start h-8 bg-transparent">
                    <TabsTrigger value="friends" className="h-6 px-2 text-[10px]">
                      FRIENDS
                    </TabsTrigger>
                    <TabsTrigger value="general" className="h-6 px-2 text-[10px]">
                      GENERAL
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="friends" className="flex-1 p-0 overflow-hidden">
                    <ScrollArea className="h-full">
                      <div className="p-2 space-y-1">
                        {friends.map((friend) => (
                          <FriendItem
                            key={friend.id}
                            friend={friend}
                            isActive={activeChat === friend.id}
                            onClick={() => handleFriendSelect(friend.id)}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="general" className="flex-1 p-0 overflow-hidden">
                    <div
                      className="p-2 flex items-center space-x-2 bg-muted/50 cursor-pointer"
                      onClick={() => setActiveChat(null)}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <p className="font-pixel text-xs">GENERAL CHAT</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full p-3">
                  <div className="space-y-3">
                    {currentMessages.map((message) => (
                      <ChatMessage key={message.id} message={message} isPrivate={!!activeChat} />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              <CardFooter className="p-2 border-t">
                <div className="flex items-center w-full space-x-2">
                  <Input
                    ref={inputRef}
                    placeholder="Type your message..."
                    className="flex-1 font-pixel text-xs h-8"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button
                    className="h-8 px-2 bg-game-blue hover:bg-game-blue/90"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </CardFooter>
            </div>
          </div>
        </Card>
      )}

      {/* Chat Button */}
      <Button
        className="bg-game-blue hover:bg-game-blue/90 shadow-lg pixel-border relative"
        size="icon"
        onClick={isOpen ? () => setIsOpen(false) : handleOpenChat}
      >
        <MessageSquare className="h-5 w-5" />
        {totalUnread > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-game-red text-white font-pixel text-[10px] min-w-5 h-5 flex items-center justify-center p-0">
            {totalUnread}
          </Badge>
        )}
      </Button>
    </div>
  )
}
