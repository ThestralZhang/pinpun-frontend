import { useQuery } from '@tanstack/react-query';
import type { IPinboardsPaged } from '@/types';
import { followPinboard, getPinboards } from '@/api/pinboard.tsx';
import { useCallback } from 'react';
import CardWall from '@/components/CardWall.tsx';
import { getStreams } from '@/api/stream.ts';

export default function Follows() {
  const {
    data,
    // isLoading: listLoading,
    // isFetching,
  } = useQuery<IPinboardsPaged>({
    queryKey: ['pinboards', { page: 1, size: 15 }],
    queryFn: () => getPinboards({ page: 1, size: 15 }),
  });
  const { data: streams } = useQuery({
    queryKey: ['streams'],
    queryFn: () => getStreams().then((data) => data.map((i) => i.name)),
  });

  const onFollow = useCallback(async (pinboardId: number, streamName: string) => {
    await followPinboard(pinboardId, streamName);
  }, []);

  return <CardWall cards={data?.data || []} streams={streams} onFollow={onFollow} />;
}
