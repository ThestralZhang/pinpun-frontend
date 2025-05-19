import { Button, Divider, HStack, Nav, Placeholder, Text, VStack } from 'rsuite';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getPinboardsByUser } from '@/api/pinboard.tsx';
import { getPicturesByUser } from '@/api/picture.ts';
import PictureGallery from '@/components/PictureGallery.tsx';
import UserAvatar from '@/components/UserAvatar.tsx';
import { MdPersonOff } from 'react-icons/md';
import { useAuthStore } from '@/stores/useAuthStore.ts';
import { api } from '@/api/client.tsx';
import type { User } from '@/types';
import { getFriendList, removeFriend, sendFriendRequest } from '@/api/friend.ts';
import { useMemo, useState } from 'react';
import PinboardGallery from '@/components/PinboardGallery.tsx';
import { useModal } from '@ebay/nice-modal-react';
import DeletePromptModal from '@/components/DeletePromptModal.tsx';
import { FaUserPlus } from 'react-icons/fa6';

export default function UserHome() {
  const loginUser = useAuthStore((s) => s.user);
  const params = useParams();
  const userId = Number(params.userId);
  const [viewBy, setViewBy] = useState<'pin' | 'board'>('pin');
  const deletePrompt = useModal(DeletePromptModal);

  const { data: userData } = useQuery<User>({
    queryKey: ['user', userId],
    queryFn: async () => await api.get(`/users/${userId}`).then((rsp) => rsp.data),
    enabled: !!userId,
  });

  const { data: statsData } = useQuery<{
    pinboards: number;
    pins: number;
    likes: number;
    repins: number;
  }>({
    queryKey: ['user-stats', userId],
    queryFn: async () => await api.get(`/users/${userId}/statistic`).then((rsp) => rsp.data),
    enabled: !!userId,
  });

  const { data: friendList } = useQuery({
    queryKey: ['friends'],
    queryFn: () => getFriendList(),
  });

  const isFriend = useMemo(
    () => !!friendList && friendList.findIndex((f) => f.userId === userId) >= 0,
    [friendList, userId],
  );

  const removeFriendMutation = useMutation({
    mutationFn: (userId: number) => removeFriend(userId),
  });

  const getPictures = async (params: { page: number; size: number }) => {
    return await getPicturesByUser({ page: params.page, size: params.size }, userId);
  };

  const getPinboards = async () => {
    return await getPinboardsByUser(userId).then((data) => ({
      data,
      totalPages: 1,
      totalCount: data.length,
    }));
  };

  if (!userData) {
    return <Placeholder.Paragraph />;
  }

  return (
    <div>
      <HStack
        className="w-full pr-[40px] pl-3 py-3 mb-3 border-b border-gray-200"
        justifyContent="space-between"
        alignItems="stretch"
      >
        <UserAvatar
          userId={userId}
          username={userData.name}
          avatarUrl={userData.avatarUrl}
          hoverMenu={false}
          noRedirect
          className="w-[120px]! h-[120px]! text-[60px]! force-large-avatar"
        />
        <VStack spacing={5} className="grow ml-5">
          <div className="text-[36px] font-bold">{userData.name}</div>
          <HStack className="-mt-1 mb-2">
            <Text size="sm">{statsData?.pinboards ?? '--'} pinboards</Text>
            <Divider vertical />
            <Text size="sm">{statsData?.pins ?? '--'} pins</Text>
            <Divider vertical />
            <Text size="sm">{statsData?.likes ?? '--'} likes</Text>
            <Divider vertical />
            <Text size="sm">{statsData?.repins ?? '--'} repins</Text>
          </HStack>
          <div className="text-gray-500 text-lg">{userData.about}</div>
        </VStack>
        <VStack justifyContent="space-between" alignItems="flex-end">
          <HStack>
            {loginUser?.userId !== userId && !isFriend && (
              <Button
                onClick={() => {
                  sendFriendRequest(userId);
                }}
              >
                <FaUserPlus className="mr-2" />
                Add Friend
              </Button>
            )}
            {loginUser?.userId !== userId && isFriend && (
              <Button
                onClick={() => {
                  deletePrompt.show({
                    content: 'You are going to remove this friend.\nAre you confirmed to continue?',
                    onDelete: async () => {
                      await removeFriendMutation.mutateAsync(userId);
                      deletePrompt.hide();
                    },
                  });
                }}
              >
                <MdPersonOff className="mr-1" />
                Remove Friend
              </Button>
            )}
          </HStack>
          <Nav activeKey={viewBy} onSelect={setViewBy} appearance="pills" className="ml-2">
            <Nav.Item eventKey="pin">Pins</Nav.Item>
            <Nav.Item eventKey="board">Pinboards</Nav.Item>
          </Nav>
        </VStack>
      </HStack>
      {viewBy === 'pin' ? (
        <PictureGallery params={{ size: 30, userId: userId }} fetchFn={getPictures} />
      ) : (
        <PinboardGallery params={{ size: 30, userId: userId }} fetchFn={getPinboards} />
      )}{' '}
    </div>
  );
}
