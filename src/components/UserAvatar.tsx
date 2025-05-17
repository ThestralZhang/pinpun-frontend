import { Avatar, type AvatarProps } from 'rsuite';
import { useNavigate } from 'react-router-dom';
import classnames from 'classnames';

interface UserAvatarProps extends AvatarProps {
  userId?: number | null;
  username?: string | null;
  avatarUrl?: string | null;
  clickable?: boolean;
}

export default function UserAvatar({
  userId,
  avatarUrl,
  username,
  clickable = true,
  className,
  ...rest
}: UserAvatarProps) {
  const navigate = useNavigate();

  const onClick = (e: Event) => {
    e.stopPropagation();
    if (!clickable || userId === null || userId === undefined) {
      return;
    } else {
      navigate(`/users/${userId}`);
    }
  };

  return (
    <Avatar
      circle
      src={avatarUrl || undefined}
      alt={username?.charAt(0).toUpperCase()}
      title={username}
      onClick={onClick}
      className={classnames(clickable && 'cursor-pointer hover:shadow-lg', className)}
      {...rest}
    />
  );
}
