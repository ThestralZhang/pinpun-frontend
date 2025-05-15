import { Fragment, memo, useState } from 'react';
import { Card, Text, HStack, ButtonGroup, IconButton } from 'rsuite';
import type { IPinboardExtended } from '@/types';
import UserAvatar from '@/components/UserAvatar.tsx';
import ImageDisplay from '@/components/ImageDisplay.tsx';
import { MdEdit } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export interface PinboardCardProps extends IPinboardExtended {
  streams?: string[];
  onFollow?: (pinboardId: number, streamName: string) => void;
  onEdit?: (pinboardId: number) => void;
}

function PinboardCard(props: PinboardCardProps) {
  const coverNum = props.coverUrls.length;
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <Card
      width={320}
      className="pinboard-card rounded-2xl!"
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
        <Text size="lg">{props.title}</Text>
        <UserAvatar
          userId={props.userId}
          username={props.username}
          avatarUrl={props.userAvatarUrl}
          size="sm"
        />
      </HStack>
      {hovered && (
        <div className="card-actions-wrapper w-full h-[50px] absolute">
          <ButtonGroup className="float-right mt-2 mr-2">
            {/*{props.streams && <Dropdown></Dropdown>}*/}
            {props.onEdit && (
              <IconButton
                icon={<MdEdit className="text-blue-600" />}
                size="md"
                circle
                className="shadow-lg bg-white"
                title="Edit"
                onClick={(e) => {
                  e.stopPropagation();
                  props.onEdit?.(props.id);
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
