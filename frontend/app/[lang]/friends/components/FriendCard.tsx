"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useDictionary } from "@/hooks/UseDictionnary";
import { BaseUser, UserStatus } from "@/types/user";
import { UserLock, UserMinus } from "lucide-react";

interface FriendCardProps {
	friend: BaseUser;
	onRemove: (id: string) => void;
	onBlock: (id: string) => void;
}

export function FriendCard({ friend, onRemove, onBlock }: FriendCardProps) {
	const dict = useDictionary()
	if (!dict) return null

	return (
		<div className="flex items-center justify-between p-3 bg-muted rounded-lg">
			<div className="flex items-center space-x-3">
				<div className="relative">
					<Avatar className="border">
						<AvatarImage src={friend.avatar} alt={friend.name} />
						<AvatarFallback className="font-pixel text-xs">
							{friend.name.substring(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
				</div>
				<div>
					<p className="font-pixel text-sm">{friend.name}</p>
					<p className="font-pixel text-xs text-muted-foreground">
						{friend.status === UserStatus.ONLINE ? dict.userStatus.online : dict.userStatus.offline}
					</p>
				</div>
			</div>
			<div className="flex space-x-2">
				<Button
					variant="outline"
					size="icon"
					className="h-8 w-8 text-destructive"
					onClick={() => onBlock(friend.id)}
				>
					<UserLock className="h-4 w-4" />
				</Button>
				{/* TODO: Add chat functionality */}
				{/* <Button
					variant="outline"
					size="icon"
					className="h-8 w-8"
					onClick={() => {
						toast({
							title: "Message Sent",
							description: `Opening chat with ${friend.name}`,
							duration: 3000,
						});
					}}
				>
					<MessageSquare className="h-4 w-4" />
				</Button> */}
				<Button
					variant="outline"
					size="icon"
					className="h-8 w-8 text-destructive"
					onClick={() => onRemove(friend.id)}
				>
					<UserMinus className="h-4 w-4" />
				</Button>

			</div>
		</div>
	);
}
