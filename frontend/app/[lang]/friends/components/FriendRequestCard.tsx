"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useDictionary } from "@/hooks/UseDictionnary";
import { BaseUser } from "@/types/user";
import { Check, X } from "lucide-react";

interface FriendRequestCardProps {
	friend: BaseUser;
	acceptRequest: (id: string) => void;
	declineRequest: (id: string) => void;
}

export function FriendRequestCard({ friend, acceptRequest, declineRequest }: FriendRequestCardProps) {
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
				</div>
			</div>
			<div className="flex space-x-2">
				<Button
					variant="outline"
					size="icon"
					className="h-8 w-8 bg-green-500/20 text-green-500 hover:bg-green-500/30 hover:text-green-600"
					onClick={() => acceptRequest(friend.id)}
				>
					<Check className="h-4 w-4" />
				</Button>
				<Button
					variant="outline"
					size="icon"
					className="h-8 w-8 bg-red-500/20 text-red-500 hover:bg-red-500/30 hover:text-red-600"
					onClick={() => declineRequest(friend.id)}
				>
					<X className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
