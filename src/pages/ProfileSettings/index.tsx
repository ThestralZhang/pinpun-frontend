import UserInfoForm from '@/components/UserInfoForm.tsx';

export default function ProfileSettings() {
  return (
    <div className="mt-10 flex items-start justify-center h-screen">
      <div>
        <UserInfoForm mode="edit" />
      </div>
    </div>
  );
}
