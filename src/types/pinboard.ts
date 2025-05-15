export interface IPinboard {
  title: string;
  description: string;
  isPublic: boolean;
}

export interface IPinboardExtended extends IPinboard {
  id: number;
  userId: number;
  username: string;
  userAvatarUrl: string | null;
  coverUrls: string[];
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface IPinboardsPaged {
  data: IPinboardExtended[];
  totalPages: number;
  totalCount: number;
}
