import { Card, HStack, List, Placeholder, VStack } from 'rsuite';
import { useQuery } from '@tanstack/react-query';
import { getSentFriendRequests } from '@/api/friend.ts';
import UserAvatar from '@/components/UserAvatar.tsx';
import { getDateTimeString } from '@/utils';
import { FaCircleCheck, FaCircleXmark, FaRegClock } from 'react-icons/fa6';
import classnames from 'classnames';
import { useNavigate } from 'react-router-dom';

export default function SentRequestList() {
  const navigate = useNavigate();

  const { data: requestList } = useQuery({
    queryKey: ['sent-requests'],
    queryFn: () => getSentFriendRequests(),
  });

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
          </Card>
        </List.Item>
      ))}
    </List>
  );
}
