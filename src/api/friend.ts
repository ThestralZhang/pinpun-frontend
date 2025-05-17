import { api } from '@/api/client.tsx';
import { pushErrorMessage, pushSuccessMessage } from '@/utils';
import type { AxiosResponse } from 'axios';
import type { User, FriendRequest } from '@/types';

interface FriendRequestBE {
  userId: number;
  username: string;
  avatarUrl: string | null;
  status: 'ACCEPTED' | 'REJECTED' | 'PENDING';
  requestedAt: string;
}

export async function getFriendList(): Promise<User[]> {
  return await api.get(`/friends`).then((rsp) => rsp.data);
}

export async function getSentFriendRequests(): Promise<FriendRequest[]> {
  const rsp: AxiosResponse<FriendRequestBE[]> = await api.get(`/friends/sent`);
  return rsp.data?.map(({ requestedAt, ...rest }) => ({
    requestedAt: new Date(requestedAt),
    ...rest,
  }));
}

export async function getReceivedFriendRequests(): Promise<FriendRequest[]> {
  const rsp: AxiosResponse<FriendRequestBE[]> = await api.get(`/friends/received`);
  return rsp.data?.map(({ requestedAt, ...rest }) => ({
    requestedAt: new Date(requestedAt),
    ...rest,
  }));
}

export async function sendFriendRequest(userId: number) {
  return await api
    .post(`/friends/invite/${userId}`)
    .then(() => {
      pushSuccessMessage('Friend request sent successfully!');
    })
    .catch((err: AxiosResponse) => {
      pushErrorMessage(
        err?.status === 409
          ? 'You already sent request to this user.'
          : 'Failed to send friend request',
      );
      throw err;
    });
}

export async function acceptFriendRequest(userId: number) {
  return await api
    .post(`/friends/accept/${userId}`)
    .then(() => {
      pushSuccessMessage('Request Accepted!');
    })
    .catch((err: AxiosResponse) => {
      pushErrorMessage('Failed to accept request');
      throw err;
    });
}

export async function rejectFriendRequest(userId: number) {
  return await api
    .put(`/friends/reject/${userId}`)
    .then(() => {
      pushSuccessMessage('Request Rejected!');
    })
    .catch((err: AxiosResponse) => {
      pushSuccessMessage('Failed to reject request');
      throw err;
    });
}

export async function removeFriend(userId: number) {
  console.log('remove', userId);
}
