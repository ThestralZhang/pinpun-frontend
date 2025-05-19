import { Avatar, type AvatarProps, Dropdown, type DropdownProps } from 'rsuite';
import { useNavigate } from 'react-router-dom';
import classnames from 'classnames';
import { FaUserPlus } from 'react-icons/fa6';
import { sendFriendRequest } from '@/api/friend.ts';
import { useAuthStore } from '@/stores/useAuthStore.ts';

interface UserAvatarProps extends AvatarProps {
  userId?: number | null;
  username?: string | null;
  avatarUrl?: string | null;
  placement?: DropdownProps['placement'];
  hoverMenu?: boolean;
  noRedirect?: boolean;
  onRedirect?: () => void;
}

export default function UserAvatar({
  userId,
  avatarUrl,
  username,
  className,
  placement,
  hoverMenu = true,
  noRedirect = false,
  onRedirect,
  ...rest
}: UserAvatarProps) {
  const navigate = useNavigate();
  const loginUser = useAuthStore((s) => s.user);

  const onClickAvatar = (e: Event) => {
    e.stopPropagation();
    if (userId === null || userId === undefined || noRedirect) {
      return;
    } else {
      navigate(`/users/${userId}`);
      onRedirect?.();
    }
  };

  const renderAvatar = () => {
    return (
      <Avatar
        circle
        src={avatarUrl || undefined}
        alt={username?.charAt(0).toUpperCase()}
        title={username}
        onClick={onClickAvatar}
        className={classnames({ 'cursor-pointer hover:shadow-lg': !noRedirect }, className)}
        {...rest}
      />
    );
  };

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const onAddFriend = (e: any) => {
    e.stopPropagation?.();
    if (!userId || userId === loginUser?.userId || !hoverMenu) {
      return;
    }
    sendFriendRequest(userId as number);
  };

  return (
    <Dropdown
      renderToggle={renderAvatar}
      trigger="hover"
      placement={placement}
      className="user-avatar-dropdown"
      disabled={userId === loginUser?.userId || !hoverMenu}
    >
      <Dropdown.Item title="add friend" onClick={onAddFriend}>
        <FaUserPlus className="scale-125 text-blue-400" />
      </Dropdown.Item>
    </Dropdown>
  );
}
