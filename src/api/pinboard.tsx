import { api } from '@/api/client.tsx';
import type { IPinboard, IPinboardExtended, IPinboardsPaged } from '@/types';
import type { AxiosError, AxiosResponse } from 'axios';
import { pushErrorMessage, pushSuccessMessage } from '@/utils';

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

interface IPinboardPagedBE {
  pinboards: IPinboardBE[];
  totalPageCount: number;
  totalPinboardCount: number;
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

interface IPageSearchParams {
  page: number;
  size: number;
  search?: string;
}

export async function getPinboards(params: IPageSearchParams): Promise<IPinboardsPaged> {
  return await api.get('/pinboards', { params }).then((rsp: AxiosResponse<IPinboardPagedBE>) => ({
    data: rsp.data?.pinboards?.map(formatPinboard2FE),
    totalPages: rsp.data?.totalPageCount,
    totalCount: rsp.data?.totalPinboardCount,
  }));
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
    .then((rsp) => {
      pushSuccessMessage('Pinboard created successfully!');
      return rsp.data?.pinboardId;
    })
    .catch((err: AxiosError) => {
      pushErrorMessage('Failed to create pinboard');
      throw err;
    });
}

export async function updatePinboard(
  pinboardId: number,
  { title, description, isPublic }: IPinboard,
): Promise<void> {
  return await api
    .put(`/pinboards/${pinboardId}`, { name: title, description, isPublic })
    .then(() => {
      pushSuccessMessage('Pinboard updated successfully!');
    })
    .catch((err: AxiosError) => {
      pushErrorMessage('Failed to update pinboard');
      throw err;
    });
}

export async function followPinboard(pinboardId: number, streamName: string): Promise<void> {
  await api
    .post(`/streams/${streamName}/pinboards/${pinboardId}`)
    .then(() => {
      pushSuccessMessage('Pinboard followed successfully!');
    })
    .catch((err: AxiosError) => {
      pushErrorMessage(
        err.status === 409
          ? 'Already followed in this stream.'
          : // @ts-expect-error unknown type
            err.response?.data.message,
      );
      Promise.reject(err);
    });
}
