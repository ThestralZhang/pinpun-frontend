import { getPinboardsByUser } from '@/api/pinboard.tsx';
import { useAuthStore } from '@/stores/useAuthStore.ts';
import { useState } from 'react';
import { getPicturesByUser } from '@/api/picture.ts';
import { HStack, Nav } from 'rsuite';
import PictureGallery from '@/components/PictureGallery.tsx';
import PinboardGallery from '@/components/PinboardGallery.tsx';

export default function MyPins() {
  const loginUser = useAuthStore((s) => s.user);
  const [viewBy, setViewBy] = useState<'pin' | 'board'>('pin');

  const getPictures = async (params: { page: number; size: number }) => {
    return await getPicturesByUser({ page: params.page, size: params.size }, loginUser?.userId);
  };

  const getPinboards = async () => {
    return await getPinboardsByUser(loginUser?.userId).then((data) => ({
      data,
      totalPages: 1,
      totalCount: data.length,
    }));
  };

  return (
    <div>
      <HStack className="w-full h-[60px] pr-[40px]">
        <Nav activeKey={viewBy} onSelect={setViewBy} appearance="pills" className="ml-2">
          <Nav.Item eventKey="pin">Pins</Nav.Item>
          <Nav.Item eventKey="board">Pinboards</Nav.Item>
        </Nav>
      </HStack>
      {viewBy === 'pin' ? (
        <PictureGallery params={{ size: 30, userId: loginUser?.userId }} fetchFn={getPictures} />
      ) : (
        <PinboardGallery params={{ size: 30, userId: loginUser?.userId }} fetchFn={getPinboards} />
      )}
    </div>
  );
}
