import { ButtonToolbar, Dropdown, HStack, IconButton, Placeholder } from 'rsuite';
import { GoHeart, GoHeartFill } from 'react-icons/go';
import {
  deletePinnedPicture,
  deleteRepinnedPicture,
  pinPicture,
  toggleLikePicture,
} from '@/api/picture.ts';
import { MdEdit } from 'react-icons/md';
import { FaMapPin, FaTrashCan } from 'react-icons/fa6';
import type { IPictureExtended } from '@/types/picture.ts';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/useAuthStore.ts';
import { getPinboardsByUser } from '@/api/pinboard.tsx';
import { useModal } from '@ebay/nice-modal-react';
import PictureFormModal from '@/components/PictureFormModal.tsx';
import DeletePromptModal from '@/components/DeletePromptModal.tsx';

export default function OperationBar({
  pictureData,
  onClose,
}: {
  pictureData: IPictureExtended | undefined;
  onClose: () => void;
}) {
  const { user } = useAuthStore();
  const pictureFormModal = useModal(PictureFormModal);
  const deletePromptModal = useModal(DeletePromptModal);

  const renderPinboardsToggle = () => {
    return (
      <IconButton
        icon={<FaMapPin className="text-blue-500 scale-125" />}
        size="md"
        circle
        className="bg-white! ml-2 hover:shadow-md"
        title="Pin"
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
    );
  };

  const { data: pinboards } = useQuery({
    queryKey: ['pinboards', { userId: user?.userId }],
    queryFn: () => getPinboardsByUser(user?.userId),
    select: (data) => data.map((b) => ({ id: b.id, name: b.title })),
  });

  if (!pictureData) {
    return <Placeholder.Graph active className="w-full! h-[60px]! rounded-2xl mt-5" />;
  }

  return (
    <ButtonToolbar className="w-full! h-[60px] bg-gray-100 rounded-2xl justify-around">
      <HStack>
        <IconButton
          icon={
            pictureData.likeByMe ? (
              <GoHeartFill className="text-red-500 scale-125" />
            ) : (
              <GoHeart className="text-red-500 scale-125" />
            )
          }
          size="md"
          circle
          className="bg-white! hover:shadow-lg"
          title={pictureData.likeByMe ? 'Unlike' : 'Like'}
          onClick={(e) => {
            e.stopPropagation();
            toggleLikePicture(pictureData.id);
          }}
        />
        <div className="text-red-500">{pictureData.likeCount}</div>
      </HStack>
      <Dropdown
        renderToggle={renderPinboardsToggle}
        trigger="hover"
        placement="bottomEnd"
        onSelect={(pinboardId: number, e) => {
          e.stopPropagation();
          pinPicture(pictureData.id, pinboardId);
        }}
        className="ml-2"
      >
        {pinboards?.map((b) => (
          <Dropdown.Item key={b.id} eventKey={b.id}>
            {b.name}
          </Dropdown.Item>
        ))}
      </Dropdown>
      {/*<IconButton*/}
      {/*  icon={<FaDownload className="text-blue-500 scale-125" />}*/}
      {/*  size="md"*/}
      {/*  circle*/}
      {/*  className="bg-white! hover:shadow-lg"*/}
      {/*  title="download"*/}
      {/*  onClick={async (e) => {*/}
      {/*    try {*/}
      {/*      // 1) fetch the image as a blob*/}
      {/*      const res = await fetch(pictureData.imgUrl as string, { mode: 'cors' });*/}
      {/*      if (!res.ok) throw new Error(`HTTP ${res.status}`);*/}

      {/*      const blob = await res.blob();*/}

      {/*      // 2) create a temporary object URL*/}
      {/*      const blobUrl = URL.createObjectURL(blob);*/}

      {/*      // 3) create a hidden <a> and click it*/}
      {/*      const a = document.createElement('a');*/}
      {/*      a.href = blobUrl;*/}
      {/*      a.download = pictureData.title as string;*/}
      {/*      document.body.appendChild(a);*/}
      {/*      a.click();*/}

      {/*      // 4) clean up*/}
      {/*      a.remove();*/}
      {/*      URL.revokeObjectURL(blobUrl);*/}
      {/*    } catch (err) {*/}
      {/*      console.error('Download failed:', err);*/}
      {/*    }*/}
      {/*  }}*/}
      {/*/>*/}
      {pictureData.originalUserId === user?.userId && !pictureData.isRepin && (
        <IconButton
          icon={<MdEdit className="text-blue-500 scale-125" />}
          size="md"
          circle
          className="bg-white! hover:shadow-lg"
          title="Edit"
          onClick={(e) => {
            e.stopPropagation();
            pictureFormModal.show({
              mode: 'edit',
              pinboardId: pictureData.pinboardId as number,
              pictureId: pictureData.id,
            });
          }}
        />
      )}
      {pictureData.userId === user?.userId && (
        <IconButton
          icon={<FaTrashCan className="text-blue-500 scale-125" />}
          size="md"
          circle
          className="bg-white! hover:shadow-lg"
          title="Delete"
          onClick={() => {
            deletePromptModal.show({
              content: pictureData.isRepin
                ? `You are going to remove this pin from the pinboard(${pictureData.pinboardName}).\nAre you confirmed to continue?`
                : 'You are going to totally delete this picture.\nAre you confirmed to continue?',
              onDelete: async () => {
                if (pictureData.isRepin) {
                  await deleteRepinnedPicture(pictureData.pinboardId as number, pictureData.id);
                } else {
                  await deletePinnedPicture(pictureData.id);
                }
                deletePromptModal.hide();
                onClose();
              },
            });
          }}
        />
      )}
    </ButtonToolbar>
  );
}
