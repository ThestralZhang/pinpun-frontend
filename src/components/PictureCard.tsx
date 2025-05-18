import { memo, useRef, useState } from 'react';
import { Card, ButtonGroup, IconButton, Dropdown, Whisper, Popover } from 'rsuite';
import ImageDisplay from '@/components/ImageDisplay.tsx';
import { MdEdit } from 'react-icons/md';
import { useAuthStore } from '@/stores/useAuthStore.ts';
import type { IPictureExtended } from '@/types/picture.ts';
import { BsPinAngleFill } from 'react-icons/bs';
import { pinPicture, toggleLikePicture } from '@/api/picture.ts';
import PictureFormModal from '@/components/PictureFormModal.tsx';
import { useModal } from '@ebay/nice-modal-react';
import { GoHeart, GoHeartFill } from 'react-icons/go';
import PictureDetailModal from '@/components/PictureDetailModal';
import classnames from 'classnames';

export interface PictureCardProps extends IPictureExtended {
  pinboards?: { id: number; name: string }[];
  className?: string;
}

function PictureCard(props: PictureCardProps) {
  const pictureFormModal = useModal(PictureFormModal);
  const pictureDetailModal = useModal(PictureDetailModal);
  const [hovered, setHovered] = useState(false);
  const { user } = useAuthStore();

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
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLikePicture(props.id);
                }}
              />
            </Whisper>
            {props.originalUserId === user?.userId && !props.isRepin && (
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
              onSelect={(pinboardId: number, e) => {
                e.stopPropagation();
                pinPicture(props.id, pinboardId);
              }}
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
