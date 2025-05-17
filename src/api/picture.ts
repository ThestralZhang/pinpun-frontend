import { api } from '@/api/client.tsx';
import type { AxiosError, AxiosResponse } from 'axios';
import type {
  ICommentsPaged,
  IPicture,
  IPictureExtended,
  IPicturesPaged,
} from '@/types/picture.ts';
import { pushErrorMessage, pushSuccessMessage } from '@/utils';

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
  return await api.get('/pictures', { params }).then((rsp: AxiosResponse<IPicturesPagedBE>) => ({
    data: rsp.data?.pictures.map(formatPicture2FE),
    totalPages: rsp.data?.totalPageCount,
    totalCount: rsp.data?.totalPictureCount,
  }));
}

// get single picture by id in a given pinboard
export async function getPictureById(
  pinboardId: number,
  pictureId: number,
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
    .then((rsp) => {
      pushSuccessMessage('Picture created successfully!');
      return rsp.data?.pictureId;
    })
    .catch((err: AxiosError) => {
      pushErrorMessage('Failed to create picture');
      throw err;
    });
}

export async function updatePicture(
  pictureId: number,
  { title, description, tags }: IPicture,
): Promise<void> {
  return await api
    .put(`/pictures/${pictureId}`, { title, description, tags })
    .then(() => {
      pushSuccessMessage('Picture updated successfully!');
    })
    .catch((err: AxiosError) => {
      pushErrorMessage('Failed to update picture');
      throw err;
    });
}

export async function deleteRepinnedPicture(pinboardId: number, pictureId: number): Promise<void> {
  return await api
    .delete(`/pinboards/${pinboardId}/pictures/${pictureId}/repin`)
    .then(() => {
      pushSuccessMessage('Pin removed from pinboard successfully!');
    })
    .catch((err: AxiosError) => {
      pushErrorMessage('Failed to remove pin from pinboard');
      throw err;
    });
}

export async function deletePinnedPicture(pictureId: number): Promise<void> {
  return await api
    .delete(`/pictures/${pictureId}`)
    .then(() => {
      pushSuccessMessage('Picture deleted successfully!');
    })
    .catch((err: AxiosError) => {
      pushErrorMessage('Failed to delete picture');
      throw err;
    });
}

export async function pinPicture(pictureId: number, pinboardId: number): Promise<void> {
  await api
    .post(`/pinboards/${pinboardId}/pictures/${pictureId}/repin`)
    .then(() => {
      pushSuccessMessage('Repin successfully!');
    })
    .catch((e) => {
      pushErrorMessage(
        e.status === 400
          ? 'Already repinned in this pinboard.'
          : // @ts-expect-error unknown type
            err.response?.data.message,
      );
      Promise.reject(e);
    });
}

export async function toggleLikePicture(pictureId: number): Promise<void> {
  await api.post(`/pictures/${pictureId}/like`);
}

export async function searchTag(word: string): Promise<string[]> {
  return await api.get('/tags', { params: { search: word } }).then((rsp) => rsp.data);
}

interface ICommentBE {
  userId: number;
  userName: string;
  userAvatarUrl: string | null;
  commentId: number;
  content: string;
  createdAt: string;
}

interface ICommentsPagedBE {
  comments: ICommentBE[];
  totalPageCount: number;
  totalCommentCount: number;
}

interface ICommentParams {
  page: number;
  size: number;
  sort?: `createdAt,${'asc' | 'desc'}`;
}

export async function getCommentsOnPicture(
  pinboardId: number,
  pictureId: number,
  params: ICommentParams,
): Promise<ICommentsPaged> {
  return await api
    .get(`/pinboards/${pinboardId}/pictures/${pictureId}/comments`, { params })
    .then((rsp: AxiosResponse<ICommentsPagedBE>) => ({
      data: rsp.data?.comments.map(({ commentId, userName, createdAt, ...rest }) => ({
        id: commentId,
        username: userName,
        createdAt: new Date(createdAt),
        ...rest,
      })),
      totalPages: rsp.data?.totalPageCount,
      totalCount: rsp.data?.totalCommentCount,
    }));
}

export async function commentOnPicture(
  pinboardId: number,
  pictureId: number,
  content: string,
): Promise<number> {
  return await api
    .post(`/pinboards/${pinboardId}/pictures/${pictureId}/comments`, { content })
    .then((rsp: AxiosResponse<ICommentBE>) => {
      pushSuccessMessage('Comment posted successfully!');
      return rsp.data?.commentId;
    })
    .catch((err: AxiosError) => {
      // @ts-expect-error unknown type
      pushErrorMessage(err.response?.data.message || 'Failed to comment');
      throw err;
    });
}

export async function deleteCommentOnPicture(commentId: number): Promise<void> {
  return await api
    .delete(`/comments/${commentId}`)
    .then(() => {
      pushSuccessMessage('Comment deleted successfully!');
    })
    .catch((err: AxiosError) => {
      pushErrorMessage('Failed to delete comment');
      throw err;
    });
}
