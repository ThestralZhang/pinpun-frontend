import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPinboardsInStream } from '@/api/pinboard.tsx';
import { deleteStream, getStreams } from '@/api/stream.ts';
import { HStack, IconButton, Nav, Placeholder, SelectPicker } from 'rsuite';
import PictureGallery from '@/components/PictureGallery.tsx';
import { getPicturesInStream } from '@/api/picture.ts';
import PinboardGallery from '@/components/PinboardGallery.tsx';
import { useState } from 'react';
import { ArrowDown, ArrowUp } from '@rsuite/icons';
import StreamItem from '@/pages/Follows/StreamItem.tsx';
import { useModal } from '@ebay/nice-modal-react';
import StreamFormModal from '@/components/StreamFormModal.tsx';
import DeletePromptModal from '@/components/DeletePromptModal.tsx';

export default function Follows() {
  const streamFormModal = useModal(StreamFormModal);
  const deletePrompt = useModal(DeletePromptModal);
  const queryClient = useQueryClient();

  const [viewBy, setViewBy] = useState<'pin' | 'board'>('pin');
  const [stream, setStream] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<boolean>(false);

  const { data: streamList, isLoading: streamLoading } = useQuery({
    queryKey: ['streams'],
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

  const onEdit = (name: string) => {
    streamFormModal.show({
      mode: 'edit',
      streamName: name,
      onEditSuccess: (newName: string) => {
        if (stream === name) {
          setStream(newName);
        }
      },
    });
  };

  const onDelete = (name: string) => {
    deletePrompt.show({
      content: 'You are going to delete this follow stream.\n Are you confirmed to continue?',
      onDelete: async () => {
        await deleteStream({ name });
        await queryClient.invalidateQueries({ queryKey: ['streams'] });
        if (stream === name) {
          setStream(null);
        }
      },
    });
  };

  if (!streamList) {
    return <Placeholder.Paragraph />;
  }

  return (
    <div>
      <HStack className="w-full h-[60px] pr-[40px]">
        <Nav activeKey={viewBy} onSelect={setViewBy} appearance="pills" className="ml-2">
          <Nav.Item eventKey="pin">Pins</Nav.Item>
          <Nav.Item eventKey="board">Pinboards</Nav.Item>
        </Nav>
        <SelectPicker
          data={streamList || []}
          labelKey="name"
          valueKey="name"
          cleanable={false}
          loading={streamLoading}
          value={stream}
          onChange={setStream}
          label="Follow Stream"
        />
        <IconButton
          icon={expanded ? <ArrowUp /> : <ArrowDown />}
          onClick={() => setExpanded((prev) => !prev)}
        />
      </HStack>
      {expanded && (
        <HStack className="w-full pl-2 pb-5 pr-[40px]" wrap>
          {streamList.map((s) => (
            <StreamItem
              streamName={s.name}
              key={s.name}
              onEdit={() => onEdit(s.name)}
              onDelete={() => onDelete(s.name)}
            />
          ))}
        </HStack>
      )}
      {streamList.length > 0 && stream ? (
        viewBy === 'pin' ? (
          <PictureGallery params={{ size: 30, stream }} fetchFn={getPictures} />
        ) : (
          <PinboardGallery params={{ size: 30, stream }} fetchFn={getPinboards} />
        )
      ) : (
        <div className="mt-5 w-full text-center text-gray-400">
          You have to create and choose a stream first.
        </div>
      )}
    </div>
  );
}
