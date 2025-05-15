import { Fragment } from 'react';
import { Plus } from '@rsuite/icons';
import { Dropdown, Text } from 'rsuite';
import { useModal } from '@ebay/nice-modal-react';
import PinboardFormModal from '@/components/PinboardFormModal.tsx';
import PictureFormModal from '@/components/PictureFormModal.tsx';
import StreamFormModal from '@/components/StreamFormModal.tsx';

export default function NewItemDropdown({ expand }: { expand?: boolean }) {
  const pinboardModal = useModal(PinboardFormModal);
  const pictureModal = useModal(PictureFormModal);
  const streamModal = useModal(StreamFormModal);
  return (
    <Dropdown
      placement="rightEnd"
      title={
        <Fragment>
          <Plus />
          {expand && <Text>New</Text>}
        </Fragment>
      }
      toggleClassName="w-full mx-2"
      noCaret
    >
      <Dropdown.Item onClick={() => pictureModal.show()}>New Pin</Dropdown.Item>
      <Dropdown.Item onClick={() => pinboardModal.show()}>New Pinboard</Dropdown.Item>
      <Dropdown.Item onClick={() => streamModal.show()}>New Follow Stream</Dropdown.Item>
    </Dropdown>
  );
}
