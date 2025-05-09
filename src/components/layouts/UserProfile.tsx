import { Button, IconButton, Popover, Whisper } from 'rsuite';
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
    <Whisper
      trigger="click"
      speaker={popover}
      placement="bottomEnd"
      // open={open}
      // onOpen={() => setOpen(true)}
    >
      <IconButton
        // icon={<User />}
        circle
        size="lg"
        style={{ position: 'absolute', top: 16, right: 16 }}
      />
    </Whisper>
  );
}
