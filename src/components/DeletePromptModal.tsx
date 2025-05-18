import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button, Modal } from 'rsuite';
import { useState } from 'react';

interface DeletePromptModalProps {
  onDelete: () => Promise<void>;
  content: string;
}

export default NiceModal.create(function DeletePromptModal({
  content,
  onDelete,
}: DeletePromptModalProps) {
  const modal = useModal();
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <Modal
      open={modal.visible}
      onClose={() => modal.hide()}
      backdrop="static"
      size="xs"
      className="delete-prompt"
    >
      <Modal.Header className="text-lg">Delete Confirmation</Modal.Header>
      <Modal.Body className="whitespace-pre-wrap break-all">{content}</Modal.Body>
      <Modal.Footer>
        <Button
          appearance="primary"
          loading={isDeleting}
          onClick={async () => {
            setIsDeleting(true);
            await onDelete().finally(() => setIsDeleting(false));
            modal.hide();
          }}
        >
          Confirm
        </Button>
        <Button onClick={() => modal.hide()} appearance="subtle">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
});
