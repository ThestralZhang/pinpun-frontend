import { Button, Popover, Whisper, Avatar } from 'rsuite';
import { useAuthStore } from '@/stores/useAuthStore.ts';

export default function UserProfile() {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const popover = (
    <Popover title="My Account">
      <p>{user?.name}</p>
      <p>{user?.email}</p>
      <Button onClick={logout}>logout</Button>
    </Popover>
  );

  return (
    <Whisper trigger="click" speaker={popover} placement="bottomEnd">
      <Avatar circle size="sm" className="fixed! top-2 right-2">
        {user?.name?.charAt(0).toUpperCase()}
      </Avatar>
    </Whisper>
  );
}
