export interface IStream {
  name: string;
}

export interface IStreamExtended extends IStream {
  userId: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}
