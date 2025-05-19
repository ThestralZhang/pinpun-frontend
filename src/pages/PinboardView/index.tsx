import { Button, Dropdown, HStack, Placeholder, VStack } from 'rsuite';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deletePinboard,
  followPinboard,
  getPinboardById,
  unfollowPinboard,
} from '@/api/pinboard.tsx';
import { getPicturesInPinboard } from '@/api/picture.ts';
import PictureGallery from '@/components/PictureGallery.tsx';
import UserAvatar from '@/components/UserAvatar.tsx';
import { MdEdit } from 'react-icons/md';
import { useAuthStore } from '@/stores/useAuthStore.ts';
import { getStreams } from '@/api/stream.ts';
import { HiMiniEye, HiMiniEyeSlash } from 'react-icons/hi2';
import { useModal } from '@ebay/nice-modal-react';
import PinboardFormModal from '@/components/PinboardFormModal.tsx';
import { RiChatPrivateFill } from 'react-icons/ri';
import { FaTrashCan } from 'react-icons/fa6';
import DeletePromptModal from '@/components/DeletePromptModal.tsx';

export default function PinboardView() {
  const loginUser = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const params = useParams();
  const pinboardId = Number(params.pinboardId);
  const pinboardModal = useModal(PinboardFormModal);
  const deletePrompt = useModal(DeletePromptModal);
  const queryClient = useQueryClient();

  const { data: pinboardData } = useQuery({
    queryKey: ['pinboard', pinboardId],
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

  const deleteMutation = useMutation({
    mutationFn: () => deletePinboard(pinboardId),
    onSuccess: () => {
      navigate('/explore');
      queryClient.invalidateQueries({ queryKey: ['paged-pinboards'] });
      queryClient.invalidateQueries({ queryKey: ['pinboards'] });
      queryClient.removeQueries({ queryKey: ['pinboard', pinboardId] });
    },
  });

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
          <HStack>
            <div className="text-[36px] font-bold">{pinboardData.title}</div>
            {!pinboardData.isPublic && (
              <RiChatPrivateFill className="scale-150 shrink-0 grow-0 ml-2 text-gray-400" />
            )}
          </HStack>
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
            {loginUser?.userId === pinboardData.userId && (
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
            {loginUser?.userId === pinboardData.userId && (
              <Button
                onClick={() => {
                  deletePrompt.show({
                    content: 'You are going to delete a pinboard.\n Are you confirmed to continue?',
                    onDelete: async () => {
                      deleteMutation.mutateAsync();
                      deletePrompt.hide();
                    },
                  });
                }}
              >
                <FaTrashCan className="mr-1" />
                Delete
              </Button>
            )}
            {loginUser?.userId !== pinboardData.userId && (
              <Dropdown
                trigger="hover"
                placement="bottomEnd"
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
            {loginUser?.userId !== pinboardData.userId && (
              <Dropdown
                trigger="hover"
                placement="bottomEnd"
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
