import { useQuery } from '@tanstack/react-query';
import { getPinboardsInStream } from '@/api/pinboard.tsx';
import { getStreams } from '@/api/stream.ts';
import { HStack, Nav, SelectPicker } from 'rsuite';
import PictureGallery from '@/components/PictureGallery.tsx';
import { getPicturesInStream } from '@/api/picture.ts';
import PinboardGallery from '@/components/PinboardGallery.tsx';
import { useState } from 'react';

export default function Follows() {
  const [viewBy, setViewBy] = useState<'pin' | 'board'>('pin');
  const [stream, setStream] = useState<string | null>(null);

  const { data: streams, isLoading: streamLoading } = useQuery({
    queryKey: ['stream-list'],
    queryFn: () =>
      getStreams().then((data) => {
        if (!stream) {
          setStream(data[0]?.name);
        }
        return data;
      }),
  });

  const getPictures = async (params: { page: number; size: number }) => {
    return await getPicturesInStream(stream, { page: params.page, size: params.size });
  };

  const getPinboards = async (params: { page: number; size: number }) => {
    return await getPinboardsInStream(stream, { page: params.page, size: params.size });
  };

  return (
    <div>
      <HStack className="w-full h-[60px] pr-[40px]">
        <Nav activeKey={viewBy} onSelect={setViewBy} appearance="pills" className="ml-2">
          <Nav.Item eventKey="pin">Pins</Nav.Item>
          <Nav.Item eventKey="board">Pinboards</Nav.Item>
        </Nav>
        <SelectPicker
          data={streams || []}
          labelKey="name"
          valueKey="name"
          cleanable={false}
          loading={streamLoading}
          value={stream}
          onChange={setStream}
          label="Follow Stream"
        />
      </HStack>
      {stream ? (
        viewBy === 'pin' ? (
          <PictureGallery params={{ size: 30, stream }} fetchFn={getPictures} />
        ) : (
          <PinboardGallery params={{ size: 30, stream }} fetchFn={getPinboards} />
        )
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
