"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, X, ChevronLeft, Search, Users, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

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

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <Card
          ref={chatRef}
          className="mb-2 flex flex-col shadow-lg w-[400] h-[400px] transition-all duration-200 ease-in-out border-2"
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
                  <span className="font-pixel text-sm">{activeView === "general" ? "GENERAL CHAT" : "PRIVATE MESSAGES"}</span>
                </>
              )}
            </div>
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
                      : activeFriend &&
                        privateMessages[activeFriend.id]?.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender === "PLAYER_ONE" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] ${
                                message.sender === "PLAYER_ONE"
                                  ? "bg-game-blue text-white border border-game-blue/30"
                                  : "bg-muted border border-border/50"
                              } rounded-lg p-2 shadow-sm`}
                            >
                              <p className="font-pixel text-[10px] text-muted-foreground/70">{message.timestamp}</p>
                              <p className="font-pixel text-xs mt-0.5">{message.content}</p>
                            </div>
                          </div>
                        ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              <CardFooter className="p-2 border-t">
                <div className="flex items-center w-full space-x-2">
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
