import { Avatar, type AvatarProps } from 'rsuite';
import { useNavigate } from 'react-router-dom';
import classnames from 'classnames';

interface UserAvatarProps extends AvatarProps {
  userId?: number | null;
  username?: string | null;
  avatarUrl?: string;
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

  const onClick = () => {
    if (!clickable || userId === null || userId === undefined) {
      return;
    } else {
      navigate(`/users/${userId}`);
    }
  };

  return (
    <Avatar
      circle
      src={avatarUrl}
      alt={username?.charAt(0).toUpperCase()}
      onClick={onClick}
      className={classnames(clickable && 'cursor-pointer', className)}
      {...rest}
    />
  );
}
