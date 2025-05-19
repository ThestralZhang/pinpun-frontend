import { HStack, IconButton } from 'rsuite';
import { Edit, Trash } from '@rsuite/icons';

export default function StreamItem({
  streamName,
  onEdit,
  onDelete,
}: {
  streamName: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <HStack className="border rounded-full px-2 py-0.5 border-gray-300" spacing={1}>
      <div className="ml-2 mr-1">{streamName}</div>
      <IconButton
        icon={<Edit />}
        appearance="link"
        size="sm"
        circle
        className="text-gray-400! hover:text-blue-400!"
        onClick={onEdit}
      />
      <IconButton
        icon={<Trash />}
        appearance="link"
        size="sm"
        circle
        className="text-gray-400! hover:text-blue-400!"
        onClick={onDelete}
      />
    </HStack>
  );
}
