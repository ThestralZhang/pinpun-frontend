import { ButtonToolbar, Dropdown, HStack, IconButton, Placeholder } from 'rsuite';
import { GoHeart, GoHeartFill } from 'react-icons/go';
import {
  deletePinnedPicture,
  deleteRepinnedPicture,
  pinPicture,
  toggleLikePicture,
} from '@/api/picture.ts';
import { MdEdit } from 'react-icons/md';
import { BsPinAngleFill } from 'react-icons/bs';
import { FaTrashCan } from 'react-icons/fa6';
import type { IPictureExtended, IPicturesPaged } from '@/types/picture.ts';
import { type InfiniteData, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/useAuthStore.ts';
import { getPinboardsByUser } from '@/api/pinboard.tsx';
import { useModal } from '@ebay/nice-modal-react';
import PictureFormModal from '@/components/PictureFormModal.tsx';
import DeletePromptModal from '@/components/DeletePromptModal.tsx';
import { type MouseEvent, useMemo } from 'react';

export default function OperationBar({
  pictureData,
  onClose,
}: {
  pictureData: IPictureExtended | undefined;
  onClose: () => void;
}) {
  const loginUser = useAuthStore((s) => s.user);
  const pictureFormModal = useModal(PictureFormModal);
  const deletePromptModal = useModal(DeletePromptModal);
  const queryClient = useQueryClient();

  const renderPinboardsToggle = () => {
    return (
      <IconButton
        icon={<BsPinAngleFill className="text-blue-500 scale-125" />}
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
    queryKey: ['pinboards', { userId: loginUser?.userId }],
    queryFn: () => getPinboardsByUser(loginUser?.userId),
  });
  const memoPinboards = useMemo<{ id: number; name: string }[]>(
    () => (pinboards ? pinboards.map((b) => ({ id: b.id, name: b.title })) : []),
    [],
  );

  if (!pictureData) {
    return <Placeholder.Graph active className="w-full! h-[60px]! rounded-2xl mt-5" />;
  }

  const onClickLike = async (e: MouseEvent) => {
    e.stopPropagation();
    const picId = pictureData.id as number;
    await toggleLikePicture(picId);
    const newLikeCount = pictureData.likeByMe
      ? pictureData.likeCount - 1
      : pictureData.likeCount + 1;
    queryClient.setQueriesData<InfiniteData<IPicturesPaged>>(
      { queryKey: ['paged-pictures'] },
      (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((pic) =>
              pic.id === picId
                ? {
                    ...pic,
                    likeByMe: !pictureData.likeByMe,
                    likeCount: newLikeCount,
                  }
                : pic,
            ),
          })),
        };
      },
    );
    queryClient.setQueriesData<IPictureExtended>(
      { queryKey: ['picture', picId], exact: true },
      (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          likeByMe: !pictureData.likeByMe,
          likeCount: newLikeCount,
        };
      },
    );
    queryClient.invalidateQueries({ queryKey: ['user-stats', pictureData.originalUserId] });
  };

  const onPin = async (pinboardId: number, e: MouseEvent) => {
    e.stopPropagation();
    await pinPicture(pictureData.id, pinboardId);
    queryClient.invalidateQueries({ queryKey: ['paged-pinboards'] });
    queryClient.invalidateQueries({ queryKey: ['paged-pictures', { userId: loginUser?.userId }] });
    queryClient.invalidateQueries({ queryKey: ['pinboards'] });
    queryClient.invalidateQueries({ queryKey: ['pinboard', pinboardId] });
    queryClient.invalidateQueries({ queryKey: ['user-stats', pictureData.originalUserId] });
  };

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
          onClick={onClickLike}
        />
        <div className="text-red-500">{pictureData.likeCount}</div>
      </HStack>
      <Dropdown
        renderToggle={renderPinboardsToggle}
        trigger="hover"
        placement="bottomEnd"
        // @ts-expect-error event type
        onSelect={onPin}
        className="ml-2"
        menuStyle={{
          maxHeight: 300,
          maxWidth: 200,
          overflow: 'hidden auto',
          transform: 'translateY(1px)',
        }}
      >
        {memoPinboards?.map((b) => (
          <Dropdown.Item key={b.id} eventKey={b.id} className="block! truncate!">
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
      {pictureData.originalUserId === loginUser?.userId && !pictureData.isRepin && (
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
      {pictureData.userId === loginUser?.userId && (
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
                  queryClient.invalidateQueries({ queryKey: ['paged-pictures'] });
                  queryClient.invalidateQueries({ queryKey: ['user-stats'] });
                } else {
                  await deletePinnedPicture(pictureData.id);
                  queryClient.invalidateQueries({ queryKey: ['paged-pictures'] });
                  queryClient.invalidateQueries({ queryKey: ['user-stats'] });
                  queryClient.removeQueries({ queryKey: ['picture', pictureData.id] });
                }
                onClose();
              },
            });
          }}
        />
      )}
    </ButtonToolbar>
  );
}
