"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { ScrollArea } from "@/components/ui/ScrollArea"
import { Badge } from "@/components/ui/Badge"
import { MessageSquare, Send, X, ChevronLeft, Search, Users, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/Separator"

// Types
type Message = {
  id: string
  sender: string
  content: string
  timestamp: string
  isSystem?: boolean
}

type Friend = {
  id: string
  username: string
  avatar: string
  status: "online" | "offline" | "away"
  lastMessage?: string
  unread: number
}

// 1. Add new types for game invites after the existing Friend type
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

// Données de test
const initialMessages: Message[] = [
  {
    id: "m1",
    sender: "SYSTEM",
    content: "Bienvenue dans le chat! Discutez avec les autres joueurs.",
    timestamp: "12:00",
    isSystem: true,
  },
  {
    id: "m2",
    sender: "GAMER42",
    content: "Salut tout le monde! Qui veut jouer à Pong?",
    timestamp: "12:05",
  },
  {
    id: "m3",
    sender: "RETRO_FAN",
    content: "Je viens de battre mon record sur Dino Run!",
    timestamp: "12:10",
  },
]

const initialFriends: Friend[] = [
  {
    id: "f1",
    username: "GAMER42",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "Hey, on fait une partie?",
    unread: 2,
  },
  {
    id: "f2",
    username: "PIXEL_MASTER",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    lastMessage: "Bien joué pour hier!",
    unread: 0,
  },
  {
    id: "f3",
    username: "RETRO_FAN",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "Regarde mon nouveau score!",
    unread: 1,
  },
]

const initialPrivateMessages: Record<string, Message[]> = {
  f1: [
    {
      id: "pm1",
      sender: "GAMER42",
      content: "Hey, on fait une partie?",
      timestamp: "11:45",
    },
    {
      id: "pm2",
      sender: "PLAYER_ONE",
      content: "Dans 5 minutes!",
      timestamp: "11:47",
    },
    {
      id: "pm3",
      sender: "GAMER42",
      content: "Super, je prépare le jeu.",
      timestamp: "11:48",
    },
    {
      id: "pm4",
      sender: "GAMER42",
      content: "Prêt quand tu l'es!",
      timestamp: "11:55",
    },
  ],
  f3: [
    {
      id: "pm5",
      sender: "RETRO_FAN",
      content: "Regarde mon nouveau score!",
      timestamp: "10:30",
    },
    {
      id: "pm6",
      sender: "PLAYER_ONE",
      content: "Wow, impressionnant!",
      timestamp: "10:35",
    },
    {
      id: "pm7",
      sender: "RETRO_FAN",
      content: "Merci! J'ai passé toute la nuit dessus.",
      timestamp: "10:36",
    },
  ],
}

// 2. Add available games constant after the initialPrivateMessages
const availableGames: Game[] = [
  { id: "game1", name: "Pong", icon: "🏓" },
  { id: "game2", name: "Dino Run", icon: "🦖" },
]

export function SimpleChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeView, setActiveView] = useState<"general" | "friends" | "private">("general")
  const [activeFriend, setActiveFriend] = useState<Friend | null>(null)
  const [generalMessages, setGeneralMessages] = useState<Message[]>(initialMessages)
  const [friends, setFriends] = useState<Friend[]>(initialFriends)
  const [privateMessages, setPrivateMessages] = useState<Record<string, Message[]>>(initialPrivateMessages)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 3. Add new state variables in the SimpleChat component after the existing state variables
  const [showGameInviteModal, setShowGameInviteModal] = useState(false)
  const [gameInvites, setGameInvites] = useState<GameInvite[]>([])
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [isTyping, setIsTyping] = useState(false)

  // Calcul du nombre total de messages non lus
  const totalUnread = friends.reduce((sum, friend) => sum + friend.unread, 0)

  // Filtrer les amis en fonction de la recherche
  const filteredFriends = friends.filter((friend) => friend.username.toLowerCase().includes(searchQuery.toLowerCase()))

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [generalMessages, privateMessages, isOpen, activeView, activeFriend])

  // Focus input when chat opens or changes view
  useEffect(() => {
    if (isOpen && (activeView === "general" || activeView === "private")) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen, activeView, activeFriend])

  // Handle click outside to close chat
  useEffect(() => {
    const chatButton = document.querySelector("[data-chat-button]")

    function handleClickOutside(event: MouseEvent) {
      if (
        chatRef.current &&
        !chatRef.current.contains(event.target as Node) &&
        !chatButton?.contains(event.target as Node)
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

  // Réinitialiser les messages non lus lorsqu'on ouvre une conversation
  useEffect(() => {
    if (isOpen && activeView === "private" && activeFriend) {
      setFriends((prevFriends) =>
        prevFriends.map((friend) => (friend.id === activeFriend.id ? { ...friend, unread: 0 } : friend)),
      )
    }
  }, [isOpen, activeView, activeFriend])

  // Simuler la réception de messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% de chance de recevoir un message
        if (Math.random() > 0.5) {
          // Message général
          const newMsg = {
            id: `m${Date.now()}`,
            sender: Math.random() > 0.5 ? "GAMER42" : "RETRO_FAN",
            content:
              Math.random() > 0.5
                ? "Quelqu'un veut faire une partie de Pong?"
                : "Je viens de débloquer un nouveau skin!",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }
          setGeneralMessages((prev) => [...prev, newMsg])
        } else {
          // Message privé
          const randomFriendIndex = Math.floor(Math.random() * friends.length)
          const randomFriend = friends[randomFriendIndex]
          const newMsg = {
            id: `pm${Date.now()}`,
            sender: randomFriend.username,
            content: Math.random() > 0.5 ? `Hey, tu es disponible pour jouer?` : `J'ai atteint un nouveau niveau!`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }

          setPrivateMessages((prev) => ({
            ...prev,
            [randomFriend.id]: [...(prev[randomFriend.id] || []), newMsg],
          }))

          // Mettre à jour le dernier message et incrémenter les non lus si ce n'est pas la conversation active
          setFriends((prevFriends) =>
            prevFriends.map((friend) =>
              friend.id === randomFriend.id
                ? {
                    ...friend,
                    lastMessage: newMsg.content,
                    unread:
                      isOpen && activeView === "private" && activeFriend?.id === friend.id ? 0 : friend.unread + 1,
                  }
                : friend,
            ),
          )
        }
      }
    }, 30000) // Toutes les 30 secondes

    return () => clearInterval(interval)
  }, [isOpen, activeView, activeFriend, friends])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    if (activeView === "general") {
      // Envoyer un message dans le chat général
      const newMsg = {
        id: `m${Date.now()}`,
        sender: "PLAYER_ONE",
        content: newMessage,
        timestamp,
      }
      setGeneralMessages((prev) => [...prev, newMsg])
    } else if (activeView === "private" && activeFriend) {
      // Envoyer un message privé
      const newMsg = {
        id: `pm${Date.now()}`,
        sender: "PLAYER_ONE",
        content: newMessage,
        timestamp,
      }

      setPrivateMessages((prev) => ({
        ...prev,
        [activeFriend.id]: [...(prev[activeFriend.id] || []), newMsg],
      }))

      // Mettre à jour le dernier message
      setFriends((prevFriends) =>
        prevFriends.map((friend) =>
          friend.id === activeFriend.id
            ? {
                ...friend,
                lastMessage: newMessage,
              }
            : friend,
        ),
      )
    }

    setNewMessage("")
  }

  const openPrivateChat = (friend: Friend) => {
    setActiveFriend(friend)
    setActiveView("private")

    // Réinitialiser les messages non lus
    setFriends((prevFriends) => prevFriends.map((f) => (f.id === friend.id ? { ...f, unread: 0 } : f)))
  }

  const handleBackToFriends = () => {
    setActiveView("friends")
    setActiveFriend(null)
  }

  // 4. Add new functions before the return statement
  const handleSendGameInvite = () => {
    if (!activeFriend || !selectedGame) return

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    // Create new invite
    const newInvite: GameInvite = {
      id: `invite_${Date.now()}`,
      gameId: selectedGame.id,
      gameName: selectedGame.name,
      senderId: "PLAYER_ONE",
      receiverId: activeFriend.id,
      status: "pending",
      timestamp,
    }

    setGameInvites((prev) => [...prev, newInvite])

    // Add system message to private chat
    const inviteMsg: Message = {
      id: `pm${Date.now()}`,
      sender: "SYSTEM",
      content: `Vous avez invité ${activeFriend.username} à jouer à ${selectedGame.name}`,
      timestamp,
      isSystem: true,
    }

    setPrivateMessages((prev) => ({
      ...prev,
      [activeFriend.id]: [...(prev[activeFriend.id] || []), inviteMsg],
    }))

    // Close modal
    setShowGameInviteModal(false)
    setSelectedGame(null)

    // Simulate friend response after a delay
    setTimeout(
      () => {
        const isAccepted = Math.random() > 0.3 // 70% chance to accept

        // Update invite status
        setGameInvites((prev) =>
          prev.map((invite) =>
            invite.id === newInvite.id ? { ...invite, status: isAccepted ? "accepted" : "declined" } : invite,
          ),
        )

        // Add response message
        const responseMsg: Message = {
          id: `pm${Date.now()}`,
          sender: activeFriend.username,
          content: isAccepted
            ? `J'accepte ton invitation à jouer à ${selectedGame.name}! Allons-y!`
            : `Désolé, je ne peux pas jouer à ${selectedGame.name} maintenant.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }

        setPrivateMessages((prev) => ({
          ...prev,
          [activeFriend.id]: [...(prev[activeFriend.id] || []), responseMsg],
        }))

        // If accepted, add system message about game starting
        if (isAccepted) {
          setTimeout(() => {
            const gameStartMsg: Message = {
              id: `pm${Date.now()}`,
              sender: "SYSTEM",
              content: `Partie de ${selectedGame.name} démarrée avec ${activeFriend.username}`,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              isSystem: true,
            }

            setPrivateMessages((prev) => ({
              ...prev,
              [activeFriend.id]: [...(prev[activeFriend.id] || []), gameStartMsg],
            }))
          }, 1500)
        }
      },
      2000 + Math.random() * 2000,
    ) // Random delay between 2-4 seconds
  }

  useEffect(() => {
    if (activeView === "private" && activeFriend && newMessage.length > 0) {
      const typingTimeout = setTimeout(() => {
        setIsTyping(true)

        // Hide typing indicator after a random time
        setTimeout(
          () => {
            setIsTyping(false)
          },
          1000 + Math.random() * 2000,
        )
      }, 500)

      return () => clearTimeout(typingTimeout)
    }

    return () => {}
  }, [newMessage, activeView, activeFriend])

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <Card
          ref={chatRef}
          className="mb-2 flex flex-col shadow-lg w-[350px] sm:w-[400px] h-[450px] transition-all duration-200 ease-in-out border-2 animate-in slide-in-from-bottom-5"
        >
          <CardHeader className="p-3 border-b flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center space-x-2">
              {activeView === "private" && activeFriend ? (
                <>
                  <Button variant="ghost" size="icon" className="h-6 w-6 mr-1" onClick={handleBackToFriends}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={activeFriend.avatar || "/placeholder.svg"} alt={activeFriend.username} />
                    <AvatarFallback className="font-pixel text-[10px]">
                      {activeFriend.username.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-pixel text-sm">{activeFriend.username}</span>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      activeFriend.status === "online"
                        ? "bg-green-500"
                        : activeFriend.status === "away"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                    }`}
                  />
                </>
              ) : (
                <>
                  <MessageSquare className="h-5 w-5" />
                  <span className="font-pixel text-sm">
                    {activeView === "general" ? "GENERAL CHAT" : "PRIVATE MESSAGES"}
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
            <div className="flex space-x-2">
              <Button
                variant={activeView === "general" ? "secondary" : "ghost"}
                size="sm"
                className="h-8 px-2"
                onClick={() => {
                  setActiveView("general")
                  setActiveFriend(null)
                }}
              >
                <Home className="h-4 w-4 mr-1" />
                <span className="font-pixel text-xs">Global</span>
              </Button>

              <Button
                variant={activeView === "friends" ? "secondary" : "ghost"}
                size="sm"
                className="h-8 px-2"
                onClick={() => {
                  setActiveView("friends")
                  setActiveFriend(null)
                }}
              >
                <Users className="h-4 w-4 mr-1" />
                <span className="font-pixel text-xs">Friends</span>
                {totalUnread > 0 && (
                  <Badge className="bg-game-red text-white font-pixel text-[10px] h-4 min-w-4 flex items-center justify-center p-0">
                    {totalUnread}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {activeView === "friends" ? (
            // Vue liste d'amis
            <CardContent className="flex-1 p-0 overflow-hidden">
              <div className="p-2">
                <div className="relative mb-2">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un ami..."
                    className="pl-8 font-pixel text-xs h-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <ScrollArea className="h-[280px]">
                  <div className="space-y-1">
                    {filteredFriends.length === 0 ? (
                      <p className="text-center font-pixel text-xs text-muted-foreground py-4">Aucun ami trouvé</p>
                    ) : (
                      filteredFriends.map((friend) => (
                        <div key={friend.id}>
                          <button
                            className="w-full flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors text-left"
                            onClick={() => openPrivateChat(friend)}
                          >
                            <div className="relative">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.username} />
                                <AvatarFallback className="font-pixel text-xs">
                                  {friend.username.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <span
                                className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border border-background ${
                                  friend.status === "online"
                                    ? "bg-green-500"
                                    : friend.status === "away"
                                      ? "bg-yellow-500"
                                      : "bg-gray-500"
                                }`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center">
                                <p className="font-pixel text-xs truncate">{friend.username}</p>
                                {friend.unread > 0 && (
                                  <Badge className="bg-game-red text-white font-pixel text-[10px] h-4 min-w-4 flex items-center justify-center p-0">
                                    {friend.unread}
                                  </Badge>
                                )}
                              </div>
                              {friend.lastMessage && (
                                <p className="font-pixel text-[10px] text-muted-foreground truncate">
                                  {friend.lastMessage}
                                </p>
                              )}
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
            // Vue chat (général ou privé)
            <>
              <CardContent className="flex-1 p-0 overflow-hidden">
                {activeView === "general" && (
                  <div className="px-3 py-2 border-b">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher dans le chat..."
                        className="pl-8 font-pixel text-xs h-8"
                        onChange={(e) => {
                          // This would be implemented with actual search functionality
                          // For now it's just a UI element
                        }}
                      />
                    </div>
                  </div>
                )}
                <ScrollArea className="h-full p-3">
                  <div className="space-y-3">
                    {activeView === "general"
                      ? generalMessages.map((message) => (
                          <div key={message.id} className="flex items-start space-x-2">
                            {message.isSystem ? (
                              <div className="w-full text-center">
                                <p className="font-pixel text-[10px] text-muted-foreground bg-muted inline-block px-2 py-1 rounded-md border border-border">
                                  {message.content}
                                </p>
                              </div>
                            ) : (
                              <>
                                <Avatar className="h-6 w-6 shrink-0">
                                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt={message.sender} />
                                  <AvatarFallback className="font-pixel text-[10px]">
                                    {message.sender.substring(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2">
                                    <p
                                      className={cn(
                                        "font-pixel text-[10px] font-bold",
                                        message.sender === "PLAYER_ONE" ? "text-game-blue" : "",
                                      )}
                                    >
                                      {message.sender}
                                    </p>
                                    <p className="font-pixel text-[10px] text-muted-foreground">{message.timestamp}</p>
                                  </div>
                                  <p className="font-pixel text-xs mt-0.5 p-1.5 bg-muted/40 rounded-md border border-border/50">
                                    {message.content}
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        ))
                      : // 7. Modify the private chat message rendering to handle system messages
                        activeFriend &&
                        privateMessages[activeFriend.id]?.map((message) =>
                          message.isSystem ? (
                            <div key={message.id} className="w-full text-center my-2">
                              <p className="font-pixel text-[10px] text-muted-foreground bg-muted inline-block px-2 py-1 rounded-md border border-border">
                                {message.content}
                              </p>
                            </div>
                          ) : (
                            <div
                              key={message.id}
                              className={`flex ${message.sender === "PLAYER_ONE" ? "justify-end" : "justify-start"} mb-2`}
                            >
                              <div
                                className={`max-w-[80%] ${
                                  message.sender === "PLAYER_ONE"
                                    ? "bg-game-blue text-white border border-game-blue/30 rounded-tl-lg rounded-tr-lg rounded-bl-lg"
                                    : "bg-muted border border-border/50 rounded-tl-lg rounded-tr-lg rounded-br-lg"
                                } p-2 shadow-sm`}
                              >
                                <p className="font-pixel text-[10px] text-muted-foreground/70">{message.timestamp}</p>
                                <p className="font-pixel text-xs mt-0.5">{message.content}</p>
                              </div>
                            </div>
                          ),
                        )}
                    {activeView === "private" && activeFriend && isTyping && (
                      <div className="flex items-start space-x-2 mt-2">
                        <div className="flex items-center space-x-1 bg-muted/30 px-3 py-1 rounded-full">
                          <span
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></span>
                          <span
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></span>
                          <span
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              <CardFooter className="p-2 border-t">
                <div className="flex items-center w-full space-x-2">
                  {activeView === "private" && activeFriend && activeFriend.status === "online" && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-game-blue hover:bg-blue-50 dark:hover:bg-blue-950/30 border-dashed"
                      onClick={() => setShowGameInviteModal(true)}
                      title="Inviter à jouer"
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
                    placeholder="Écrivez votre message..."
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
                    <span className="sr-only">Envoyer</span>
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
        {totalUnread > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-game-red text-white font-pixel text-[10px] min-w-5 h-5 flex items-center justify-center p-0">
            {totalUnread}
          </Badge>
        )}
      </Button>
      {/* 6. Add the game invite modal at the end of the component, just before the final closing div tag */}
      {/* Game Invite Modal */}
      {showGameInviteModal && activeFriend && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-background border-2 rounded-lg shadow-lg p-4 max-w-[300px] w-full animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-pixel text-sm font-bold">Inviter {activeFriend.username} à jouer</h3>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowGameInviteModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
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

            <div className="flex justify-end">
              <Button
                className="bg-game-blue hover:bg-game-blue/90 font-pixel text-xs"
                disabled={!selectedGame}
                onClick={handleSendGameInvite}
              >
                Envoyer l'invitation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
