export interface FriendRequest {
  userId: number;
  username: string;
  avatarUrl: string | null;
  status: 'ACCEPTED' | 'REJECTED' | 'PENDING';
  requestedAt: Date;
}
