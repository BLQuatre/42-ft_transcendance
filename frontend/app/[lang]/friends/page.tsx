"use client"

import { useEffect, useState } from "react"
import { MainNav } from "@/components/Navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Avatar, AvatarFallback } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { Search, UserPlus, Check, X, MessageSquare, UserMinus } from "lucide-react"
import { useToast } from "@/hooks/UseToast"
import { useDictionary } from "@/hooks/UseDictionnary"
import { BaseUser, FriendRequest } from "@/types/types"

import api from "@/lib/api"
// TODO: Add online status to friends and avatar

export default function FriendsPage() {
  const [users, setUsers] = useState<BaseUser[]>([])
  const [friends, setFriends] = useState<FriendRequest[]>([])
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [addFriendSearchQuery, setAddFriendSearchQuery] = useState("")
  const { toast } = useToast()

  const updateData = () => {
    api.get("/user").then((response) => setUsers(response.data.Users))
    api.get("/friend").then((response) => setFriends(response.data.friends))
    api.get("/friend/pending/receive").then((response) => setFriendRequests(response.data.friends))
  }

  useEffect(() => {
    updateData()
  }, [])

  console.log(`Users: ${JSON.stringify(users, null, 2)}`)
  console.log(`Friends: ${JSON.stringify(friends, null, 2)}`)
  console.log(`Friend requests: ${JSON.stringify(friendRequests, null, 2)}`)


  const handleAcceptRequest = (id: string) => {
    api.put(`/friend/${id}`, { status: "accepted" }).then(() => {
      updateData()
      toast({
        title: "Friend Request Accepted",
        description: `You are now friends with ${id}`,
        duration: 3000,
      })
    })
  }

  const handleRejectRequest = (id: string) => {
    api.put(`/friend/${id}`, { status: "refused" }).then(() => {
      updateData()
      toast({
        title: "Friend Request Rejected",
        description: `You have rejected the friend request from ${id}`,
        duration: 3000,
      })
    })
  }

  const handleRemoveFriend = (id: string) => {
    api.delete(`/friend/${id}`).then(() => {
      updateData()
      toast({
        title: "Friend Removed",
        description: `You have removed ${id} as a friend`,
        duration: 3000,
      })
    })
  }

  const handleSendFriendRequest = (id: string) => {
    api.post(`/friend/${id}`).then(() => {
      updateData()
      toast({
        title: "Friend Request Sent",
        description: `Friend request sent to ${id}`,
        duration: 3000,
      })
    })
  }

  const getUserFromId = (id: string) => {
    return users.find((user) => user.id === id)
  }

  const userId = sessionStorage.getItem("userId")

  const filteredFriends = friends.filter((friend) => (getUserFromId(friend.sender_id)?.name || "Unknown").toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredUsers =
    addFriendSearchQuery.trim() === ""
      ? []
      : users.filter((user) => user.name.toLowerCase().includes(addFriendSearchQuery.toLowerCase())
        && user.id !== userId && !friends.some((friend) => friend.sender_id === user.id))

  const dict = useDictionary()
  if (!dict) return null

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNav />

      <div className="flex-1 container py-8 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="font-pixel text-2xl md:text-3xl mb-2 uppercase">{dict.friends.title}</h1>
          <p className="font-pixel text-xs text-muted-foreground uppercase">{dict.friends.description}</p>
        </div>

        <Tabs defaultValue="friends" className="space-y-4">
          <TabsList className="font-pixel text-xs w-full flex-nowrap">
            <TabsTrigger className="uppercase" value="friends">
              {dict.friends.sections.myFriends.title}
            </TabsTrigger>
            <TabsTrigger className="uppercase" value="requests">
              {dict.friends.sections.requests.title}
              {friendRequests.length > 0 && (
                <Badge className="ml-2 bg-game-red text-white font-pixel text-[10px]">{friendRequests.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger className="uppercase" value="add">
              {dict.friends.sections.add?.title || "Add Friends"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-pixel text-sm uppercase">{dict.friends.sections.myFriends.title}</CardTitle>
                <CardDescription className="font-pixel text-xs uppercase">
                  {dict.friends.sections.myFriends.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={dict.friends.sections.myFriends.search}
                    className="pl-8 font-pixel text-xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  {filteredFriends.length === 0 ? (
                    <p className="text-center font-pixel text-sm text-muted-foreground py-4">
                      {friends.length === 0
                        ? dict.friends.sections.myFriends.noFriends
                        : dict.friends.sections.myFriends.noFriendsFound}
                    </p>
                  ) : (
                    filteredFriends.map((friend) => (
                      <div key={friend.sender_id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar>
                              {/* <AvatarImage src={getUserFromId(friend.sender_id)?.avatar || "/placeholder.svg"} alt={friend.name} /> */}
                              <AvatarFallback className="font-pixel text-xs">
                                P1
                              </AvatarFallback>
                            </Avatar>
                            {/* <span
                              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                                friend.status === "online" ? "bg-green-500" : "bg-gray-500"
                              }`}
                            /> */}
                          </div>
                          <div>
                            <p className="font-pixel text-sm">{getUserFromId(friend.sender_id)?.name}</p>
                            {/* <p className="font-pixel text-xs text-muted-foreground">
                              {friend.status === "online" ? dict.userStatus.online : dict.userStatus.offline}
                            </p> */}
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
                                description: `Opening chat with ${getUserFromId(friend.sender_id)?.name}`,
                                duration: 3000,
                              })
                            }}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleRemoveFriend(friend.sender_id)}
                          >
                            <UserMinus className="h-4 w-4" />
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
                <CardTitle className="font-pixel text-sm uppercase">{dict.friends.sections.requests.title}</CardTitle>
                <CardDescription className="font-pixel text-xs uppercase">
                  {dict.friends.sections.requests.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {friendRequests.length === 0 ? (
                  <p className="text-center font-pixel text-sm text-muted-foreground py-4">
                    {dict.friends.sections.requests.noRequests}
                  </p>
                ) : (
                  friendRequests.map((request) => (
                    <div key={request.sender_id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          {/* <AvatarImage src={request.avatar || "/placeholder.svg"} alt={request.name} /> */}
                          <AvatarFallback className="font-pixel text-xs">
                            P1
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-pixel text-sm">{getUserFromId(request.sender_id)?.name}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-green-500/20 text-green-500 hover:bg-green-500/30 hover:text-green-600"
                          onClick={() => handleAcceptRequest(request.sender_id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-red-500/20 text-red-500 hover:bg-red-500/30 hover:text-red-600"
                          onClick={() => handleRejectRequest(request.sender_id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="add" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-pixel text-sm uppercase">
                  {dict.friends.sections.add?.title || "Add Friends"}
                </CardTitle>
                <CardDescription className="font-pixel text-xs uppercase">
                  {dict.friends.sections.add?.description || "Find and add new friends to your network"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={dict.friends.sections.add?.search || "Search for users..."}
                    className="pl-8 font-pixel text-xs"
                    value={addFriendSearchQuery}
                    onChange={(e) => setAddFriendSearchQuery(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  {filteredUsers.length === 0 ? (
                    <p className="text-center font-pixel text-sm text-muted-foreground py-4">
                      {addFriendSearchQuery.trim() === ""
                        ? dict.friends.sections.add?.searchPrompt || "Search for users to add as friends"
                        : dict.friends.sections.add?.noUsersFound || "No users found with that username"}
                    </p>
                  ) : (
                    filteredUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            {/* <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} /> */}
                            <AvatarFallback className="font-pixel text-xs">
                              {user.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-pixel text-sm">{user.name}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 font-pixel text-xs"
                          onClick={() => handleSendFriendRequest(user.id)}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          {dict.friends.sections.add?.addButton || "Add Friend"}
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
