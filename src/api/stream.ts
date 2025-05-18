import { api } from '@/api/client.tsx';
import type { AxiosResponse } from 'axios';
import type { IStream, IStreamExtended } from '@/types/stream.ts';
import { pushErrorMessage, pushSuccessMessage } from '@/utils';

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
  return await api
    .post(`/streams`, { name })
    .then(() => {
      pushSuccessMessage('Follow Stream created successfully!');
    })
    .catch((err) => {
      pushErrorMessage('Failed to create follow stream');
      throw err;
    });
}

export async function updateStream(newName: string, oldName?: string): Promise<void> {
  if (!oldName) {
    return;
  }
  return await api
    .put(`/streams/${oldName}`, { name: newName })
    .then(() => {
      pushSuccessMessage('Follow Stream updated successfully!');
    })
    .catch((err) => {
      pushErrorMessage('Failed to update follow stream');
      throw err;
    });
}

export async function deleteStream({ name }: IStream): Promise<void> {
  return await api
    .delete(`/streams/${name}`)
    .then(() => {
      pushSuccessMessage('Follow Stream deleted successfully!');
    })
    .catch((err) => {
      pushErrorMessage('Failed to delete follow stream');
      throw err;
    });
}
