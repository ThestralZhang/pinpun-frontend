export interface IPicture {
  title: string;
  description: string;
  imgUrl: string | null;
  srcImgUrl: string | null;
  pageUrl: string | null;
  tags: string[];
  pinboardId: number | null;
}

export interface IPictureFormInputs extends Omit<IPicture, 'imgUrl' | 'srcImgUrl'> {
  picture: {
    isUploaded: boolean | null;
    imgFile: File | null;
    imgUrl: string | null;
    srcImgUrl: string | null;
  };
}

export interface IPictureExtended extends IPicture {
  id: number;
  pinboardName: string;
  userId: number;
  username: string;
  userAvatarUrl: string | null;
  isRepin: boolean;
  originalUserId: number | null;
  originalUserName: string | null;
  originalUserAvatarUrl: string | null;
  originalPinboardId: number | null;
  originalPinboardName: string | null;
  likeCount: number;
  likeByMe: boolean;
  pinnedAt: Date | null;
}

export interface IPicturesPaged {
  data: IPictureExtended[];
  totalPages: number;
  totalCount: number;
}

export interface IComment {
  content: string;
}

export interface ICommentExtended extends IComment {
  id: number;
  userId: number;
  username: string;
  userAvatarUrl: string | null;
  createdAt: Date;
}

export interface ICommentsPaged {
  data: ICommentExtended[];
  totalPages: number;
  totalCount: number;
}
