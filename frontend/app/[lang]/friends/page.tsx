"use client"

import { useEffect, useState } from "react"
import { MainNav } from "@/components/Navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { Search } from "lucide-react"
import { useToast } from "@/hooks/UseToast"
import { useDictionary } from "@/hooks/UseDictionnary"
import { BaseUser } from "@/types/user"
import { FriendRequest, FriendRequestStatus } from "@/types/friend"
import api from "@/lib/api"
import { UserCard } from "./components/UserCard"
import { FriendRequestCard } from "./components/FriendRequestCard"
import { FriendCard } from "./components/FriendCard"
import { BlockedUserCard } from "./components/BlockedUserCard"


// TODO: Add online status to friends and avatar

export default function FriendsPage() {
  const [users, setUsers] = useState<BaseUser[]>([])
  const [friends, setFriends] = useState<FriendRequest[]>([])
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const [blockedUsers, setBlockedUsers] = useState<FriendRequest[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [addFriendSearchQuery, setAddFriendSearchQuery] = useState("")
  const { toast } = useToast()

  const updateData = () => {
    api.get("/user").then((response) => setUsers(response.data.Users))
    api.get("/friend").then((response) => setFriends(response.data.friends))
    api.get("/friend/pending").then((response) => setFriendRequests(response.data.friends))
    api.get("/friend/blocked").then((response) => setBlockedUsers(response.data.friends))
  }

  useEffect(() => {
    updateData()
  }, [])

  console.log(`Users: ${JSON.stringify(users, null, 2)}`)
  console.log(`Friends: ${JSON.stringify(friends, null, 2)}`)
  console.log(`Friend requests: ${JSON.stringify(friendRequests, null, 2)}`)
  console.log(`Blocked users: ${JSON.stringify(blockedUsers, null, 2)}`)

  const handleAcceptRequest = (id: string) => {
    api.put(`/friend/${id}`, { status: "accepted" }).then(() => {
      updateData()

      const user = getUserFromId(id)
      toast({
        title: "Friend Request Accepted",
        description: `You are now friends with ${user?.name || id}`,
        duration: 3000,
      })
    })
  }

  const handleDeclineRequest = (id: string) => {
    api.put(`/friend/${id}`, { status: "refused" }).then(() => {
      updateData()

      const user = getUserFromId(id)
      toast({
        title: "Friend Request Rejected",
        description: `You have rejected the friend request from ${user?.name || id}`,
        duration: 3000,
      })
    })
  }

  const handleRemoveFriend = (id: string) => {
    api.delete(`/friend/${id}`).then(() => {
      updateData()

      const user = getUserFromId(id)
      toast({
        title: "Friend Removed",
        description: `You have removed ${user?.name || id} as a friend`,
        duration: 3000,
      })
    })
  }

  const handleSendFriendRequest = (id: string) => {
    api.post(`/friend/${id}`).then(() => {
      updateData()

      const user = getUserFromId(id)
      toast({
        title: "Friend Request Sent",
        description: `Friend request sent to ${user?.name || id}`,
        duration: 3000,
      })
    }).catch((error) => {
      const user = getUserFromId(id)
      if (error.response.status === 409) {
        toast({
          title: "Friend Request Already Sent",
          description: `You have already sent a friend request to ${user?.name || id}`,
          duration: 3000,
        })
      } else if (error.response.status === 400) {
        toast({
          title: "Error",
          description: `Cannot send friend request to ${user?.name || id}`,
          duration: 3000,
        })
      }
    })
  }

  const handleBlockUser = (id: string) => {
    api.post(`/friend/blocked/${id}`).then(() => {
      updateData()

      const user = getUserFromId(id)
      toast({
        title: "User Blocked",
        description: `You have blocked ${user?.name || id}`,
        duration: 3000,
      })
    })
  }

  const handleUnblockUser = (id: string) => {
    api.delete(`/friend/${id}`).then(() => {
      updateData()

      const user = getUserFromId(id)
      toast({
        title: "User Unblocked",
        description: `You have unblocked ${user?.name || id}`,
        duration: 3000,
      })
    })
  }

  const getUserFromId = (id: string) => {
    return users.find((user) => user.id === id)
  }

  const userId = localStorage.getItem("userId")

  const getStatus = (user: BaseUser) => {
    const blocked = blockedUsers.find((blocked) => blocked.receiver_id === user.id)
    if (blocked)
      return FriendRequestStatus.BLOCKED
    const friend = friends.find((friend) => friend.sender_id === user.id || friend.receiver_id === user.id)
    if (friend)
      return FriendRequestStatus.ACCEPTED
    const pending = friendRequests.find((friend) => friend.sender_id === user.id || friend.receiver_id === user.id)
    if (pending) {
      return FriendRequestStatus.PENDING
    }
    return FriendRequestStatus.REFUSED
  }

  const filteredFriends =
    searchQuery.trim() === ""
      ? friends
      : friends.filter((friend) =>
        (getUserFromId(friend.sender_id)?.name || "Unknown").toLowerCase().includes(searchQuery.toLowerCase())
      )

  const filteredAddUsers =
    addFriendSearchQuery.trim() === ""
      ? []
      : users.filter((user) => user.name.toLowerCase().includes(addFriendSearchQuery.toLowerCase())
          && user.id !== userId && !friends.some((friend) => friend.sender_id === user.id || friend.receiver_id === user.id)
        )

  const receivedPendingRequests =
    friendRequests.filter((request) => request.receiver_id === userId)

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
              {receivedPendingRequests.length > 0 && (
                <Badge className="ml-2 bg-game-red text-white font-pixel text-[10px]">{friendRequests.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger className="uppercase" value="add">
              {"Add Friends"}
            </TabsTrigger>
            <TabsTrigger className="uppercase" value="block">
              {"Blocked Users"}
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
                    filteredFriends.map((request) => {
                      const friend = getUserFromId(request.sender_id == userId ? request.receiver_id : request.sender_id)
                      if (!friend) return null

                      return (<FriendCard
                        key={friend.id}
                        friend={friend}
                        onRemove={(id) => handleRemoveFriend(id)}
                        onBlock={(id) => handleBlockUser(id)}
                      />)
                    })
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
                {receivedPendingRequests.length === 0 ? (
                  <p className="text-center font-pixel text-sm text-muted-foreground py-4">
                    {dict.friends.sections.requests.noRequests}
                  </p>
                ) : (
                  receivedPendingRequests.map((request) => {
                    const friend = getUserFromId(request.sender_id)
                    if (!friend) return null

                    return (
                      <FriendRequestCard
                        key={friend.id}
                        friend={friend}
                        acceptRequest={(id) => handleAcceptRequest(id)}
                        declineRequest={(id) => handleDeclineRequest(id)}
                      />
                    )
                  })
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
                  {filteredAddUsers.length === 0 ? (
                    <p className="text-center font-pixel text-sm text-muted-foreground py-4">
                      {addFriendSearchQuery.trim() === ""
                        ? dict.friends.sections.add?.searchPrompt || "Search for users to add as friends"
                        : dict.friends.sections.add?.noUsersFound || "No users found with that username"}
                    </p>
                  ) : (
                    filteredAddUsers.map((user) => {
                      return (
                        <UserCard
                          key={user.id}
                          user={user}
                          status={getStatus(user)}
                          sendRequest={(id) => handleSendFriendRequest(id)}
                          onBlock={(id) => handleBlockUser(id)}
                          onUnblock={(id) => handleUnblockUser(id)}
                        />
                      )
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="block" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-pixel text-sm uppercase">
                  {"Blocked Users"}
                </CardTitle>
                <CardDescription className="font-pixel text-xs uppercase">
                  {"See all users you blocked"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {blockedUsers.length === 0 ? (
                    <p className="text-center font-pixel text-sm text-muted-foreground py-4">
                      You have no blocked users
                    </p>
                  ) : (
                    blockedUsers.map((blocked) => {
                      const user = getUserFromId(blocked.receiver_id)
                      if (!user) return null

                      return (
                        <BlockedUserCard
                          key={user.id}
                          user={user}
                          onUnblock={(id) => handleUnblockUser(id)}
                        />
                      )
                    })
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
