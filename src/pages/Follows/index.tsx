import { useQuery } from '@tanstack/react-query';
import { getPinboards } from '@/api/pinboard.tsx';
import CardWall from '@/components/CardWall.tsx';
import { getStreams } from '@/api/stream.ts';

export default function Follows() {
  const { data: pinboards } = useQuery({
    queryKey: ['pinboards', { page: 1, size: 15 }],
    queryFn: () => getPinboards({ page: 1, size: 15 }),
    select: (data) => data.data.map((p) => ({ type: 'pinboard' as const, ...p })),
  });
  const { data: streams } = useQuery({
    queryKey: ['streams'],
    queryFn: () => getStreams(),
    select: (data) => data.map((i) => i.name),
  });

  return <CardWall cards={pinboards || []} streams={streams} />;
}
