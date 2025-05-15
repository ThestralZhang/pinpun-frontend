import { useQuery } from '@tanstack/react-query';
import { getPinboardsByUser } from '@/api/pinboard.tsx';
import { useAuthStore } from '@/stores/useAuthStore.ts';
import CardWall from '@/components/CardWall.tsx';

export default function MyPins() {
  const { user } = useAuthStore();

  const { data: pinboards = [] } = useQuery({
    queryKey: ['pinboards', { userId: user?.userId }],
    queryFn: () => getPinboardsByUser(user?.userId),
    select: (data) => data.map((p) => ({ type: 'pinboard' as const, ...p })),
  });

  return <CardWall cards={pinboards || []} />;
}
