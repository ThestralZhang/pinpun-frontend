import { useQuery } from '@tanstack/react-query';
import { getPictures } from '@/api/picture.ts';
import { useAuthStore } from '@/stores/useAuthStore.ts';
import { getPinboardsByUser } from '@/api/pinboard.tsx';
import CardWall from '@/components/CardWall.tsx';

export default function Explore() {
  const { user } = useAuthStore();

  const { data: pictures } = useQuery({
    queryKey: ['pictures', { page: 1, size: 30 }],
    queryFn: () => getPictures({ page: 1, size: 30, sort: 'time,desc' }),
    select: (data) => data.data.map((p) => ({ type: 'picture' as const, ...p })),
  });
  const { data: pinboards } = useQuery({
    queryKey: ['pinboards', { userId: user?.userId }],
    queryFn: () => getPinboardsByUser(user?.userId),
    select: (data) => data.map((b) => ({ id: b.id, name: b.title })),
  });

  return <CardWall cards={pictures || []} pinboards={pinboards} />;
}
