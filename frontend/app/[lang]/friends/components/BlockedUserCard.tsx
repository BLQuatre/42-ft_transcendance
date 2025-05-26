"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { BaseUser } from "@/types/user";
import { UserLock } from "lucide-react";
import Link from "next/link";

interface BlockedUserCardProps {
	user: BaseUser;
	onUnblock: (id: string) => void;
}

export function BlockedUserCard({ user, onUnblock }: BlockedUserCardProps) {
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
				<Button
					variant="outline"
					size="sm"
					className="h-8 w-8 text-green-500"
					onClick={() => onUnblock(user.id)}
				>
					<UserLock className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
