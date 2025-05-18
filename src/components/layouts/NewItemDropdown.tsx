import { Plus } from '@rsuite/icons';
import { Button, Dropdown } from 'rsuite';
import { useModal } from '@ebay/nice-modal-react';
import PinboardFormModal from '@/components/PinboardFormModal.tsx';
import PictureFormModal from '@/components/PictureFormModal.tsx';
import StreamFormModal from '@/components/StreamFormModal.tsx';

export default function NewItemDropdown({ expand }: { expand?: boolean }) {
  const pinboardModal = useModal(PinboardFormModal);
  const pictureModal = useModal(PictureFormModal);
  const streamModal = useModal(StreamFormModal);

  const renderToggle = () => (
    <Button appearance="ghost" className="w-3/4">
      <Plus />
      {expand && <div className="inline-block ml-2 align-middle">New</div>}
    </Button>
  );

  return (
    <Dropdown
      placement="rightEnd"
      noCaret
      renderToggle={renderToggle}
      className="new-item-dropdown mb-5 text-center"
      trigger="hover"
    >
      <Dropdown.Item onClick={() => pictureModal.show()}>New Pin</Dropdown.Item>
      <Dropdown.Item onClick={() => pinboardModal.show({ mode: 'new' })}>
        New Pinboard
      </Dropdown.Item>
      <Dropdown.Item onClick={() => streamModal.show()}>New Follow Stream</Dropdown.Item>
    </Dropdown>
  );
}
