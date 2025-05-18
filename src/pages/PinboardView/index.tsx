import { Button, Dropdown, HStack, Placeholder, VStack } from 'rsuite';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { followPinboard, getPinboardById, unfollowPinboard } from '@/api/pinboard.tsx';
import { getPicturesInPinboard } from '@/api/picture.ts';
import PictureGallery from '@/components/PictureGallery.tsx';
import UserAvatar from '@/components/UserAvatar.tsx';
import { MdEdit } from 'react-icons/md';
import { useAuthStore } from '@/stores/useAuthStore.ts';
import { getStreams } from '@/api/stream.ts';
import { HiMiniEye, HiMiniEyeSlash } from 'react-icons/hi2';
import { useModal } from '@ebay/nice-modal-react';
import PinboardFormModal from '@/components/PinboardFormModal.tsx';

export default function PinboardView() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const params = useParams();
  const pinboardId = Number(params.pinboardId);
  const pinboardModal = useModal(PinboardFormModal);

  const { data: pinboardData } = useQuery({
    queryKey: ['pinboards', pinboardId],
    queryFn: () => getPinboardById(pinboardId),
    enabled: !!pinboardId,
  });

  const { data: streams } = useQuery({
    queryKey: ['streams'],
    queryFn: () => getStreams(),
    select: (data) => data.map((s) => s.name),
  });

  const getPictures = async ({ page, size }: { page: number; size: number }) => {
    return await getPicturesInPinboard(pinboardId, { page, size });
  };

  if (!pinboardData) {
    return <Placeholder.Paragraph />;
  }

  return (
    <div>
      <HStack
        className="w-full pr-[40px] pl-3 py-3 mb-3 border-b border-gray-200"
        justifyContent="space-between"
        alignItems="stretch"
      >
        <VStack spacing={8}>
          <div className="text-[36px] font-bold">{pinboardData.title}</div>
          <div className="text-gray-500 text-lg">{pinboardData.description}</div>
          <HStack>
            <div>
              by{' '}
              <span
                className="font-bold hover:text-blue-400 hover:underline cursor-pointer"
                onClick={() => {
                  navigate(`/users/${pinboardData.userId}`);
                }}
              >
                {pinboardData.username}
              </span>
            </div>
            <UserAvatar
              userId={pinboardData.userId}
              username={pinboardData.username}
              avatarUrl={pinboardData.userAvatarUrl}
              placement="rightStart"
            />
          </HStack>
        </VStack>
        <VStack justifyContent="space-between" alignItems="flex-end">
          <HStack>
            {user?.userId === pinboardData.userId && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  pinboardModal.show({ mode: 'edit', pinboardId });
                }}
              >
                <MdEdit className="mr-1" />
                Edit
              </Button>
            )}
            {user?.userId !== pinboardData.userId && (
              <Dropdown
                title={
                  <HStack>
                    <HiMiniEye className="mr-1" />
                    Add to Stream
                  </HStack>
                }
                onSelect={(streamName: string, e) => {
                  e.stopPropagation();
                  followPinboard(pinboardId, streamName);
                }}
              >
                {streams?.map((s) => (
                  <Dropdown.Item key={s} eventKey={s}>
                    {s}
                  </Dropdown.Item>
                ))}
              </Dropdown>
            )}
            {user?.userId !== pinboardData.userId && (
              <Dropdown
                title={
                  <HStack>
                    <HiMiniEyeSlash className="mr-1" />
                    Remove from Stream
                  </HStack>
                }
                onSelect={(streamName: string, e) => {
                  e.stopPropagation();
                  unfollowPinboard(pinboardId, streamName);
                }}
              >
                {streams?.map((s) => (
                  <Dropdown.Item key={s} eventKey={s}>
                    {s}
                  </Dropdown.Item>
                ))}
              </Dropdown>
            )}
          </HStack>
        </VStack>
      </HStack>
      <PictureGallery params={{ size: 30, pinboardId }} fetchFn={getPictures} />
    </div>
  );
}
