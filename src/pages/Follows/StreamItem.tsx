import { HStack, IconButton } from 'rsuite';
import { Edit, Trash } from '@rsuite/icons';
import { useModal } from '@ebay/nice-modal-react';
import StreamFormModal from '@/components/StreamFormModal.tsx';
import DeletePromptModal from '@/components/DeletePromptModal.tsx';
import { deleteStream } from '@/api/stream.ts';

export default function StreamItem({ streamName }: { streamName: string }) {
  const streamFormModal = useModal(StreamFormModal);
  const deletePrompt = useModal(DeletePromptModal);

  return (
    <HStack className="border rounded-full px-2 py-0.5 border-gray-300" spacing={1}>
      <div className="ml-2 mr-1">{streamName}</div>
      <IconButton
        icon={<Edit />}
        appearance="link"
        size="sm"
        circle
        className="text-gray-400! hover:text-blue-400!"
        onClick={() => streamFormModal.show({ mode: 'edit', streamName })}
      />
      <IconButton
        icon={<Trash />}
        appearance="link"
        size="sm"
        circle
        className="text-gray-400! hover:text-blue-400!"
        onClick={() =>
          deletePrompt.show({
            content: 'You are going to delete this follow stream.\n Are you confirmed to continue?',
            onDelete: async () => deleteStream({ name: streamName }),
          })
        }
      />
    </HStack>
  );
}
