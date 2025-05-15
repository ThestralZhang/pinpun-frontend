import { api } from '@/api/client.tsx';
import type { IPinboard, IPinboardExtended } from '@/types';
import type { AxiosResponse } from 'axios';

interface IPinboardBE {
  userId: number;
  userAvatarUrl: string | null;
  userName: string;
  pinboardId: number;
  pinboardName: string;
  pinboardDescription: string;
  pinboardIsPublic: boolean;
  createdAt: string;
  updatedAt: string;
  imgUrls: string[] | null;
}

function formatPinboard2FE(beData: IPinboardBE): IPinboardExtended {
  return {
    id: beData.pinboardId,
    title: beData.pinboardName,
    description: beData.pinboardDescription || '',
    isPublic: beData.pinboardIsPublic,
    coverUrls: beData.imgUrls || [],
    userId: beData.userId,
    username: beData.userName,
    userAvatarUrl: beData.userAvatarUrl,
    createdAt: beData.createdAt ? new Date(beData.createdAt) : null,
    updatedAt: beData.updatedAt ? new Date(beData.updatedAt) : null,
  };
}

export async function getPinboards(): Promise<IPinboardExtended[]> {
  return await api
    .get('/pinboards')
    .then((rsp: AxiosResponse<IPinboardBE[]>) => rsp.data?.map(formatPinboard2FE));
}

export async function getPinboardById(pinboardId?: number): Promise<IPinboardExtended | null> {
  if (!pinboardId) {
    return null;
  }
  return await api
    .get(`/pinboards/${pinboardId}`)
    .then((rsp: AxiosResponse<IPinboardBE>) => formatPinboard2FE(rsp.data));
}

export async function getPinboardsByUser(userId?: number | null): Promise<IPinboardExtended[]> {
  if (userId === null || userId === undefined) {
    return [];
  }
  return await api
    .get(`/users/${userId}/pinboards`)
    .then((rsp: AxiosResponse<IPinboardBE[]>) => rsp.data?.map(formatPinboard2FE));
}

export async function createPinboard({ title, description, isPublic }: IPinboard): Promise<number> {
  return await api
    .post(`/pinboards`, { name: title, description, isPublic })
    .then((rsp) => rsp.data?.pinboardId);
}

export async function updatePinboard(
  pinboardId: number,
  { title, description, isPublic }: IPinboard,
): Promise<void> {
  return await api.put(`/pinboards/${pinboardId}`, { name: title, description, isPublic });
}

// export async function deletePinboard({ id }: Pick<IPinboard, 'id'>): Promise<any> {
//   return await api.delete(`/pinboards/${id}`);
// }
