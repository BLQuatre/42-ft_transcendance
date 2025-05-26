"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { ScrollArea } from "@/components/ui/ScrollArea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog"
import { MessageSquare, Send, X, ChevronLeft, Search, Users, Home, Gamepad2, BadgePercent, User2, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { BaseUser, UserStatus } from "@/types/user"
import api from "@/lib/api"
import { Separator } from "@/components/ui/Separator"
import { useDictionary } from "@/hooks/UseDictionnary"

// Types
type Message = {
  id: string
  userId: string
  name: string
  content: string
}

type Friend = {
  id: string
  name: string
  avatar: string
  status: UserStatus
}

type GameInvite = {
  id: string
  gameId: string
  gameName: string
  senderId: string
  receiverId: string
  status: "pending" | "accepted" | "declined"
  timestamp: string
}

type Game = {
  id: string
  name: string
  icon: string
}

const initialPrivateMessages: Record<string, Message[]> = {
  f1: [
    {
      id: "pm1",
      userId: "u1",
      name: "GAMER42",
      content: "Hey, on fait une partie?",
    },
    {
      id: "pm2",
      userId: "u2",
      name: "PLAYER_ONE",
      content: "Dans 5 minutes!",
    },
    {
      id: "pm3",
      userId: "u3",
      name: "GAMER42",
      content: "Super, je prépare le jeu.",
    },
    {
      id: "pm4",
      userId: "u4",
      name: "GAMER42",
      content: "Prêt quand tu l'es!",
    },
  ],
  f3: [
    {
      id: "pm5",
      userId: "u5",
      name: "RETRO_FAN",
      content: "Regarde mon nouveau score!",
    },
    {
      id: "pm6",
      userId: "u6",
      name: "PLAYER_ONE",
      content: "Wow, impressionnant!",
    },
    {
      id: "pm7",
      userId: "u7",
      name: "RETRO_FAN",
      content: "Merci! J'ai passé toute la nuit dessus.",
    },
  ],
}

// 2. Add available games constant after the initialPrivateMessages
const availableGames: Game[] = [
  { id: "game1", name: "Pong", icon: "🏓" },
  { id: "game2", name: "Dino Run", icon: "🦖" },
]

enum ChatView {
  GENERAL = "general",
  FRIENDS = "friends",
  PRIVATE = "private",
}

export function SimpleChat() {
  const { accessToken } = useAuth()
  const router = useRouter()
  const dict = useDictionary()

  const userRef = useRef<BaseUser | null>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [activeView, setActiveView] = useState<ChatView>(ChatView.GENERAL)

  const generalSocket = useRef<WebSocket | null>(null)
  const [generalMessages, setGeneralMessages] = useState<Message[]>([])


  const friendsSocket = useRef<WebSocket | null>(null)
  const friends = useRef<Record<string, Friend>>({})
  const [friendsMessages, setFriendsMessages] = useState<Record<string, Message[]>>(initialPrivateMessages)
  const [activeFriend, setActiveFriend] = useState<Friend | null>(null)





  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")













  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 3. Add new state variables in the SimpleChat component after the existing state variables
  const [showGameInviteModal, setShowGameInviteModal] = useState(false)
  const [gameInvites, setGameInvites] = useState<GameInvite[]>([])
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [copiedRoomCode, setCopiedRoomCode] = useState<string | null>(null)

  const filteredFriends = Object.values(friends.current).filter((friend) =>
    (friend.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  const userId = localStorage.getItem("userId");

  const getUserFromId = async (id: string) => {
    try {
      const response = await api.get(`/user/${id}`)
      return response.data.user
    } catch (error) {
      console.error("Error fetching user data:", error)
      if (isOpen)
        setIsOpen(false)
      return null
    }
  }

  // Function to reload friends data
  const reloadFriendsData = async () => {
    try {
      // Clear existing friends
      friends.current = {}

      const response = await api.get("/friend")
      if (response.data.friends) {
        for (const friend of response.data.friends) {
          const friendId = friend.sender_id === userId ? friend.receiver_id : friend.sender_id
          try {
            const userResponse = await api.get(`/user/${friendId}`)
            const friendData = userResponse.data.user
            console.log("Friend data:", JSON.stringify(friendData, null, 2))
            if (friendData) {
              friends.current[friendId] = {
                id: friendId,
                name: friendData.name || "Player",
                avatar: friendData.avatar,
                status: friendData.status || UserStatus.OFFLINE
              }
            }
          } catch (error) {
            console.error(`Error fetching friend data for ${friendId}:`, error)
          }
        }
      }
      // Force re-render by updating a state that triggers friend list update
      setSearchQuery(prev => prev) // This will trigger filteredFriends recalculation
    } catch (error) {
      console.error("Error reloading friends data:", error)
    }
  }

  useEffect(() => {
    if (!userId) {
      if (isOpen)
        setIsOpen(false)
      return
    }

    getUserFromId(userId).then((user) => {
      userRef.current = user
    })

    // Initial load of friends data
    reloadFriendsData()
  }, [])

  // Listen for friend status changes to reload friends data
  useEffect(() => {
    const handleFriendStatusChange = () => {
      console.log("Friend status changed, reloading friends data...")
      reloadFriendsData()
    }

    window.addEventListener('friendStatusChanged', handleFriendStatusChange)

    return () => {
      window.removeEventListener('friendStatusChanged', handleFriendStatusChange)
    }
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [generalMessages, friendsMessages, isOpen, activeView, activeFriend])

  // Focus input when chat opens or changes view
  useEffect(() => {
    if (isOpen && (activeView === ChatView.GENERAL || activeView === ChatView.PRIVATE)) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen, activeView, activeFriend])

  // Handle click outside to close chat
  useEffect(() => {
    const chatButton = document.querySelector("[data-chat-button]")

    function handleClickOutside(event: MouseEvent) {
      // Check if the click is inside a dialog
      const dialogElement = (event.target as Element)?.closest('[role="dialog"]')

      if (
        chatRef.current &&
        !chatRef.current.contains(event.target as Node) &&
        !chatButton?.contains(event.target as Node) &&
        !dialogElement // Don't close if clicking on a dialog
      ) {
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

  useEffect(() => {
    if (!accessToken) {
      console.error("Access token is not available")
      return
    }

    if (generalSocket.current && generalSocket.current.readyState !== WebSocket.CLOSED)
      return

    generalSocket.current = new WebSocket("wss://localhost/api/ws/chat-general")

    if (!generalSocket.current) {
      console.error("WebSocket connection failed")
      return
    }

    generalSocket.current.onopen = () => {
      console.log("Connected to general chat service")
      generalSocket.current?.send(JSON.stringify({ type: "history" }))
    }

    generalSocket.current.onmessage = (event) => {
      try {
        console.log("Received message:", event.data)
        const msg = JSON.parse(event.data)

        switch (msg.type) {  // Fixed missing parenthesis here
          case "history":
            setGeneralMessages(msg.messages)
            break
          case "message":
            setGeneralMessages((prevMessages) => [...prevMessages, msg.message])
            break
          default:
            console.error(`Unknown message: Type: ${msg.type} - Data:`, msg)
            break
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error)
      }
    }

    generalSocket.current.onclose = () => {
      console.log("WebSocket connection closed")
    }

    return () => {
      console.log("Cleaning up WebSocket connection")

      if (generalSocket.current && generalSocket.current.readyState !== WebSocket.CLOSED)
        generalSocket.current.close()
      generalSocket.current = null
    }
  }, [accessToken])

  useEffect(() => {
    if (!accessToken) {
      console.error("Access token is not available")
      return
    }

    if (friendsSocket.current && friendsSocket.current.readyState !== WebSocket.CLOSED)
      return

    console.log(`wss://localhost/api/ws/chat-friend?user_id=${userId}`)
    friendsSocket.current = new WebSocket(`wss://localhost/api/ws/chat-friend?user_id=${userId}`)

    if (!friendsSocket.current) {
      console.error("WebSocket connection failed")
      return
    }

    friendsSocket.current.onopen = () => {
      console.log("Connected to friends chat service")
    }

    friendsSocket.current.onmessage = (event) => {
      try {
        console.log("Received message:", event.data)
        const msg = JSON.parse(event.data)

        switch (msg.type) {
          case "MESSAGE_SENT":
            console.log("Message sent:", msg)
            setFriendsMessages((prevMessages) => ({
              ...prevMessages,
              [msg.data.receiverId]: [
                ...(prevMessages[msg.data.receiverId] || []),
                {
                  id: msg.id,
                  userId: msg.data.senderId,
                  name: userRef.current?.name || msg.senderName,
                  content: msg.data.content,
                },
              ],
            }))
            break
          case "NEW_MESSAGE":
            console.log("New message received:", msg)
            const friendName = friends.current[msg.data.senderId]?.name || msg.senderName
            setFriendsMessages((prevMessages) => ({
              ...prevMessages,
              [msg.data.senderId]: [
                ...(prevMessages[msg.data.senderId] || []),
                {
                  id: msg.data.id,
                  userId: msg.data.senderId,
                  name: friendName,
                  content: msg.data.content,
                },
              ],
            }))
            break
          case "SENT_HISTORY":
            if (!msg.friendId) break
            console.log("Received history for friend: ", msg.friendId, "Messages:", msg.messages)
            const newMessages = msg.messages.map((message: any) => ({
              id: message.id,
              userId: message.senderId,
              name: message.senderId === userId
                ? (userRef.current?.name || "You")
                : (friends.current[message.senderId]?.name || message.name),
              content: message.content,
            }))
            console.log("New messages for friend:", msg.friendId, "Messages:", newMessages)

            setFriendsMessages(otherMessages => ({
              ...otherMessages,
              [msg.friendId]: newMessages,
            }))
            break
          default:
            console.error(`Unknown message: Type: ${msg.type} - Data:`, msg)
            break
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error)
      }
    }

    friendsSocket.current.onclose = () => {
      console.log("WebSocket connection closed")
    }

    return () => {
      console.log("Cleaning up WebSocket connection")

      if (friendsSocket.current && friendsSocket.current.readyState !== WebSocket.CLOSED)
        friendsSocket.current.close()
      friendsSocket.current = null
    }
  }, [accessToken])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    switch (activeView) {
      case ChatView.GENERAL:
        if (!generalSocket.current)return

        const newMsg = {
          type: "message",
          userId: userId,
          name: userRef.current?.name || "Player",
          content: newMessage,
        }

        generalSocket.current.send(JSON.stringify(newMsg))
        break
      case ChatView.PRIVATE:
        if (!friendsSocket.current || !activeFriend) return

        const privateMsg = {
          type: "SEND_MESSAGE",
          receiverId: activeFriend.id,
          content: newMessage,
        }

        friendsSocket.current.send(JSON.stringify(privateMsg))
        break
    }

    setNewMessage("")
  }

  const openPrivateChat = (friend: Friend) => {
    if (!friendsSocket.current) return

    setActiveFriend(friend)

    console.log("Opening private chat with:", friend)

    const message = {
      type: "GET_HISTORY",
      receiverId: friend.id,
    }

    friendsSocket.current.send(JSON.stringify(message))

    setActiveView(ChatView.PRIVATE)
  }

  const handleBackToFriends = () => {
    setActiveView(ChatView.FRIENDS)
    setActiveFriend(null)
  }

  const navigateToProfile = (userId: string) => {
    router.push(`/profile/${userId}`)
  }  // Helper function to render message content
  const renderMessageContent = (content: string) => {
    try {
      const parsed = JSON.parse(content)
      if (parsed.type === "GAME_INVITE") {
        const copyRoomCode = () => {
          navigator.clipboard.writeText(parsed.roomCode)
          setCopiedRoomCode(parsed.roomCode)
          setTimeout(() => setCopiedRoomCode(null), 2000)
        }

        const isCopied = copiedRoomCode === parsed.roomCode

        return (
          <div className="bg-blue-300/90 p-2 rounded-md text-center font-pixel max-w-xs mx-auto">
            <div className="text-white text-xs font-bold mb-1">{parsed.game}</div>
            <button
              onClick={copyRoomCode}
              className="text-white text-xs font-mono bg-blue-200/20 hover:bg-blue-200/30 px-2 py-1 rounded border border-white/20 transition-colors mb-2 cursor-pointer flex items-center justify-center gap-1 w-full"
              title="Cliquer pour copier le code"
            >
              {isCopied ? (
                <>
                  <Check className="h-3 w-3" />
                  <span>{dict?.chat?.copied}</span>
                </>
              ) : (
                parsed.roomCode
              )}
            </button>
            <button
              onClick={() => window.open(parsed.fullUrl, '_blank')}
              className="w-full px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-pixel rounded transition-colors font-bold cursor-pointer"
            >
              {dict?.chat?.join}
            </button>
          </div>
        )
      }
    } catch (e) {
      // If parsing fails, treat as regular message
    }
    // Regular message rendering
    return <span>{content}</span>
  }

  // 4. Add new functions before the return statement
  const handleSendGameInvite = async () => {
    if (!activeFriend || !selectedGame || !friendsSocket.current) return

    console.log("handleSendGameInvite")

    try {
      // Generate a room code similar to the multiplayer dialog
      const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase()

      // Create the game URL based on the selected game
      const gameUrl = selectedGame.id === "game1"
        ? `/games/pong/multi/${roomCode}`
        : `/games/dino/multi/${roomCode}`

      // Create a more attractive invite message with structured content
      const inviteContent = JSON.stringify({
        type: "GAME_INVITE",
        game: selectedGame.name,
        icon: selectedGame.icon,
        roomCode: roomCode,
        gameUrl: gameUrl,
        fullUrl: `${window.location.origin}${gameUrl}`,
        inviterName: userRef.current?.name || "Un ami"
      })

      // Send the invite message through the chat
      const inviteMessage = {
        type: "SEND_MESSAGE",
        receiverId: activeFriend.id,
        content: inviteContent,
      }

      friendsSocket.current.send(JSON.stringify(inviteMessage))

      // Optionally navigate to the game room immediately
      // window.location.assign(gameUrl)

    } catch (error) {
      console.error("Error sending game invite:", error)
    }

    // Close modal
    setShowGameInviteModal(false)
    setSelectedGame(null)
  }

  useEffect(() => {
    const handleOpenPrivateChat = (event: CustomEvent) => {
      const friendData = event.detail
      if (friendData && friendData.id) {
        // Create a friend object from the event data
        const friend: Friend = {
          id: friendData.id,
          name: friendData.name || 'Unknown User',
          avatar: friendData.avatar || '/placeholder.svg',
          status: friendData.status || 'online'
        }

        // Open the chat and set it as active
        setIsOpen(true)
        openPrivateChat(friend)
      }
    }

    window.addEventListener('openPrivateChat', handleOpenPrivateChat as EventListener)

    return () => {
      window.removeEventListener('openPrivateChat', handleOpenPrivateChat as EventListener)
    }
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <Card
          ref={chatRef}
          className="mb-2 flex flex-col shadow-lg w-[400px] sm:w-[500px] h-[550px] transition-all duration-200 ease-in-out border-2 animate-in slide-in-from-bottom-5"
        >
          <CardHeader className="p-3 border-b flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center space-x-2">
              {activeView === ChatView.PRIVATE && activeFriend ? (
                <>
                  <Button variant="ghost" size="icon" className="h-6 w-6 mr-1" onClick={handleBackToFriends}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div
                    className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 rounded-md p-1 transition-colors"
                    onClick={() => navigateToProfile(activeFriend.id)}
                    title={`View ${activeFriend.name || "Player"}'s profile`}
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={activeFriend.avatar || "/placeholder.svg"} alt={activeFriend.name || "Player"} />
                      <AvatarFallback className="font-pixel text-[10px]">
                        {(activeFriend.name || "Player").substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-pixel text-sm hover:underline">{activeFriend.name || "Player"}</span>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        activeFriend.status === UserStatus.ONLINE
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }`}
                    />
                  </div>
                </>
              ) : (
                <>
                  <MessageSquare className="h-5 w-5" />
                  <span className="font-pixel text-sm">
                    {activeView === ChatView.GENERAL ? dict?.chat?.generalChat : dict?.chat?.privateMessages}
                  </span>
                </>
              )}
            </div>
            {/* 5. Modify the CardHeader component to add the game invite button */}
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)} title="Fermer">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Navigation Bar */}
          <div className="border-b px-1 py-1 flex justify-center bg-muted/30">
            <div className="flex w-full gap-1">
              <Button
                variant={activeView === ChatView.GENERAL ? "secondary" : "ghost"}
                size="sm"
                className="h-8 px-2 flex-1"
                onClick={() => {
                  setActiveView(ChatView.GENERAL)
                  setActiveFriend(null)
                  // Request history when switching to general chat
                  if (generalSocket.current && generalSocket.current.readyState === WebSocket.OPEN) {
                    generalSocket.current.send(JSON.stringify({ type: "history" }))
                  }
                }}
              >
                <Home className="h-4 w-4 mr-1" />
                <span className="font-pixel text-xs">{dict?.chat?.global}</span>
              </Button>

              <Button
                variant={activeView === ChatView.FRIENDS ? "secondary" : "ghost"}
                size="sm"
                className="h-8 px-2 flex-1"
                onClick={() => {
                  setActiveView(ChatView.FRIENDS)
                  setActiveFriend(null)
                }}
              >
                <Users className="h-4 w-4 mr-1" />
                <span className="font-pixel text-xs">{dict?.chat?.friends}</span>
              </Button>
            </div>
          </div>

          {activeView === ChatView.FRIENDS ? (
            // Friends list view
            <CardContent className="flex-1 p-0 overflow-hidden">
              <div className="p-2">
                <div className="relative mb-2">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={dict?.chat?.searchFriends}
                    className="pl-8 font-pixel text-xs h-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <ScrollArea className="h-[280px]">
                  <div className="space-y-1">
                    {(filteredFriends.length === 0 && !searchQuery) ? (
                      <p className="text-center font-pixel text-xs text-muted-foreground py-4">{dict?.chat?.noFriends}</p>
                    ) : filteredFriends.length === 0 ? (
                      <p className="text-center font-pixel text-xs text-muted-foreground py-4">{dict?.chat?.noFriendsFound}</p>
                    ) : (
                      filteredFriends.map((friend) => (
                        <div key={friend.id}>
                          <button
                            className="w-full flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors text-left"
                            onClick={() => openPrivateChat(friend)}
                          >
                            <div className="relative">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.name || "Player"} />
                                <AvatarFallback className="font-pixel text-xs">
                                  {(friend.name || "Player").substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <span
                                className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border border-background ${
                                  friend.status === UserStatus.ONLINE
                                    ? "bg-green-500"
                                    : "bg-gray-500"
                                }`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center">
                                <p className="font-pixel text-xs truncate">{friend.name || "Player"}</p>
                              </div>
                            </div>
                          </button>
                          <Separator className="my-1" />
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          ) : (
            // Chat view (general or private)
            <>
              <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full p-3">
                  <div className="space-y-3">
                    {activeView === ChatView.GENERAL
                      ? generalMessages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex mb-2",
                            message.userId === userId ? "justify-end" : "justify-start",
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[80%] p-2 shadow-sm",
                              message.userId === userId
                                ? "bg-game-blue text-white border border-game-blue/30 rounded-tl-lg rounded-tr-lg rounded-bl-lg"
                                : "bg-muted border border-border/50 rounded-tl-lg rounded-tr-lg rounded-br-lg",
                            )}
                          >
                            {message.userId !== userId && (
                              <p
                                className="font-pixel text-[10px] font-bold cursor-pointer hover:underline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  navigateToProfile(message.userId)
                                }}
                              >
                                {message.name}
                              </p>
                            )}
                            <div className="font-pixel text-xs mt-0.5">{renderMessageContent(message.content)}</div>
                          </div>
                        </div>
                      ))
                      : activeFriend && friendsMessages[activeFriend.id]?.map((message) =>
                        (
                          <div
                            key={message.id}
                            className={cn(
                              "flex mb-2",
                              message.userId === userId ? "justify-end" : "justify-start",
                            )}
                          >
                            <div
                              className={cn(
                                "max-w-[80%] p-2 shadow-sm",
                                message.userId === userId
                                  ? "bg-game-blue text-white border border-game-blue/30 rounded-tl-lg rounded-tr-lg rounded-bl-lg"
                                  : "bg-muted border border-border/50 rounded-tl-lg rounded-tr-lg rounded-br-lg",
                              )}
                            >
                              {message.userId !== userId && (
                                <p
                                  className="font-pixel text-[10px] font-bold cursor-pointer hover:underline"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    navigateToProfile(message.userId)
                                  }}
                                >
                                  {message.name}
                                </p>
                              )}
                              <div className="font-pixel text-xs mt-0.5">{renderMessageContent(message.content)}</div>
                            </div>
                          </div>
                        ),
                      )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              <CardFooter className="p-2 border-t">
                <div className="flex items-center w-full space-x-2">
                  {activeView === ChatView.PRIVATE && activeFriend && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-game-blue hover:bg-blue-50 dark:hover:bg-blue-950/30 border-dashed"
                      onClick={() => setShowGameInviteModal(true)}
                      title={dict?.chat?.inviteToPlay}
                    >
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
                      >
                        <rect x="2" y="6" width="20" height="12" rx="2" />
                        <path d="M12 12h.01" />
                        <path d="M17 12h.01" />
                        <path d="M7 12h.01" />
                        <path d="M12 7v10" />
                      </svg>
                    </Button>
                  )}
                  <Input
                    ref={inputRef}
                    placeholder={dict?.chat?.writeMessage}
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
                    <span className="sr-only">{dict?.chat?.send}</span>
                  </Button>
                </div>
              </CardFooter>
            </>
          )}
        </Card>
      )}

      {/* Chat Button */}
      <Button
        className="bg-game-blue hover:bg-game-blue/90 shadow-lg border-2 relative"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        data-chat-button
      >
        <MessageSquare className="h-5 w-5" />
      </Button>

      {/* Game Invite Modal */}
      <Dialog open={showGameInviteModal} onOpenChange={setShowGameInviteModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-pixel text-sm">
              {dict?.chat?.inviteFriendToPlay?.replace('%friend%', activeFriend?.name || dict?.chat?.aFriend)}
            </DialogTitle>
            <DialogDescription className="font-pixel text-xs">
              {dict?.chat?.chooseGame}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 py-4">
            {availableGames.map((game) => (
              <button
                key={game.id}
                className={`p-3 rounded-md font-pixel text-xs flex flex-col items-center justify-center space-y-2 transition-colors border ${
                  selectedGame?.id === game.id
                    ? "bg-game-blue text-white border-game-blue"
                    : "hover:bg-muted border-border"
                }`}
                onClick={() => setSelectedGame(game)}
              >
                <span className="text-2xl">{game.icon}</span>
                <span>{game.name}</span>
              </button>
            ))}
          </div>

          <DialogFooter>
            <Button
              className="bg-game-blue hover:bg-game-blue/90 font-pixel text-xs"
              disabled={!selectedGame}
              onClick={handleSendGameInvite}
            >
              {dict?.chat?.sendInvitation}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
