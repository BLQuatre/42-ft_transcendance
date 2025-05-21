"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { RelationStatus } from "@/types/friend";
import { BaseUser } from "@/types/user";
import { User, UserCheck, UserPlus } from "lucide-react";

interface UserCardProps {
	user: BaseUser;
	sendRequest: (id: string) => void;
	relationStatus: RelationStatus
}

export function UserCard({ user, sendRequest, relationStatus }: UserCardProps) {
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
					<p className="font-pixel text-sm">{user.name}</p>
				</div>
			</div>
			{ relationStatus === RelationStatus.NONE ?
				<Button
					variant="outline"
					size="sm"
					className="h-8 font-pixel text-xs"
					onClick={() => sendRequest(user.id)}
				>
					<UserPlus className="h-4 w-4 mr-2" />{"Add friend"}
				</Button>
				: relationStatus === RelationStatus.FRIEND ?
				<Button
					variant="outline"
					size="sm"
					className="h-8 font-pixel text-xs"
					disabled
				>
					<User className="h-4 w-4 mr-2" />{"Friend"}
				</Button>
				:
				<Button
					variant="outline"
					size="sm"
					className="h-8 font-pixel text-xs"
					disabled
				>
					<UserCheck className="h-4 w-4 mr-2" />{"Pending"}
				</Button>
			}
		</div>
	);
}
