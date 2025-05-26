"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { FriendRequestStatus } from "@/types/friend";
import { BaseUser } from "@/types/user";
import { User, UserCheck, UserLock, UserPlus, Clock } from "lucide-react";
import Link from "next/link";

interface UserCardProps {
	user: BaseUser;
	status: FriendRequestStatus;
	sendRequest: (id: string) => void;
	onBlock: (id: string) => void;
	onUnblock: (id: string) => void;
}

export function UserCard({
	user,
	status,
	sendRequest,
	onBlock,
	onUnblock,
}: UserCardProps) {
	const [isLoading, setIsLoading] = useState(false);

	const isBlocked = status === FriendRequestStatus.BLOCKED;
	const isRefused = status === FriendRequestStatus.REFUSED;
	const isPending = status === FriendRequestStatus.PENDING;

	const handleSendRequest = async () => {
		setIsLoading(true);
		try {
			await sendRequest(user.id);
		} finally {
			// Keep loading state for a bit to show the icon change
			setTimeout(() => setIsLoading(false), 1000);
		}
	};

	return (
		<div className="flex items-center justify-between p-3 bg-muted rounded-lg">
			<div className="flex items-center space-x-3">
				<Avatar>
					<AvatarImage src={user.avatar} alt={user.name} />
					<AvatarFallback className="font-pixel text-xs">
						{user.name.substring(0, 2).toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<div>
					<Link href={`/profile/${user.id}`} className="hover:underline">
						<p className="font-pixel text-sm cursor-pointer hover:text-game-blue transition-colors">
							{user.name}
						</p>
					</Link>
				</div>
			</div>

			<div className="flex space-x-2">
				{isBlocked ? (
					<Button
						variant="outline"
						size="sm"
						className="h-8 w-8 text-green-500"
						onClick={() => onUnblock(user.id)}
					>
						<UserLock className="h-4 w-4" />
					</Button>
				) : (
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8 text-destructive"
						onClick={() => onBlock(user.id)}
					>
						<UserLock className="h-4 w-4" />
					</Button>
				)}

				{isRefused ? (
					<Button
						variant="outline"
						size="sm"
						className="h-8 w-8 font-pixel text-xs"
						onClick={handleSendRequest}
						disabled={isLoading}
					>
						{isLoading ? (
							<Clock className="h-4 w-4 animate-spin" />
						) : (
							<UserPlus className="h-4 w-4" />
						)}
					</Button>
				) : (
					<Button
						variant="outline"
						size="sm"
						className="h-8 w-8 font-pixel text-xs"
						disabled
					>
						{isPending ? (
							<UserCheck className="h-4 w-4" />
						) : (
							<User className="h-4 w-4" />
						)}
					</Button>
				)}
			</div>
		</div>
	);
}
