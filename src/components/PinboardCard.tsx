import { Fragment, memo, useState } from 'react';
import { Card, Text, HStack, ButtonGroup, IconButton, Dropdown } from 'rsuite';
import type { IPinboardExtended } from '@/types';
import UserAvatar from '@/components/UserAvatar.tsx';
import ImageDisplay from '@/components/ImageDisplay.tsx';
import { MdEdit } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore.ts';
import { HiMiniEye } from 'react-icons/hi2';
import StackItem from 'rsuite/StackItem';
import { followPinboard } from '@/api/pinboard.tsx';
import { useModal } from '@ebay/nice-modal-react';
import PinboardFormModal from '@/components/PinboardFormModal.tsx';
import classnames from 'classnames';
import { useQueryClient } from '@tanstack/react-query';

export interface PinboardCardProps extends IPinboardExtended {
  streams?: string[];
  className?: string;
}

function PinboardCard(props: PinboardCardProps) {
  const coverNum = props.coverUrls?.length;
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const loginUser = useAuthStore((s) => s.user);
  const pinboardModal = useModal(PinboardFormModal);
  const queryClient = useQueryClient();

  const renderStreamToggle = () => {
    return (
      <IconButton
        icon={<HiMiniEye className="text-blue-500" />}
        size="md"
        circle
        className="shadow-lg bg-white"
        title="Follow"
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
    );
  };

  return (
    <Card
      className={classnames(props.className, 'pinboard-card rounded-2xl!')}
      shaded="hover"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/pinboards/${props.id}`)}
    >
      <div className="pinboard-cover w-full h-[200px]">
        {coverNum <= 1 && <ImageDisplay src={props.coverUrls[0]} className="w-full h-full" />}
        {coverNum === 2 && (
          <Fragment>
            <ImageDisplay src={props.coverUrls[0]} className="w-[60%] h-full inline-block" />
            <ImageDisplay src={props.coverUrls[1]} className="w-[40%] h-full inline-block" />
          </Fragment>
        )}
        {coverNum >= 3 && (
          <Fragment>
            <ImageDisplay src={props.coverUrls[0]} className="w-[60%] h-full inline-block" />
            <div className="w-[40%] h-full inline-block">
              <ImageDisplay src={props.coverUrls[1]} className="w-full h-[60%]" />
              <ImageDisplay src={props.coverUrls[2]} className="w-full h-[40%]" />
            </div>
          </Fragment>
        )}
      </div>
      <HStack justifyContent="space-between" className="px-3 py-2">
        <Text size="lg" className="break-all">
          {props.title}
        </Text>
        <StackItem shrink={0} grow={0}>
          <UserAvatar
            userId={props.userId}
            username={props.username}
            avatarUrl={props.userAvatarUrl}
            size="sm"
            placement="leftStart"
          />
        </StackItem>
      </HStack>
      {hovered && (
        <div className="card-actions-wrapper w-full h-[50px] absolute">
          <ButtonGroup className="float-right mt-2 mr-2">
            {props.userId !== loginUser?.userId && (
              <Dropdown
                renderToggle={renderStreamToggle}
                trigger="hover"
                placement="bottomEnd"
                onSelect={async (streamName: string, e) => {
                  e.stopPropagation();
                  await followPinboard(props.id, streamName);
                  queryClient.invalidateQueries({
                    queryKey: ['paged-pinboards', { stream: streamName }],
                  });
                  queryClient.invalidateQueries({
                    queryKey: ['paged-pictures', { stream: streamName }],
                  });
                }}
                menuStyle={{
                  maxHeight: 170,
                  maxWidth: 200,
                  overflow: 'hidden auto',
                  transform: 'translateY(1px)',
                }}
              >
                {props.streams?.map((stream) => (
                  <Dropdown.Item key={stream} eventKey={stream} className="block! truncate!">
                    {stream}
                  </Dropdown.Item>
                ))}
              </Dropdown>
            )}

            {props.userId === loginUser?.userId && (
              <IconButton
                icon={<MdEdit className="text-blue-500" />}
                size="md"
                circle
                className="shadow-lg bg-white"
                title="Edit"
                onClick={(e) => {
                  e.stopPropagation();
                  pinboardModal.show({ mode: 'edit', pinboardId: props.id });
                }}
              />
            )}
          </ButtonGroup>
        </div>
      )}
    </Card>
  );
}

export default memo(PinboardCard);
