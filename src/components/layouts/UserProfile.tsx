import { Button, Popover, Whisper } from 'rsuite';
import { useAuthStore } from '@/stores/useAuthStore.ts';
import UserAvatar from '@/components/UserAvatar.tsx';

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
    <Whisper trigger="hover" speaker={popover} placement="bottomEnd" enterable>
      <div className="fixed! top-2 right-2">
        <UserAvatar
          avatarUrl={user?.avatarUrl}
          userId={user?.userId}
          username={user?.name}
          size="sm"
        />
      </div>
    </Whisper>
  );
}
