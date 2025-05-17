import { Divider, Heading, HStack, Placeholder, Tag, TagGroup } from 'rsuite';
import UserAvatar from '@/components/UserAvatar.tsx';
import type { IPictureExtended } from '@/types/picture.ts';
import { useNavigate } from 'react-router-dom';

export default function BasicInfo({
  pictureData,
  onClose,
}: {
  pictureData: IPictureExtended | undefined;
  onClose: () => void;
}) {
  const navigate = useNavigate();

  if (!pictureData) {
    return <Placeholder.Paragraph active rows={8} />;
  }

  return (
    <div>
      <Heading>{pictureData.title}</Heading>
      <div className="text-gray-500 text-lg max-h-[120px] overflow-auto">
        {pictureData.description}
      </div>
      <TagGroup className="mt-3!">
        {pictureData.tags.map((t) => (
          <Tag key={t} className="hover:shadow-sm">
            {t}
          </Tag>
        ))}
      </TagGroup>

      <Divider />

      <HStack alignItems="center" justifyContent="flex-end" className="mb-2">
        <div className="text-right text-gray-500">
          pinned in{' '}
          <span
            className="italic hover:underline cursor-pointer hover:text-blue-400"
            onClick={() => {
              onClose();
              navigate(`/pinboards/${pictureData.pinboardId}`);
            }}
          >
            {pictureData.pinboardName}
          </span>{' '}
          by{' '}
          <span
            className="font-bold cursor-pointer hover:text-blue-400 hover:underline"
            onClick={() => {
              onClose();
              navigate(`/users/${pictureData.userId}`);
            }}
          >
            {pictureData.username}
          </span>
        </div>
        <UserAvatar
          userId={pictureData.userId}
          username={pictureData.username}
          avatarUrl={pictureData.userAvatarUrl}
          size="xs"
          className="shrink-0"
        />
      </HStack>
      <HStack alignItems="center" justifyContent="flex-end">
        <div className="text-right text-gray-500">
          originally pinned in{' '}
          <span
            className="italic hover:underline cursor-pointer hover:text-blue-400"
            onClick={() => {
              onClose();
              navigate(`/pinboards/${pictureData.originalPinboardId}`);
            }}
          >
            {pictureData.originalPinboardName}
          </span>{' '}
          by{' '}
          <span
            className="font-bold hover:underline cursor-pointer hover:text-blue-400"
            onClick={() => {
              onClose();
              navigate(`/users/${pictureData.originalUserId}`);
            }}
          >
            {pictureData.originalUserName}
          </span>
        </div>
        <UserAvatar
          userId={pictureData.originalUserId}
          username={pictureData.originalUserName}
          avatarUrl={pictureData.originalUserAvatarUrl}
          size="xs"
          className="shrink-0"
        />
      </HStack>

      <div className="text-right mt-2">
        {pictureData.srcImgUrl && (
          <a
            href={pictureData.srcImgUrl}
            target="_blank"
            className="text-gray-500! hover:text-blue-400!"
          >
            source image
          </a>
        )}
        {pictureData.srcImgUrl && pictureData.pageUrl && <Divider vertical />}
        {pictureData.pageUrl && (
          <a
            href={pictureData.pageUrl}
            target="_blank"
            className="text-gray-500! hover:text-blue-400!"
          >
            source page
          </a>
        )}
      </div>
    </div>
  );
}
