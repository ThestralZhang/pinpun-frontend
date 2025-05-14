import { useQuery } from '@tanstack/react-query';
import type { IPinboardExtended } from '@/types';
import { getPinboardsByUser } from '@/api/pinboard.ts';
import { useAuthStore } from '@/stores/useAuthStore.ts';
import CardWall from '@/components/CardWall.tsx';

export default function MyPins() {
  const { user } = useAuthStore();

  const {
    data: pinboards = [],
    // isLoading: listLoading,
    // isFetching,
  } = useQuery<IPinboardExtended[]>({
    queryKey: ['pinboards', { userId: user?.userId }],
    queryFn: () => getPinboardsByUser(user?.userId),
  });

  return <CardWall cards={pinboards} />;
}
