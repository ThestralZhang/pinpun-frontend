import { HStack, IconButton, Input, List, Placeholder, Stack, VStack } from 'rsuite';
import UserAvatar from '@/components/UserAvatar.tsx';
import { getDateTimeString, timeAgo } from '@/utils';
import { Close, Send } from '@rsuite/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { commentOnPicture, deleteCommentOnPicture, getCommentsOnPicture } from '@/api/picture.ts';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore.ts';
import { useModal } from '@ebay/nice-modal-react';
import DeletePromptModal from '@/components/DeletePromptModal.tsx';

export default function CommentArea({
  pictureId,
  pinboardId,
  onClose,
}: {
  pictureId: number;
  pinboardId: number;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const loginUser = useAuthStore((s) => s.user);
  const deletePromptModal = useModal(DeletePromptModal);

  const [myComment, setMyComment] = useState('');

  const [hoveringId, setHoveringId] = useState<number | null>(null);

  const { data: commentData } = useQuery({
    queryKey: ['comments', { pinboardId, pictureId }],
    queryFn: () => getCommentsOnPicture(pinboardId, pictureId, { page: 1, size: 10 }),
    enabled: !!pinboardId && !!pictureId,
  });

  const postCommentMutation = useMutation({
    mutationFn: () => commentOnPicture(pinboardId, pictureId, myComment),
    onSuccess: () => {
      setMyComment('');
    },
    onError: () => {},
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => deleteCommentOnPicture(commentId),
  });

  if (!commentData) {
    return (
      <>
        <Placeholder.Paragraph active graph="circle" className="mt-3" />
        <Placeholder.Paragraph active graph="circle" className="mt-3" />
        <Placeholder.Paragraph active graph="circle" className="mt-3" />
        <Placeholder.Paragraph active graph="circle" className="mt-3" />
        <Placeholder.Paragraph active graph="circle" className="mt-3" />
      </>
    );
  }

  return (
    <VStack alignItems="stretch" justifyContent="space-between" className="h-full">
      <Stack.Item grow={1} className="overflow-auto max-h-[420px]">
        {commentData.totalCount === 0 ? (
          <div className="text-center mt-3 text-gray-400">No one has commented yet~</div>
        ) : (
          <List>
            {commentData.data.map((c) => (
              <List.Item
                key={c.id}
                onMouseEnter={() => setHoveringId(c.id)}
                onMouseLeave={() => setHoveringId(null)}
              >
                <div className="relative">
                  <HStack alignItems="flex-start">
                    <Stack.Item shrink={0} grow={0}>
                      <UserAvatar
                        userId={c.userId}
                        username={c.username}
                        avatarUrl={c.userAvatarUrl}
                        size="md"
                        placement="rightStart"
                        onRedirect={onClose}
                      />
                    </Stack.Item>
                    <VStack className="grow">
                      <HStack justifyContent="space-between" className="w-full">
                        <div
                          className="font-bold cursor-pointer hover:text-blue-400 hover:underline"
                          onClick={() => {
                            onClose();
                            navigate(`/users/${c.userId}`);
                          }}
                        >
                          {c.username}
                        </div>
                        <div className="text-gray-400 mr-2" title={getDateTimeString(c.createdAt)}>
                          {timeAgo(c.createdAt)}
                        </div>
                      </HStack>
                      <div className="break-words break-all mr-2">{c.content}</div>
                    </VStack>
                  </HStack>
                  {hoveringId === c.id && c.userId === loginUser?.userId && (
                    <IconButton
                      icon={<Close />}
                      className="absolute! top-0 right-2 hover:shadow-lg bg-white!"
                      circle
                      title="delete comment"
                      size="xs"
                      appearance="ghost"
                      onClick={() => {
                        deletePromptModal.show({
                          content:
                            'You are going to delete your comment on this pin.\nAre you confirmed to continue?',
                          onDelete: () => deleteCommentMutation.mutateAsync(c.id),
                        });
                      }}
                    />
                  )}
                </div>
              </List.Item>
            ))}
          </List>
        )}
      </Stack.Item>
      <Stack.Item grow={0} shrink={0}>
        <div className="relative">
          <Input
            as="textarea"
            rows={4}
            className="resize-none! pr-10!"
            placeholder="What do you think?"
            value={myComment}
            onChange={setMyComment}
          />
          <IconButton
            disabled={myComment.trim().length === 0}
            className="absolute! right-1 bottom-1"
            size="sm"
            icon={<Send />}
            onClick={() => {
              postCommentMutation.mutateAsync();
            }}
          />
        </div>
      </Stack.Item>
    </VStack>
  );
}
