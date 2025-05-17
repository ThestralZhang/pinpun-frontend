import { Placeholder, Stack, VStack } from 'rsuite';
import { useQuery } from '@tanstack/react-query';
import { getFriendList } from '@/api/friend.ts';
import UserCard from '@/components/UserCard.tsx';

export default function FriendList() {
  const { data: friendList } = useQuery({
    queryKey: ['friends'],
    queryFn: () => getFriendList(),
  });

  if (!friendList) {
    return (
      <VStack alignItems="center" spacing={20}>
        <Placeholder.Paragraph active className="w-2/3 min-w-[400px]" />
        <Placeholder.Paragraph active className="w-2/3 min-w-[400px]" />
        <Placeholder.Paragraph active className="w-2/3 min-w-[400px]" />
        <Placeholder.Paragraph active className="w-2/3 min-w-[400px]" />
        <Placeholder.Paragraph active className="w-2/3 min-w-[400px]" />
      </VStack>
    );
  }

  if (friendList.length === 0) {
    return <div className="text-center text-xl text-gray-400">No friends yet~</div>;
  }

  return (
    <Stack wrap className="mx-auto w-fit max-w-3/4" spacing={20}>
      {friendList.map((f) => (
        <Stack.Item key={`${f.userId}`} className="inline-block">
          <UserCard {...f} />
        </Stack.Item>
      ))}
    </Stack>
  );
}
