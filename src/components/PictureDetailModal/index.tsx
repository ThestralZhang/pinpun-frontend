import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { IconButton, Modal, VStack, Stack, HStack } from 'rsuite';
import { useQuery } from '@tanstack/react-query';
import { getPictureById } from '@/api/picture.ts';
import ImagePreview from '@/components/ImagePreview.tsx';
import { Close } from '@rsuite/icons';
import BasicInfo from '@/components/PictureDetailModal/BasicInfo.tsx';
import type { IPictureExtended } from '@/types/picture.ts';
import OperationBar from '@/components/PictureDetailModal/OperationBar.tsx';
import CommentArea from '@/components/PictureDetailModal/CommentArea.tsx';

export default NiceModal.create(function PictureDetailModal({
  pictureId,
  pinboardId,
}: {
  pictureId: number;
  pinboardId: number;
}) {
  const modal = useModal();

  const { data: pictureData } = useQuery<IPictureExtended>({
    queryKey: ['picture-item', pictureId],
    queryFn: () => getPictureById(pinboardId, pictureId),
  });

  const onClose = () => {
    modal.hide();
  };

  return (
    <Modal
      backdrop="static"
      open={modal.visible}
      size="1000px"
      className="picture-detail-modal h-[800px]"
    >
      <IconButton
        icon={<Close />}
        className="absolute! top-3 right-3"
        appearance="subtle"
        size="sm"
        onClick={onClose}
      />
      <HStack spacing={0}>
        <Stack.Item className="w-[500px] h-full bg-gray-100" grow={0} shrink={0}>
          <ImagePreview width={500} height={900} src={pictureData?.imgUrl || null} />
        </Stack.Item>
        <VStack
          className="w-[500px] h-[900px]  px-5 pt-3 pb-5"
          justifyContent="space-between"
          alignItems="stretch"
        >
          <Stack.Item>
            <BasicInfo pictureData={pictureData} onClose={onClose} />
          </Stack.Item>
          <Stack.Item grow={0} shrink={0} className="mt-3 mb-3">
            <OperationBar pictureData={pictureData} onClose={onClose} />
          </Stack.Item>
          <Stack.Item grow={1} className="max-h-2/3">
            <CommentArea pictureId={pictureId} pinboardId={pinboardId} onClose={onClose} />
          </Stack.Item>
        </VStack>
      </HStack>
    </Modal>
  );
});
