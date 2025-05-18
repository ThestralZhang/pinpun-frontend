import UserInfoForm from '@/components/UserInfoForm.tsx';

export default function ProfileSettings() {
  return (
    <div className="mt-10 w-[700px]">
      <UserInfoForm mode="edit" />
    </div>
  );
}
