import { useQuery } from '@tanstack/react-query';
import type { IPinboardExtended } from '@/types';
import { getPinboardsByUser } from '@/api/pinboard.ts';
import { useAuthStore } from '@/stores/useAuthStore.ts';
import CardWall from '@/components/CardWall.tsx';
import { useCallback } from 'react';
import PinboardFormModal from '@/components/PinboardFormModal.tsx';
import { useModal } from '@ebay/nice-modal-react';

export default function MyPins() {
  const { user } = useAuthStore();
  const pinboardModal = useModal(PinboardFormModal);

  const {
    data: pinboards = [],
    // isLoading: listLoading,
    // isFetching,
  } = useQuery<IPinboardExtended[]>({
    queryKey: ['pinboards', { userId: user?.userId }],
    queryFn: () => getPinboardsByUser(user?.userId),
  });

  const onEditPinboard = useCallback((pinboardId: number) => {
    pinboardModal.show({ mode: 'edit', pinboardId });
  }, []);

  return <CardWall cards={pinboards} onEditPinboard={onEditPinboard} />;
}
