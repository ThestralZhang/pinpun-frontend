import { memo, type MouseEvent, useRef, useState } from 'react';
import { Card, ButtonGroup, IconButton, Dropdown, Whisper, Popover } from 'rsuite';
import ImageDisplay from '@/components/ImageDisplay.tsx';
import { MdEdit } from 'react-icons/md';
import { useAuthStore } from '@/stores/useAuthStore.ts';
import type { IPictureExtended, IPicturesPaged } from '@/types/picture.ts';
import { BsPinAngleFill } from 'react-icons/bs';
import { pinPicture, toggleLikePicture } from '@/api/picture.ts';
import PictureFormModal from '@/components/PictureFormModal.tsx';
import { useModal } from '@ebay/nice-modal-react';
import { GoHeart, GoHeartFill } from 'react-icons/go';
import PictureDetailModal from '@/components/PictureDetailModal';
import classnames from 'classnames';
import { type InfiniteData, useQueryClient } from '@tanstack/react-query';

export interface PictureCardProps extends IPictureExtended {
  pinboards?: { id: number; name: string }[];
  className?: string;
}

function PictureCard(props: PictureCardProps) {
  const pictureFormModal = useModal(PictureFormModal);
  const pictureDetailModal = useModal(PictureDetailModal);
  const [hovered, setHovered] = useState(false);
  const loginUser = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const renderPinboardsToggle = () => {
    return (
      <IconButton
        icon={<BsPinAngleFill className="text-blue-500 scale-125" />}
        size="md"
        circle
        className="shadow-lg bg-white ml-2"
        title="Pin"
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
    );
  };

  const actionWrapperRef = useRef<HTMLDivElement>(null);

  const onClickLike = async (e: MouseEvent) => {
    e.stopPropagation();
    await toggleLikePicture(props.id);
    const newLikeCount = props.likeByMe ? props.likeCount - 1 : props.likeCount + 1;
    queryClient.setQueriesData<InfiniteData<IPicturesPaged>>(
      { queryKey: ['paged-pictures'] },
      (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((pic) =>
              pic.id === props.id
                ? {
                    ...pic,
                    likeByMe: !props.likeByMe,
                    likeCount: newLikeCount,
                  }
                : pic,
            ),
          })),
        };
      },
    );
    queryClient.setQueriesData<IPictureExtended>(
      { queryKey: ['picture', props.id], exact: true },
      (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          likeByMe: !props.likeByMe,
          likeCount: newLikeCount,
        };
      },
    );
    queryClient.invalidateQueries({ queryKey: ['user-stats', props.originalUserId] });
  };

  const onPin = async (pinboardId: number, e: MouseEvent) => {
    e.stopPropagation();
    await pinPicture(props.id, pinboardId);
    queryClient.invalidateQueries({ queryKey: ['paged-pinboards'] });
    queryClient.invalidateQueries({ queryKey: ['paged-pictures', { userId: loginUser?.userId }] });
    queryClient.invalidateQueries({ queryKey: ['pinboards'] });
    queryClient.invalidateQueries({ queryKey: ['pinboard', pinboardId] });
    queryClient.invalidateQueries({ queryKey: ['user-stats', props.originalUserId] });
  };

  return (
    <Card
      className={classnames(props.className, 'picture-card rounded-2xl! border-0!')}
      shaded="hover"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() =>
        pictureDetailModal.show({
          pinboardId: props.pinboardId as number,
          pictureId: props.id,
        })
      }
    >
      <ImageDisplay className="w-full" src={props.imgUrl as string} />
      {hovered && (
        <div className="card-actions-wrapper w-full h-[50px] absolute" ref={actionWrapperRef}>
          <ButtonGroup className="float-right mt-2 mr-2">
            <Whisper
              speaker={<Popover className="px-2! py-0.5! text-red-500">{props.likeCount}</Popover>}
              trigger="hover"
              placement="bottom"
              // @ts-expect-error current might be null
              container={() => actionWrapperRef.current}
            >
              <IconButton
                icon={
                  props.likeByMe ? (
                    <GoHeartFill className="text-red-500 scale-125" />
                  ) : (
                    <GoHeart className="text-red-500 scale-125" />
                  )
                }
                size="md"
                circle
                className="shadow-lg bg-white inline-block"
                title={props.likeByMe ? 'Unlike' : 'Like'}
                onClick={onClickLike}
              />
            </Whisper>
            {props.originalUserId === loginUser?.userId && !props.isRepin && (
              <IconButton
                icon={<MdEdit className="text-blue-500 scale-125" />}
                size="md"
                circle
                className="shadow-lg bg-white ml-2! inline-block"
                title="Edit"
                onClick={(e) => {
                  e.stopPropagation();
                  pictureFormModal.show({
                    mode: 'edit',
                    pictureId: props.id,
                    pinboardId: props.pinboardId as number,
                  });
                }}
              />
            )}
            <Dropdown
              renderToggle={renderPinboardsToggle}
              trigger="hover"
              placement="bottomEnd"
              // @ts-expect-error event type
              onSelect={onPin}
              className="ml-2"
              menuStyle={{
                maxHeight: 170,
                maxWidth: 200,
                overflow: 'hidden auto',
                transform: 'translateY(1px)',
              }}
            >
              {props.pinboards?.map((b) => (
                <Dropdown.Item
                  key={b.id}
                  eventKey={b.id}
                  title={b.name}
                  className="block! truncate!"
                >
                  {b.name}
                </Dropdown.Item>
              ))}
            </Dropdown>
          </ButtonGroup>
        </div>
      )}
    </Card>
  );
}

export default memo(PictureCard);
