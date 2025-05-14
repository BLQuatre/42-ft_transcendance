"use client"

import { useState } from "react"
import { MainNav } from "@/components/main-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, Check, X, MessageSquare, UserMinus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Footer } from "@/components/footer"

// Sample friends data
const friendsData = [
  {
    id: "f1",
    username: "GAMER42",
    status: "online",
    avatar: "/placeholder.svg?height=40&width=40",
    lastSeen: "Now",
  },
  {
    id: "f2",
    username: "PIXEL_MASTER",
    status: "offline",
    avatar: "/placeholder.svg?height=40&width=40",
    lastSeen: "2 hours ago",
  },
  {
    id: "f3",
    username: "RETRO_FAN",
    status: "online",
    avatar: "/placeholder.svg?height=40&width=40",
    lastSeen: "Now",
  },
  {
    id: "f4",
    username: "ARCADE_PRO",
    status: "away",
    avatar: "/placeholder.svg?height=40&width=40",
    lastSeen: "15 minutes ago",
  },
]

// Sample friend requests data
const friendRequestsData = [
  {
    id: "r1",
    username: "JUMP_MASTER",
    avatar: "/placeholder.svg?height=40&width=40",
    sentAt: "2 days ago",
  },
  {
    id: "r2",
    username: "DINO_KING",
    avatar: "/placeholder.svg?height=40&width=40",
    sentAt: "1 day ago",
  },
]

export default function FriendsPage() {
  const [friends, setFriends] = useState(friendsData)
  const [friendRequests, setFriendRequests] = useState(friendRequestsData)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const handleAcceptRequest = (id: string) => {
    const request = friendRequests.find((req) => req.id === id)
    if (request) {
      // Add to friends list
      setFriends([
        ...friends,
        {
          id: request.id,
          username: request.username,
          avatar: request.avatar,
          status: "online",
          lastSeen: "Now",
        },
      ])
      // Remove from requests
      setFriendRequests(friendRequests.filter((req) => req.id !== id))

      toast({
        title: "Friend Request Accepted",
        description: `You are now friends with ${request.username}`,
        duration: 3000,
      })
    }
  }

  const handleRejectRequest = (id: string) => {
    const request = friendRequests.find((req) => req.id === id)
    setFriendRequests(friendRequests.filter((req) => req.id !== id))

    toast({
      title: "Friend Request Rejected",
      description: `You rejected ${request?.username}'s friend request`,
      duration: 3000,
    })
  }

  const handleRemoveFriend = (id: string) => {
    const friend = friends.find((f) => f.id === id)
    if (friend) {
      setFriends(friends.filter((f) => f.id !== id))

      toast({
        title: "Friend Removed",
        description: `${friend.username} has been removed from your friends list`,
        duration: 3000,
      })
    }
  }

  const filteredFriends = friends.filter((friend) => friend.username.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNav />

      <div className="flex-1 container py-8 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="font-pixel text-2xl md:text-3xl mb-2">FRIENDS</h1>
          <p className="font-pixel text-xs text-muted-foreground">MANAGE YOUR FRIENDS AND CONNECTIONS</p>
        </div>

        <Tabs defaultValue="friends" className="space-y-4">
          <TabsList className="font-pixel text-xs w-full flex-nowrap">
            <TabsTrigger value="friends">MY FRIENDS</TabsTrigger>
            <TabsTrigger value="requests">
              FRIEND REQUESTS
              {friendRequests.length > 0 && (
                <Badge className="ml-2 bg-game-red text-white font-pixel text-[10px]">{friendRequests.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-pixel text-sm">MY FRIENDS</CardTitle>
                <CardDescription className="font-pixel text-xs">MANAGE YOUR FRIEND CONNECTIONS</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search friends..."
                    className="pl-8 font-pixel text-xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  {filteredFriends.length === 0 ? (
                    <p className="text-center font-pixel text-sm text-muted-foreground py-4">
                      No friends found. Try a different search.
                    </p>
                  ) : (
                    filteredFriends.map((friend) => (
                      <div key={friend.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar>
                              <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.username} />
                              <AvatarFallback className="font-pixel text-xs">
                                {friend.username.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span
                              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                                friend.status === "online"
                                  ? "bg-green-500"
                                  : friend.status === "away"
                                    ? "bg-yellow-500"
                                    : "bg-gray-500"
                              }`}
                            />
                          </div>
                          <div>
                            <p className="font-pixel text-sm">{friend.username}</p>
                            <p className="font-pixel text-xs text-muted-foreground">
                              {friend.status === "online" ? "Online" : `Last seen: ${friend.lastSeen}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              toast({
                                title: "Message Sent",
                                description: `Opening chat with ${friend.username}`,
                                duration: 3000,
                              })
                            }}
                          >
                            <MessageSquare className="h-4 w-4" />
                            <span className="sr-only">Message</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleRemoveFriend(friend.id)}
                          >
                            <UserMinus className="h-4 w-4" />
                            <span className="sr-only">Remove friend</span>
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-pixel text-sm">FRIEND REQUESTS</CardTitle>
                <CardDescription className="font-pixel text-xs">MANAGE INCOMING FRIEND REQUESTS</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {friendRequests.length === 0 ? (
                  <p className="text-center font-pixel text-sm text-muted-foreground py-4">
                    No pending friend requests.
                  </p>
                ) : (
                  friendRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={request.avatar || "/placeholder.svg"} alt={request.username} />
                          <AvatarFallback className="font-pixel text-xs">
                            {request.username.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-pixel text-sm">{request.username}</p>
                          <p className="font-pixel text-xs text-muted-foreground">Sent request {request.sentAt}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-green-500/20 text-green-500 hover:bg-green-500/30 hover:text-green-600"
                          onClick={() => handleAcceptRequest(request.id)}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Accept</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-red-500/20 text-red-500 hover:bg-red-500/30 hover:text-red-600"
                          onClick={() => handleRejectRequest(request.id)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Reject</span>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  )
}
