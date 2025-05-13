"use client"

import { useState, useRef, useEffect } from "react"
import { MainNav } from "@/components/main-nav"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Search, Send, Smile, Paperclip } from "lucide-react"

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
  {
    id: "g4",
    username: "PIXEL_MASTER",
    avatar: "/placeholder.svg?height=40&width=40",
    message: "Congrats! What was your score?",
    timestamp: "12:12 PM",
  },
  {
    id: "g5",
    username: "RETRO_FAN",
    avatar: "/placeholder.svg?height=40&width=40",
    message: "1,024 points! It took me hours of practice.",
    timestamp: "12:15 PM",
  },
  {
    id: "g6",
    username: "ARCADE_PRO",
    avatar: "/placeholder.svg?height=40&width=40",
    message: "That's impressive! My best is only 876.",
    timestamp: "12:18 PM",
  },
  {
    id: "g7",
    username: "PLAYER_ONE",
    avatar: "/placeholder.svg?height=40&width=40",
    message: "Has anyone tried the new Space Void map for Pong?",
    timestamp: "12:20 PM",
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
    {
      id: "p3",
      sender: "GAMER42",
      receiver: "PLAYER_ONE",
      message: "Great! I'll set up a game.",
      timestamp: "11:48 AM",
      isMine: false,
    },
    {
      id: "p4",
      sender: "GAMER42",
      receiver: "PLAYER_ONE",
      message: "Ready when you are!",
      timestamp: "11:55 AM",
      isMine: false,
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
    {
      id: "p7",
      sender: "RETRO_FAN",
      receiver: "PLAYER_ONE",
      message: "Thanks! Took me all night.",
      timestamp: "10:36 AM",
      isMine: false,
    },
  ],
  f2: [
    {
      id: "p8",
      sender: "PLAYER_ONE",
      receiver: "PIXEL_MASTER",
      message: "That was a great game yesterday!",
      timestamp: "9:15 AM",
      isMine: true,
    },
    {
      id: "p9",
      sender: "PIXEL_MASTER",
      receiver: "PLAYER_ONE",
      message: "Yeah, you're getting better!",
      timestamp: "9:20 AM",
      isMine: false,
    },
    {
      id: "p10",
      sender: "PLAYER_ONE",
      receiver: "PIXEL_MASTER",
      message: "Thanks! Want to play again tonight?",
      timestamp: "9:22 AM",
      isMine: true,
    },
    {
      id: "p11",
      sender: "PIXEL_MASTER",
      receiver: "PLAYER_ONE",
      message: "That was a great game!",
      timestamp: "9:25 AM",
      isMine: false,
    },
  ],
}

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [friends, setFriends] = useState(friendsData)
  const [generalChat, setGeneralChat] = useState(generalChatData)
  const [privateChats, setPrivateChats] = useState(privateChatData)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Filter friends based on search query
  const filteredFriends = friends.filter((friend) => friend.username.toLowerCase().includes(searchQuery.toLowerCase()))

  // Scroll to bottom of messages when they change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [generalChat, privateChats, activeChat])

  const handleSendMessage = () => {
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

      setPrivateChats({
        ...privateChats,
        [activeChat]: [...(privateChats[activeChat as keyof typeof privateChats] || []), newPrivateMessage],
      })

      // Clear unread messages for this chat
      setFriends(friends.map((friend) => (friend.id === activeChat ? { ...friend, unread: 0 } : friend)))
    } else {
      // Send message to general chat
      const newGeneralMessage = {
        id: `g${Date.now()}`,
        username: "PLAYER_ONE",
        avatar: "/placeholder.svg?height=40&width=40",
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setGeneralChat([...generalChat, newGeneralMessage])
    }

    setNewMessage("")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNav />

      <div className="flex-1 container py-8 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="font-pixel text-2xl md:text-3xl mb-2">CHAT</h1>
          <p className="font-pixel text-xs text-muted-foreground">CHAT WITH FRIENDS AND OTHER PLAYERS</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4 h-[calc(100vh-250px)]">
          {/* Sidebar */}
          <div className="flex flex-col h-full">
            <Card className="flex-1 flex flex-col">
              <CardHeader className="p-4">
                <CardTitle className="font-pixel text-sm">CONVERSATIONS</CardTitle>
                <div className="relative mt-2">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search friends..."
                    className="pl-8 font-pixel text-xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-hidden">
                <Tabs defaultValue="private" className="h-full flex flex-col">
                  <TabsList className="font-pixel text-xs px-4">
                    <TabsTrigger value="private" className="flex-1">
                      PRIVATE
                    </TabsTrigger>
                    <TabsTrigger value="general" className="flex-1">
                      GENERAL
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="private" className="flex-1 p-0 overflow-hidden">
                    <ScrollArea className="h-full">
                      <div className="px-4 py-2">
                        {filteredFriends.length === 0 ? (
                          <p className="text-center font-pixel text-xs text-muted-foreground py-4">
                            No conversations found
                          </p>
                        ) : (
                          filteredFriends.map((friend) => (
                            <div key={friend.id}>
                              <button
                                className={`w-full flex items-center space-x-3 p-2 rounded-md hover:bg-muted transition-colors ${
                                  activeChat === friend.id ? "bg-muted" : ""
                                }`}
                                onClick={() => setActiveChat(friend.id)}
                              >
                                <div className="relative">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.username} />
                                    <AvatarFallback className="font-pixel text-xs">
                                      {friend.username.substring(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span
                                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                                      friend.status === "online" ? "bg-green-500" : "bg-gray-500"
                                    }`}
                                  />
                                </div>
                                <div className="flex-1 text-left">
                                  <div className="flex justify-between items-center">
                                    <p className="font-pixel text-sm truncate">{friend.username}</p>
                                    {friend.unread > 0 && (
                                      <span className="bg-game-red text-white font-pixel text-[10px] px-2 py-0.5 rounded-full">
                                        {friend.unread}
                                      </span>
                                    )}
                                  </div>
                                  <p className="font-pixel text-xs text-muted-foreground truncate">
                                    {friend.lastMessage}
                                  </p>
                                </div>
                              </button>
                              <Separator className="my-2" />
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="general" className="flex-1 p-0 overflow-hidden">
                    <div
                      className="p-4 flex items-center space-x-3 bg-muted/50 cursor-pointer"
                      onClick={() => setActiveChat(null)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="General Chat" />
                        <AvatarFallback className="font-pixel text-xs">GC</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-pixel text-sm">GENERAL CHAT</p>
                        <p className="font-pixel text-xs text-muted-foreground">{generalChat.length} messages</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <Card className="flex flex-col h-full">
            <CardHeader className="p-4 border-b">
              <div className="flex items-center space-x-3">
                {activeChat ? (
                  <>
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={friends.find((f) => f.id === activeChat)?.avatar || ""}
                        alt={friends.find((f) => f.id === activeChat)?.username || ""}
                      />
                      <AvatarFallback className="font-pixel text-xs">
                        {(friends.find((f) => f.id === activeChat)?.username || "").substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="font-pixel text-sm">
                        {friends.find((f) => f.id === activeChat)?.username || ""}
                      </CardTitle>
                      <CardDescription className="font-pixel text-xs">
                        {friends.find((f) => f.id === activeChat)?.status === "online" ? "Online" : "Offline"}
                      </CardDescription>
                    </div>
                  </>
                ) : (
                  <>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="General Chat" />
                      <AvatarFallback className="font-pixel text-xs">GC</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="font-pixel text-sm">GENERAL CHAT</CardTitle>
                      <CardDescription className="font-pixel text-xs">Public chat room for all players</CardDescription>
                    </div>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  {activeChat
                    ? // Private chat messages
                      (privateChats[activeChat as keyof typeof privateChats] || []).map((message) => (
                        <div key={message.id} className={`flex ${message.isMine ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[80%] ${
                              message.isMine ? "bg-game-blue text-white" : "bg-muted"
                            } rounded-lg p-3`}
                          >
                            <div className="flex items-center space-x-2">
                              {!message.isMine && <p className="font-pixel text-xs font-bold">{message.sender}</p>}
                              <p className="font-pixel text-xs text-muted-foreground/70">{message.timestamp}</p>
                            </div>
                            <p className="font-pixel text-sm mt-1">{message.message}</p>
                          </div>
                        </div>
                      ))
                    : // General chat messages
                      generalChat.map((message) => (
                        <div key={message.id} className="flex items-start space-x-3">
                          {message.isSystem ? (
                            <div className="w-full text-center">
                              <p className="font-pixel text-xs text-muted-foreground bg-muted inline-block px-3 py-1 rounded-md">
                                {message.message}
                              </p>
                            </div>
                          ) : (
                            <>
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.username} />
                                <AvatarFallback className="font-pixel text-xs">
                                  {message.username.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <p className="font-pixel text-xs font-bold">{message.username}</p>
                                  <p className="font-pixel text-xs text-muted-foreground">{message.timestamp}</p>
                                </div>
                                <p className="font-pixel text-sm mt-1">{message.message}</p>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t">
              <div className="flex items-center w-full space-x-2">
                <Button variant="outline" size="icon" className="shrink-0">
                  <Paperclip className="h-4 w-4" />
                  <span className="sr-only">Attach file</span>
                </Button>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Smile className="h-4 w-4" />
                  <span className="sr-only">Emoji</span>
                </Button>
                <Input
                  placeholder="Type your message..."
                  className="flex-1 font-pixel text-sm"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage()
                    }
                  }}
                />
                <Button
                  className="shrink-0 bg-game-blue hover:bg-game-blue/90"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4 mr-2" />
                  <span className="font-pixel text-xs">SEND</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
