import { Avatar, type AvatarProps } from 'rsuite';
import { useNavigate } from 'react-router-dom';
import classnames from 'classnames';
import { useState } from 'react';

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
  const [isHovered, setHovered] = useState(false);

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
      color={isHovered ? 'blue' : undefined}
      bordered={isHovered}
      src={avatarUrl || undefined}
      alt={username?.charAt(0).toUpperCase()}
      title={username}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={classnames(clickable && 'cursor-pointer', className)}
      {...rest}
    />
  );
}
