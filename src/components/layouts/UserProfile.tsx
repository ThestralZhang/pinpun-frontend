import { Avatar, Button, Popover, Whisper } from 'rsuite';
import { useAuthStore } from '@/stores/useAuthStore.ts';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

export default function UserProfile() {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onClick = () => {
    if (user?.userId === null || user?.userId === undefined) {
      return;
    } else {
      navigate(`/users/${user?.userId}`);
    }
  };

  const popover = (
    <Popover className="account-avatar-popover min-w-[200px] rounded-2xl! pb-1! mt-0!">
      <div className="font-bold text-[16px] text-center border-b-1 border-gray-400 mb-3 pb-1">
        My Account
      </div>
      <div className="text-gray-400 text-[14px]">User Name</div>
      <div className="text-[14px]">{user?.name}</div>
      <div className="text-gray-400 text-[14px]">Email</div>
      <div className="border-b-1 border-gray-400 pb-3 text-[14px]">{user?.email}</div>
      <div className="text-center">
        <Button
          onClick={() => {
            logout();
            queryClient.clear();
          }}
          appearance="link"
          color="red"
        >
          logout
        </Button>
      </div>
    </Popover>
  );

  return (
    <Whisper trigger="hover" speaker={popover} placement="bottomEnd" enterable>
      <div className="fixed! top-2 right-2">
        <Avatar
          circle
          src={user?.avatarUrl || undefined}
          alt={user?.name.charAt(0).toUpperCase()}
          title={user?.name}
          onClick={onClick}
          className={'cursor-pointer hover:shadow-lg'}
          size="sm"
        />
      </div>
    </Whisper>
  );
}
