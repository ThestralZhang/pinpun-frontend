import { memo, useState } from 'react';
import { Card, HStack, ButtonGroup, IconButton, VStack } from 'rsuite';
import type { User } from '@/types';
import UserAvatar from '@/components/UserAvatar.tsx';
import { MdPersonOff } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import classnames from 'classnames';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeFriend } from '@/api/friend.ts';
import { useModal } from '@ebay/nice-modal-react';
import DeletePromptModal from '@/components/DeletePromptModal.tsx';

interface UserCardProps extends User {
  className?: string;
}

function UserCard(props: UserCardProps) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const deletePrompt = useModal(DeletePromptModal);
  const queryClient = useQueryClient();

  const removeFriendMutation = useMutation({
    mutationFn: (userId: number) => removeFriend(userId),
    onSuccess: () => {
      queryClient.setQueriesData<User[]>({ queryKey: ['friends'] }, (oldData) => {
        if (!oldData) return oldData;
        return oldData.filter((u) => u.userId !== props.userId);
      });
    },
  });

  return (
    <Card
      width={280}
      className={classnames(props.className, 'user-card rounded-2xl! px-4 py-3 h-[100px]')}
      shaded="hover"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/users/${props.userId}`)}
    >
      <HStack spacing={10} alignItems="center" className="h-full">
        <UserAvatar
          userId={props.userId}
          username={props.name}
          avatarUrl={props.avatarUrl}
          size="lg"
          hoverMenu={false}
        />
        <VStack className="grow-0 shrink" spacing={0}>
          <div className="text-lg font-bold">{props.name}</div>
          <div className="text-gray-500 max-h-[60px] line-clamp-3 w-[180px]" title={props.about}>
            {props.about}
          </div>
        </VStack>
      </HStack>
      {hovered && (
        <div className="card-actions-wrapper w-full h-[50px] absolute bottom-0">
          <ButtonGroup className="float-right mt-2 mr-6">
            <IconButton
              icon={<MdPersonOff className="text-blue-500 scale-125" />}
              size="md"
              circle
              className="shadow-lg bg-white"
              title="Remove Friend"
              onClick={(e) => {
                e.stopPropagation();
                deletePrompt.show({
                  content: 'You are going to remove this friend.\nAre you confirmed to continue?',
                  onDelete: async () => {
                    await removeFriendMutation.mutateAsync(props.userId);
                    deletePrompt.hide();
                  },
                });
              }}
            />
          </ButtonGroup>
        </div>
      )}
    </Card>
  );
}

export default memo(UserCard);
