import { api } from '@/api/client.tsx';
import type { AxiosResponse } from 'axios';
import type { IStream, IStreamExtended } from '@/types/stream.ts';

interface IStreamBE {
  userId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

function formatStream2FE(beData: IStreamBE): IStreamExtended {
  return {
    userId: beData.userId,
    name: beData.name,
    createdAt: beData.createdAt ? new Date(beData.createdAt) : null,
    updatedAt: beData.updatedAt ? new Date(beData.updatedAt) : null,
  };
}

export async function getStreams(): Promise<IStream[]> {
  return await api
    .get('/streams')
    .then((rsp: AxiosResponse<IStreamBE[]>) => rsp.data?.map(formatStream2FE));
}

export async function createStream({ name }: IStream): Promise<void> {
  return await api.post(`/streams`, { name });
}
