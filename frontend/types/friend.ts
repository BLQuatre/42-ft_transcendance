export enum FriendRequestStatus {
	PENDING = 'pending',
	ACCEPTED = 'accepted',
	REFUSED = 'refused'
}

export interface FriendRequest {
	sender_id: string
	receiver_id: string;
	status: FriendRequestStatus;
}

export enum RelationStatus {
	PENDING = 'pending',
	FRIEND = 'friend',
	NONE = 'none'
}
