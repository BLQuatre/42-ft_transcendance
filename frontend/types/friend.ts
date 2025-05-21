export enum FriendRequestStatus {
	PENDING = 'pending',
	ACCEPTED = 'accepted',
	REFUSED = 'refused',
	BLOCKED = 'blocked'
}

export interface FriendRequest {
	sender_id: string
	receiver_id: string;
	status: FriendRequestStatus;
}
