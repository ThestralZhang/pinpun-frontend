import { Fragment } from 'react';
import { Plus } from '@rsuite/icons';
import { Dropdown, Text } from 'rsuite';
import { useModal } from '@ebay/nice-modal-react';
import PinboardFormModal from '@/components/PinboardFormModal.tsx';

export default function NewItemDropdown({ expand }: { expand?: boolean }) {
  const pinboardModal = useModal(PinboardFormModal);
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
      <Dropdown.Item>New Pin</Dropdown.Item>
      <Dropdown.Item onClick={() => pinboardModal.show()}>New Pinboard</Dropdown.Item>
      <Dropdown.Item>New Follow Stream</Dropdown.Item>
    </Dropdown>
  );
}
