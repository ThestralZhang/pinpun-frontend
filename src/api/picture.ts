import { api } from '@/api/client.tsx';
import type { AxiosResponse } from 'axios';
import type { IPicture, IPictureExtended, IPicturesPaged } from '@/types/picture.ts';

interface IPictureBE {
  userId: number;
  userName: string;
  userAvatarUrl: string | null;
  pinboardId: number;
  pinboardName: string;
  pictureId: number;
  pictureUrl: string;
  pictureSrcImgUrl: string | null;
  picturePageUrl: string | null;
  pictureName: string;
  pictureDescription: string | null;
  pinnedAt: string;
  isRepin: boolean;
  tags: string[];
  likeCount: number;
  isLiked: boolean;
  originalUserId: number;
  originalUserName: string;
  originalUserAvatarUrl: string | null;
  originalPinboardId: number;
  originalPinboardName: string;
}

interface IPicturesPagedBE {
  pictures: IPictureBE[];
  totalPageCount: number;
  totalPictureCount: number;
}

function formatPicture2FE(beData: IPictureBE): IPictureExtended {
  return {
    id: beData.pictureId,
    title: beData.pictureName,
    description: beData.pictureDescription || '',
    imgUrl: beData.pictureUrl,
    srcImgUrl: beData.pictureSrcImgUrl || '',
    pageUrl: beData.picturePageUrl,
    tags: beData.tags || [],
    pinboardId: beData.pinboardId,
    pinboardName: beData.pinboardName,
    userId: beData.userId,
    username: beData.userName,
    userAvatarUrl: beData.userAvatarUrl,
    isRepin: beData.isRepin,
    originalUserId: beData.originalUserId,
    originalUserName: beData.originalUserName,
    originalUserAvatarUrl: beData.originalUserAvatarUrl,
    originalPinboardId: beData.originalPinboardId,
    originalPinboardName: beData.originalPinboardName,
    likeCount: beData.likeCount,
    likeByMe: beData.isLiked,
    pinnedAt: beData.pinnedAt ? new Date(beData.pinnedAt) : null,
  };
}

interface IPageSortParams {
  page: number;
  size: number;
  sort?: `${'time' | 'likes' | 'relevance'},${'desc' | 'asc'}`;
  search?: string;
}

// for search and explore
export async function getPictures(params: IPageSortParams): Promise<IPicturesPaged> {
  return await api.get('/pinboards', { params }).then((rsp: AxiosResponse<IPicturesPagedBE>) => ({
    data: rsp.data?.pictures.map(formatPicture2FE),
    totalPages: rsp.data?.totalPageCount,
    totalCount: rsp.data?.totalPictureCount,
  }));
}

// get single picture by id in a given pinboard
export async function getPictureId(
  pictureId: number,
  pinboardId: number,
): Promise<IPictureExtended> {
  return await api
    .get(`/pinboards/${pinboardId}/pictures/${pictureId}`)
    .then((rsp: AxiosResponse<IPictureBE>) => formatPicture2FE(rsp.data));
}

// get pictures pinned/repinned by a given user
export async function getPicturesByUser(
  params: IPageSortParams,
  userId?: number | null,
): Promise<IPicturesPaged> {
  if (userId === null || userId === undefined) {
    return {
      data: [],
      totalCount: 0,
      totalPages: 0,
    };
  }
  return await api
    .get(`/users/${userId}/pictures`, { params })
    .then((rsp: AxiosResponse<IPicturesPagedBE>) => ({
      data: rsp.data?.pictures.map(formatPicture2FE),
      totalPages: rsp.data?.totalPageCount,
      totalCount: rsp.data?.totalPictureCount,
    }));
}

export async function createPicture(data: IPicture): Promise<number> {
  return await api
    .post(`/pinboards/${data.pinboardId}/pictures`, {
      imgUrl: data.imgUrl || null,
      srcImgUrl: data.imgUrl ? null : data.srcImgUrl,
      pageUrl: data.pageUrl || null,
      title: data.title,
      description: data.description || null,
      tags: data.tags || [],
    })
    .then((rsp) => rsp.data?.pictureId);
}

// export async function updatePinboard({ id, name, description, isPublic }: IPinboard): Promise<any> {
//   return await api.put(`/pinboards/${id}`, { name, description, isPublic });
// }
//
// export async function deletePinboard({ id }: Pick<IPinboard, 'id'>): Promise<any> {
//   return await api.delete(`/pinboards/${id}`);
// }

export async function searchTag(word: string): Promise<string[]> {
  return await api.get('/tags', { params: { search: word } }).then((rsp) => rsp.data);
}
