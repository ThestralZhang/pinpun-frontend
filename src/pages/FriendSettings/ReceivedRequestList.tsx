import { Button, Card, Divider, HStack, List, Placeholder, VStack } from 'rsuite';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  acceptFriendRequest,
  getReceivedFriendRequests,
  rejectFriendRequest,
} from '@/api/friend.ts';
import UserAvatar from '@/components/UserAvatar.tsx';
import { getDateTimeString } from '@/utils';
import { FaCheck, FaCircleCheck, FaCircleXmark, FaRegClock, FaXmark } from 'react-icons/fa6';
import classnames from 'classnames';
import { useNavigate } from 'react-router-dom';
import type { FriendRequest } from '@/types';

export default function ReceivedRequestList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: requestList } = useQuery({
    queryKey: ['received-requests'],
    queryFn: () => getReceivedFriendRequests(),
  });

  const acceptMutation = useMutation({
    mutationFn: (userId: number) => acceptFriendRequest(userId),
  });

  const onAccept = async (userId: number, requestedAt: Date) => {
    await acceptMutation.mutateAsync(userId);
    queryClient.setQueriesData<FriendRequest[]>({ queryKey: ['received-requests'] }, (oldData) => {
      if (!oldData) return oldData;
      return oldData.map((r) =>
        r.userId === userId && r.requestedAt.getTime() === requestedAt.getTime()
          ? { ...r, status: 'ACCEPTED' }
          : r,
      );
    });
  };

  const rejectMutation = useMutation({
    mutationFn: (userId: number) => rejectFriendRequest(userId),
  });

  const onReject = async (userId: number, requestedAt: Date) => {
    await rejectMutation.mutateAsync(userId);
    queryClient.setQueriesData<FriendRequest[]>({ queryKey: ['received-requests'] }, (oldData) => {
      if (!oldData) return oldData;
      return oldData.map((r) =>
        r.userId === userId && r.requestedAt.getTime() === requestedAt.getTime()
          ? { ...r, status: 'REJECTED' }
          : r,
      );
    });
  };

  if (!requestList) {
    return (
      <VStack alignItems="center" spacing={20}>
        <Placeholder.Paragraph active graph="circle" className="w-2/3 min-w-[400px]" />
        <Placeholder.Paragraph active graph="circle" className="w-2/3 min-w-[400px]" />
        <Placeholder.Paragraph active graph="circle" className="w-2/3 min-w-[400px]" />
        <Placeholder.Paragraph active graph="circle" className="w-2/3 min-w-[400px]" />
        <Placeholder.Paragraph active graph="circle" className="w-2/3 min-w-[400px]" />
      </VStack>
    );
  }

  if (requestList.length === 0) {
    return <div className="text-center text-xl text-gray-400">No requests yet~</div>;
  }

  return (
    <List className="w-2/3 m-auto min-w-[400px] max-w-[600px]" divider={false}>
      {requestList.map((r) => (
        <List.Item key={`${r.userId}${r.requestedAt}`}>
          <Card shaded="hover" className="rounded-3xl! px-5 py-3 cursor-default!">
            <VStack alignItems="stretch" spacing={0}>
              <HStack>
                <UserAvatar
                  hoverMenu={false}
                  userId={r.userId}
                  username={r.username}
                  avatarUrl={r.avatarUrl}
                  size="lg"
                />
                <VStack className="grow ml-3" justifyContent="space-between">
                  <div
                    className="font-bold text-lg cursor-pointer hover:text-blue-400 hover:underline"
                    onClick={() => navigate(`/users/${r.userId}`)}
                  >
                    {r.username}
                  </div>
                  <div className="text-gray-500">{getDateTimeString(r.requestedAt)}</div>
                </VStack>
                <HStack
                  className={classnames({
                    'text-emerald-500': r.status === 'ACCEPTED',
                    'text-orange-600': r.status === 'REJECTED',
                    'text-blue-400': r.status === 'PENDING',
                  })}
                >
                  <div>{r.status}</div>
                  <div>
                    {r.status === 'ACCEPTED' && <FaCircleCheck className="scale-125 ml-1" />}
                    {r.status === 'REJECTED' && <FaCircleXmark className="scale-125 ml-1" />}
                    {r.status === 'PENDING' && <FaRegClock className="scale-125 ml-1" />}
                  </div>
                </HStack>
              </HStack>
              {r.status === 'PENDING' && <Divider className="my-3!" />}
              {r.status === 'PENDING' && (
                <HStack justifyContent="space-around" className="px-10">
                  <Button
                    appearance="subtle"
                    size="sm"
                    color="green"
                    className="hover:text-white! font-bold! text-gray-600!"
                    onClick={() => onAccept(r.userId, r.requestedAt)}
                  >
                    <FaCheck className="mr-1" />
                    Accept
                  </Button>
                  <Button
                    appearance="subtle"
                    size="sm"
                    color="red"
                    className="hover:text-white! font-bold! text-gray-600!"
                    onClick={() => onReject(r.userId, r.requestedAt)}
                  >
                    <FaXmark className="mr-2" />
                    Reject
                  </Button>
                </HStack>
              )}
            </VStack>
          </Card>
        </List.Item>
      ))}
    </List>
  );
}
